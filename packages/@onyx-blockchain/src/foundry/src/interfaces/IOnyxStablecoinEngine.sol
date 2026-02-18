// SPDX-License-Identifier: MIT
pragma solidity ^0.8.33;

interface IOnyxStablecoinEngine {
    /*//////////////////////////////////////////////////////////////
                                 ERRORS
    //////////////////////////////////////////////////////////////*/

    error OnyxStablecoinEngine__TokenAddressesAndPriceFeedsAddressesMustBeSameLength();
    error OnyxStablecoinEngine__UserHealthFactorNotImproved(uint256 userHealthFactor);
    error OnyxStablecoinEngine__InsufficientHealthFactor(address user, uint256 userHealthFactor);
    error OnyxStablecoinEngine__HealthFactorOk(uint256 userHealthFactor);
    error OnyxStablecoinEngine__InsufficientCollateralDeposited();
    error OnyxStablecoinEngine__InvalidTokenCollateralAmount();
    error OnyxStablecoinEngine__InsufficientTokenBalance();
    error OnyxStablecoinEngine__InvalidTokenCollateral();
    error OnyxStablecoinEngine__TransferError();
    
    /*//////////////////////////////////////////////////////////////
                                 EVENTS
    //////////////////////////////////////////////////////////////*/
    
    event CollateralDeposited(address indexed user, address indexed tokenCollateralAddress, uint256 indexed amountCollateral);
    event CollateralRedeemed(address indexed user, address indexed tokenCollateralAddress, uint256 indexed amountCollateral);
    event Liquidated(address indexed user, address indexed liquidator, uint256 indexed debtToLiquidate);

    /*//////////////////////////////////////////////////////////////
                            FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function liquidate(address _user, address _collateral, uint256 _debtToCover) external;
    function depositCollateral(address _tokenCollateral, uint256 _amountCollateral) external;
    function redeemCollateral(address _tokenCollateral, uint256 _amountCollateral) external;
    function mintOnyxToken(uint256 _amountTokensToMint) external;
    function burnOnyxToken(uint256 _amountTokensToBurn) external;

    /*//////////////////////////////////////////////////////////////
                            VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function healthFactor(address _user) external view returns (uint256);
    function getAccountInformation(address _user) external view returns (uint256 totalOnyxTokenMinted, uint256 collateralValueInUsd);
    function getTokenAmountFromUsd(address _token, uint256 _usdValue) external view returns (uint256);
    function getUsdValue(address _token) external view returns (uint256);
    function getPriceFeed(address token) external view returns (address);
    function getCollateralTokens(uint256 index) external view returns(address);
    function getUserShares(address _user) external view returns (uint256);
    function getUserCollateral(address _user, address _token) external view returns (uint256);
}