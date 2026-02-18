// SPDX-License-Identifier: MIT
pragma solidity ^0.8.33;

import {IOnyxToken} from "./interfaces/IOnyxToken.sol";
import {IOnyxStablecoinEngine} from "./interfaces/IOnyxStablecoinEngine.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

/// @title Onyx Stablecoin Engine
/// @author Vladislav Perelygin
/// @notice The core engine responsible for managing collateral, debt, and liquidations
/// @dev This contract uses a share-based debt system to remain compatible with the Onyx rebase token

contract OnyxStablecoinEngine is IOnyxStablecoinEngine, ReentrancyGuard {
    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/
    
    uint256 private constant MIN_HEALTH_FACTOR = 1e18;
    uint256 private constant LIQUIDATION_THRESHOLD = 50;
    uint256 private constant LIQUIDATION_PRECISION = 100;
    uint256 private constant LIQUIDATION_BONUS = 10;
    uint256 private constant PRECISION = 1e18;
    uint256 private constant ADDITIONAL_FEED_PRECISION = 1e10;
    
    IOnyxToken private immutable i_onyxToken;

    address[] private collateralTokens;
    mapping(address tokenCollateral => address priceFeed) private priceFeeds;
    mapping(address user => mapping(address tokenCollateral => uint256 amount)) private collateralDeposited;
    mapping(address user => uint256) private userDebtShares;

    /*//////////////////////////////////////////////////////////////
                               MODIFIERS
    //////////////////////////////////////////////////////////////*/
    modifier checkHealthFactor() {
        _;
        _revertIfHealthFactorIsBroken(msg.sender);
    }

    modifier checkCollateralToken(address _collateralToken) {
        _checkCollateralToken(_collateralToken);
        _;
    }

    /*//////////////////////////////////////////////////////////////
                               FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Onyx Stablecoin Engine Constructor
    /// @dev Constructor sets the Onyx Token contract, collateral tokens, and price feeds
    /// @param _onyxToken The address of the Onyx Token contract
    /// @param _collateralTokens The addresses of the collateral tokens
    /// @param _priceFeeds The addresses of the price feeds    

    constructor(address _onyxToken, address[] memory _collateralTokens, address[] memory _priceFeeds) {
        i_onyxToken = IOnyxToken(_onyxToken);

        if (_collateralTokens.length != _priceFeeds.length) {
            revert OnyxStablecoinEngine__TokenAddressesAndPriceFeedsAddressesMustBeSameLength();
        }

        for (uint256 i = 0; i < _collateralTokens.length; ++i) {
            collateralTokens.push(_collateralTokens[i]);
            priceFeeds[_collateralTokens[i]] = _priceFeeds[i];
        }
    }

    /// @notice Unites deposit and mint functions for user convenience
    /// @dev User can deposit collateral and mint Onyx Tokens in one transaction
    /// @param _tokenCollateral The address of the collateral token.
    /// @param _amountCollateral The amount of collateral to deposit.

    function depositCollateralAndMintOnyxTokens(address _tokenCollateral, uint256 _amountCollateral) external {
        depositCollateral(_tokenCollateral, _amountCollateral);

        uint256 tokenAmount = getTokenAmountFromUsd(_tokenCollateral, _amountCollateral);
        mintOnyxToken(tokenAmount);
    }

    /// @notice Unites redeem and burn functions for user convenience
    /// @dev User can redeem collateral and burn Onyx Tokens in one transaction
    /// @param _tokenCollateral The address of the collateral token.
    /// @param _amountCollateral The amount of collateral to redeem.
    /// @param _amountToBurn The amount of Onyx Tokens to burn.

    function redeemCollateralAndBurnOnyxTokens(address _tokenCollateral, uint256 _amountCollateral, uint256 _amountToBurn) external {
        burnOnyxToken(_amountToBurn);
        redeemCollateral(_tokenCollateral, _amountCollateral);
    }

    /// @notice Liquidates a user's debt that is not secured by sufficient collateral and rewards the liquidator
    /// @dev The liquidator should pay off the user's entire debt so that the user`s health factor is ok.
    /// @param _user The user with bad health factor
    /// @param _collateral The address of the collateral token.
    /// @param _debtToCover The amount of debt to liquidate.

    function liquidate(address _user, address _collateral, uint256 _debtToCover) external nonReentrant checkHealthFactor {
        uint256 userHealthFactor = _healthFactor(_user);
        require(userHealthFactor < MIN_HEALTH_FACTOR, OnyxStablecoinEngine__HealthFactorOk(userHealthFactor));

        ///@dev The token debt is converted into shares, which are written off from the user. The tokens are burned by the liquidator.
        ///@dev This system works with a total token supply. We cannot burn a user's tokens because he may have 0 tokens.
        uint256 sharesToCover;
        (sharesToCover, _debtToCover) = _calculateSharesAndAmountToLiquidate(_user, _debtToCover);

        userDebtShares[_user] -= sharesToCover;
        i_onyxToken.burn(msg.sender, _debtToCover);

        uint256 tokenAmountFromDebtCovered = getTokenAmountFromUsd(_collateral, _debtToCover);
        uint256 bonusCollateral = (tokenAmountFromDebtCovered * LIQUIDATION_BONUS) / LIQUIDATION_PRECISION;
        uint256 totalTokenAmountToRedeem = tokenAmountFromDebtCovered + bonusCollateral;

        _redeemCollateral(_collateral, totalTokenAmountToRedeem, _user, msg.sender);

        uint256 endingUserHealthFactor = _healthFactor(_user);
        if (endingUserHealthFactor <= userHealthFactor) revert OnyxStablecoinEngine__UserHealthFactorNotImproved(endingUserHealthFactor);

        emit Liquidated(_user, msg.sender, _debtToCover);
    }

    
    /// @notice User deposits collateral
    /// @dev User must approve the Onyx Stablecoin Engine contract to spend the collateral
    /// @param _tokenCollateral The address of the collateral token.
    /// @param _amountCollateral The amount of collateral to deposit.

    function depositCollateral(address _tokenCollateral, uint256 _amountCollateral) public nonReentrant checkCollateralToken(_tokenCollateral) {
        require(_amountCollateral > 0, OnyxStablecoinEngine__InvalidTokenCollateralAmount());

        collateralDeposited[msg.sender][_tokenCollateral] += _amountCollateral; 
        
        bool success = IERC20(_tokenCollateral).transferFrom(msg.sender, address(this), _amountCollateral);
        
        if (!success) revert OnyxStablecoinEngine__TransferError();
        
        emit CollateralDeposited(msg.sender, _tokenCollateral, _amountCollateral);
    }

    /// @notice User redeems collateral
    /// @param _tokenCollateral The address of the collateral token.
    /// @param _amountCollateral The amount of collateral to redeem.
    
    function redeemCollateral(address _tokenCollateral, uint256 _amountCollateral) public nonReentrant checkCollateralToken(_tokenCollateral) checkHealthFactor {
        require(collateralDeposited[msg.sender][_tokenCollateral] >= _amountCollateral, OnyxStablecoinEngine__InsufficientCollateralDeposited());
        
        _redeemCollateral(_tokenCollateral, _amountCollateral, msg.sender, msg.sender);
        emit CollateralRedeemed(msg.sender, _tokenCollateral, _amountCollateral);
    }

    /// @notice User mints Onyx Token instead of collateral
    /// @dev The debt is recorded in the shares, because Onyx Token is Rebase token.
    /// @dev User`s health factor must be ok after minting
    /// @param _amountTokensToMint The amount of Onyx Token to mint

    function mintOnyxToken(uint256 _amountTokensToMint) public nonReentrant checkHealthFactor {
        userDebtShares[msg.sender] += i_onyxToken.mint(msg.sender, _amountTokensToMint);
    }

    /// @notice User burns Onyx Token instead of collateral
    /// @param _amountTokensToBurn The amount of Onyx Token to burn

    function burnOnyxToken(uint256 _amountTokensToBurn) public nonReentrant {
        uint256 sharesToBurn = i_onyxToken.getSharesByValue(_amountTokensToBurn);
        require(userDebtShares[msg.sender] >= sharesToBurn, OnyxStablecoinEngine__InsufficientTokenBalance());

        userDebtShares[msg.sender] -= i_onyxToken.burn(msg.sender, _amountTokensToBurn);
    }

    /// @notice Internal redeemCollateral function
    /// @dev This function is called by redeemCollateral and liquidate
    /// @param _tokenCollateral The address of the collateral token.
    /// @param _amountCollateral The amount of collateral to redeem.
    /// @param _user The address of the user.
    /// @param _redeemer The address of the redeemer.

    function _redeemCollateral(address _tokenCollateral, uint256 _amountCollateral, address _user, address _redeemer) internal checkHealthFactor {
        collateralDeposited[_user][_tokenCollateral] -= _amountCollateral;

        bool success = IERC20(_tokenCollateral).transfer(_redeemer, _amountCollateral);
        if (!success) revert OnyxStablecoinEngine__TransferError();

    }
    
    /*//////66.67%////////////////////////////////////////////////////////
                            VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice checks health factor
    /// @dev used in checkHealthFactor modifier and liquidate
    /// @param _user The address of the user

    function _revertIfHealthFactorIsBroken(address _user) internal view {
        uint256 userHealthFactor = _healthFactor(_user);
        require(userHealthFactor >= MIN_HEALTH_FACTOR, OnyxStablecoinEngine__InsufficientHealthFactor(_user,userHealthFactor));
    }

    function healthFactor(address _user) public view returns (uint256) {
        return _healthFactor(_user);
    }

    function getAccountInformation(address _user) public view returns (uint256 totalOnyxTokenMinted, uint256 collateralValueInUsd) {
        return _getAccountInformation(_user);
    }

    /// @notice Get the amount of token
    /// @param _token The address of the token
    /// @param _usdValue The amount of USD

    function getTokenAmountFromUsd(address _token, uint256 _usdValue) public view returns (uint256) {
        uint256 tokenAmount = (_usdValue * PRECISION) / (getUsdValue(_token) * ADDITIONAL_FEED_PRECISION);
        return tokenAmount;
    }

    /// @notice Get the amount of token in USD
    /// @param _token The address of the token

    function getUsdValue(address _token) public view returns (uint256) {
        AggregatorV3Interface priceFeed = AggregatorV3Interface(priceFeeds[_token]);
        (,int256 price,,,) = priceFeed.latestRoundData();
        return uint256(price);
    }

    function getPriceFeed(address token) public view returns (address) {
        return priceFeeds[token];
    }

    function getCollateralTokens(uint256 index) public view returns(address) {
        return collateralTokens[index];
    }

    function getUserShares(address _user) public view returns (uint256) {
        return userDebtShares[_user];
    }

    function getUserCollateral(address _user, address _token) public view returns (uint256) {
        return collateralDeposited[_user][_token];
    }

    /// @notice calculates user`s health factor
    /// @dev using the formula: (collateralValueInUsd * LIQUIDATION_THRESHOLD) / LIQUIDATION_PRECISION
    /// @param _user The address of the user
    /// @return user`s health factor

    function _healthFactor(address _user) internal view returns (uint256) {
        (uint256 debtShares, uint256 collateralValueInUsd) = _getAccountInformation(_user);

        if (debtShares == 0) return type(uint256).max;

        uint256 currentDebtValue = i_onyxToken.getValueByShares(debtShares);
        uint256 collateralAdjustedForThreshold = (collateralValueInUsd * LIQUIDATION_THRESHOLD) / LIQUIDATION_PRECISION;

        return (collateralAdjustedForThreshold * PRECISION) / currentDebtValue;
    }

    /// @notice Get user`s total collateral in USD and debt
    /// @param _user The address of the user
    /// @return totalOnyxTokenMinted The amount of user`s Onyx Token minted
    /// @return collateralValueInUsd The amount of user`s collateral in USD
    function _getAccountInformation(address _user) internal view returns (uint256 totalOnyxTokenMinted, uint256 collateralValueInUsd) {
        for (uint256 i = 0; i < collateralTokens.length; ++i) {
            address token = collateralTokens[i];
            collateralValueInUsd += (getUsdValue(token) * collateralDeposited[_user][token] * ADDITIONAL_FEED_PRECISION) / PRECISION;
        }

        return (userDebtShares[_user], collateralValueInUsd);
    }

    /// @notice Calculates the amount of shares and amount to liquidate in liquidate function
    /// @dev If sharesToCover is bigger than userDebtShares[_user], then sharesToCover sets to userDebtShares[_user], and _debtToCover sets to i_onyxToken.getValueByShares(userDebtShares[_user])
    /// @param _user The address of the user
    /// @param _debtToCover The amount of debt to liquidate
    /// @return sharesToCover The calculated amount of shares to liquidate
    /// @return _debtToCover The calculated amount of debt to liquidate
    
    function _calculateSharesAndAmountToLiquidate(address _user, uint256 _debtToCover) internal view returns(uint256, uint256) {
        uint256 sharesToCover = i_onyxToken.getSharesByValue(_debtToCover);
        uint256 userShares = userDebtShares[_user];
        
        if (sharesToCover <= userShares) return (sharesToCover, _debtToCover);

        sharesToCover = userShares;
        _debtToCover = i_onyxToken.getValueByShares(userShares);
    
        return (sharesToCover, _debtToCover);
    }

    function _checkCollateralToken(address _tokenCollateral) internal view {
        require(priceFeeds[_tokenCollateral] != address(0), OnyxStablecoinEngine__InvalidTokenCollateral());
    }
}