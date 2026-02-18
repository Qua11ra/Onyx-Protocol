// SPDX-License-Identifier: MIT
pragma solidity ^0.8.33;

import {IOnyxToken} from "./interfaces/IOnyxToken.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

/// @title OnyxToken
/// @author Vladislav Perelygin
/// @notice A cross-chain rebase stablecoin that adjusts total supply based on Chainlink Price Feeds.
/// @dev This contract uses a share-based system to maintain an elastic supply.

contract OnyxToken is ERC20, IOnyxToken, AccessControl, ReentrancyGuard {

    /*//////////////////////////////////////////////////////////////
                            STATE VARIABLES
    //////////////////////////////////////////////////////////////*/

    bytes32 private constant REBASER_ROLE = keccak256("TOTAL_SUPPLY_CHANGER_ROLE");
    uint256 private constant PRICE_PRECISION = 1e8;

    /// @notice Token Total Supply
    /// @dev It is using instead of ERC20 totalSupply, because ERC20 totalSupply cannot be changed from this contract
    uint256 private tokenTotalSupply;

    /// @notice Token Total Shares
    /// @dev TokenTotalShares displays the value of user shares. 
    /// @dev It is used to calculate the total supply and user balances. 
    /// @dev It is only changed in the update function.
    uint256 private tokenTotalShares;
    address private chainLinkPriceFeed;

    mapping(address user => uint256 share) private shares;

     /*//////////////////////////////////////////////////////////////
                               MODIFIERS
    //////////////////////////////////////////////////////////////*/

    modifier checkValue(uint256 _value) {
        _checkValue(_value);
        _;
    }

    /*//////////////////////////////////////////////////////////////
                               FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    /// @notice Constructor, that sets the Chainlink Price Feed contract, ERC20 parameters and the contract owner
    /// @dev The internal _grantRole function is used because msg.sender somehow fails the checkRole check.
    /// @param _chainLinkPriceFeed The address of the Chainlink Price Feed contract

    constructor(address _chainLinkPriceFeed, address _chainLinkAutomationAddress) ERC20("Onyx Token", "ONYX") {
        chainLinkPriceFeed = _chainLinkPriceFeed;

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(REBASER_ROLE, _chainLinkAutomationAddress);
    }

    /// @notice Function to rebase the total supply
    /// @dev Only the chainlink automation can call this function
    /// @dev I hope chainlinkPriceFeeds answer is not less than 0
    /// @dev Re-calculates tokenTotalSupply using the formula: (TotalShares * Price) / Precision.
    /// @dev tokenTotalShares is using here, because it is changed only in the _update function
    
    function rebase() external onlyRole(REBASER_ROLE) nonReentrant {
        (,int256 answer,,,) = AggregatorV3Interface(chainLinkPriceFeed).latestRoundData();

        uint256 tokenPrice = uint256(answer);
        uint256 oldTotalSupply = tokenTotalSupply;
        
        tokenTotalSupply = (tokenTotalShares * tokenPrice) / PRICE_PRECISION;
        emit Rebased(oldTotalSupply, tokenTotalSupply);
    }

    /// @notice Mint
    /// @dev Only the OnyxTokenEngine contract can call this function, because It takes into account the user's health factor before mint.
    /// @param _to The address of the user, whom the share will be minted
    /// @param _value The amount of shares to mint
    /// @return The amount of user shares minted
    
    function mint(address _to, uint256 _value) external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant checkValue(_value) returns (uint256) {
        _mint(_to, _value);

        emit ShareMinted(_to, _value);
        return shares[_to];
    }

    /// @notice Burn
    /// @dev Only the OnyxTokenEngine contract can call this function, because It takes into account the user's health factor before burn.
    /// @param _from The address of the user, whose the share will be burned
    /// @param _value The amount of shares to burn
    /// @return The amount of user shares burned

    function burn(address _from, uint256 _value) external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant checkValue(_value) returns (uint256) {
        uint256 userBalance = balanceOf(_from);
        require(userBalance >= _value, OnyxToken__InsufficientBalance(userBalance));

        _burn(_from, _value);
        emit ShareBurned(_from, _value);
        return _value;
    }

    /// @notice Update function, overrides the ERC20 update function
    /// @dev Updates the total supply, total shares and user balances
    /// @dev shares calculates using the formula: (value * tokenTotalShares) / tokenTotalSupply
    /// @param from The address from the shares comes
    /// @param to The address to the shares
    /// @param value The amount of shares 

    function _update(address from, address to, uint256 value) internal override {
        if (from == address(0)) {
            uint256 sharesToMint = tokenTotalSupply == 0 ? value : (value * tokenTotalShares / tokenTotalSupply);
            shares[to] += sharesToMint;
            tokenTotalSupply += value;
            tokenTotalShares += sharesToMint;
        } else if (to == address(0)) {
            uint256 sharesToBurn = value * tokenTotalShares / tokenTotalSupply;
            shares[from] -= sharesToBurn;
            tokenTotalSupply -= value;
            tokenTotalShares -= sharesToBurn;
            
        } else {
            uint256 sharesToTransfer = value * tokenTotalShares / tokenTotalSupply;
            shares[from] -= sharesToTransfer;
            shares[to] += sharesToTransfer;
        }
        emit Transfer(from, to, value);
    }

    /*//////////////////////////////////////////////////////////////
                             VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function getChainlinkPriceFeed() public view returns (address) {
        return chainLinkPriceFeed;
    }

    function totalSupply() public view override(ERC20, IOnyxToken) returns (uint256) {
        return tokenTotalSupply;
    }

    function totalShares() public view returns (uint256) {
        return tokenTotalShares;
    }

    function sharesOf(address _account) public view returns (uint256) {
        return shares[_account];
    }
    
    function balanceOf(address account) public view override(ERC20, IOnyxToken) returns (uint256) {
        return tokenTotalSupply == 0 ? 0 : tokenTotalSupply * shares[account] / tokenTotalShares;
    }

    function getSharesByValue(uint256 _value) public view returns (uint256) {
        return tokenTotalSupply == 0 ? 0 : _value * tokenTotalShares / tokenTotalSupply;
    }

    function getValueByShares(uint256 _shares) public view returns (uint256) {
        return tokenTotalShares == 0 ? 0 : _shares * tokenTotalSupply / tokenTotalShares;
    }

    function _checkValue(uint256 _value) internal pure {
        require(_value > 0, OnyxToken__ValueMustBeGreaterThanZero());
    }
}