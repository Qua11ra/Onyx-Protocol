// SPDX-License-Identifier: MIT
pragma solidity ^0.8.33;

import {Test, console} from "forge-std/Test.sol";
import {IOnyxStablecoinEngine} from "../../src/interfaces/IOnyxStablecoinEngine.sol";
import {OnyxStablecoinEngine} from "../../src/OnyxStablecoinEngine.sol";
import {OnyxToken} from "../../src/OnyxToken.sol";
import {MockV3Aggregator} from "../mocks/MockV3Aggregator.t.sol";
import {ERC20Mock} from "@openzeppelin/contracts/mocks/token/ERC20Mock.sol";

contract TestOnyxStablecoinEngine is Test {
    address public fakeChainlinkAutomation = makeAddr("fakeChainlinkAutomation");
    ERC20Mock public mockToken;
    OnyxToken public onyxToken;
    OnyxStablecoinEngine public onyxStablecoinEngine;
    
    MockV3Aggregator public onyxTokenAggregator;
    MockV3Aggregator public mockTokenAggregator;

    address public owner = makeAddr("owner");
    address public user1 = makeAddr("user1");
    address public user2 = makeAddr("user2");
    address public user3 = makeAddr("user3");

    uint256 private constant MIN_HEALTH_FACTOR = 1e18;
    uint256 private constant LIQUIDATION_THRESHOLD = 50;
    uint256 private constant LIQUIDATION_PRECISION = 100;
    uint256 private constant LIQUIDATION_BONUS = 10;
    uint256 private constant PRECISION = 1e18;
    uint256 private constant ADDITIONAL_FEED_PRECISION = 1e10;

    uint256 constant COLLATERAL_VALUE = 100e18;
    uint256 constant VALUE_TO_MINT = 100e18;
    int256 constant STABLECOIN_PRICE = 1e8;
    int256 constant INITIAL_MOCKTOKEN_PRICE = 2000e8;

    modifier mintTokens() {
        _mintTokens(user1, COLLATERAL_VALUE, VALUE_TO_MINT);
        _;
    }

    function setUp() external {
        vm.startPrank(owner);
        onyxTokenAggregator = new MockV3Aggregator(8, STABLECOIN_PRICE);
        mockTokenAggregator = new MockV3Aggregator(8, INITIAL_MOCKTOKEN_PRICE);
        onyxToken = new OnyxToken(address(onyxTokenAggregator), fakeChainlinkAutomation);
        mockToken = new ERC20Mock();
        
        address[] memory collateralTokens = new address[](1);
        address[] memory priceFeeds = new address[](1);
        collateralTokens[0] = address(mockToken);
        priceFeeds[0] = address(mockTokenAggregator);
        
        bytes32 adminRole = onyxToken.DEFAULT_ADMIN_ROLE();
        bytes32 rebaserRole = keccak256("TOTAL_SUPPLY_CHANGER_ROLE");
        onyxStablecoinEngine = new OnyxStablecoinEngine(address(onyxToken), collateralTokens, priceFeeds);
        onyxToken.grantRole(adminRole, address(onyxStablecoinEngine));
        onyxToken.revokeRole(adminRole, owner);
        vm.stopPrank();

        assertEq(onyxToken.hasRole(adminRole, address(onyxStablecoinEngine)), true, "OnyxStablecoinEngine must be admin of onyxToken");
        assertEq(onyxToken.hasRole(adminRole, owner), false, "Initial owner must not be admin of onyxToken");
        assertEq(onyxToken.hasRole(rebaserRole, fakeChainlinkAutomation), true, "Chainlink Automation must have rebaser role");
    }

    function testDepositCollateralAndMindTokens(int256 _mockTokenPrice, uint256 _mockTokenValue, uint256 _onyxTokenValue) external {
        _mockTokenPrice = bound(_mockTokenPrice, 1e8, 1e10);
        _mockTokenValue = bound(_mockTokenValue, 3e18, 10000e18);

        uint256 maxOnyxValueForGoodHealthFactor = _mockTokenValue / 3;

        _onyxTokenValue = bound(_onyxTokenValue, 1e18, maxOnyxValueForGoodHealthFactor);

        mockTokenAggregator.updateAnswer(_mockTokenPrice);

        _mintTokens(user1, _mockTokenValue, _onyxTokenValue);

        assertEq(onyxStablecoinEngine.getUserCollateral(user1, address(mockToken)), _mockTokenValue, "Mock Token collateral balance of user1 in the OnyxStablecoinEngine must be eq _mockTokenValue");
        assertEq(onyxStablecoinEngine.getUserShares(user1), _onyxTokenValue, "User1 must have shares eq _onyxTokenValue");
        assertEq(onyxToken.balanceOf(user1), _onyxTokenValue, "Balance of user1 in Onyx Token must be eq _onyxTokenValue");
    }

    function testOnlyOnyxStablecoinEngineCanMintOrBurnOnyxTokens() external {
        vm.expectRevert();
        onyxToken.mint(user1, 1);
        
        vm.expectRevert();
        onyxToken.burn(user1, 1);
    }

    function testMintTokensWithoutDepositCollateral() external {
        vm.expectRevert();
        onyxStablecoinEngine.mintOnyxToken(VALUE_TO_MINT);
    }

    function testHealthIsBrokenIfUserRedeemsMoreThatNecessaryForGoodHealthFactor() external mintTokens {
        vm.expectRevert(abi.encodeWithSelector(IOnyxStablecoinEngine.OnyxStablecoinEngine__InsufficientHealthFactor.selector, user1, 0));

        vm.prank(user1);
        onyxStablecoinEngine.redeemCollateral(address(mockToken), COLLATERAL_VALUE);
    }

    function testBurnOnyxTokens(uint256 _valueToMint, uint256 _valueToBurn) external {
        _valueToMint = bound(_valueToMint, 1e18, 10000e18);
        _valueToBurn = bound(_valueToBurn, 1e18, _valueToMint);

        _mintTokens(user1, _valueToMint, _valueToMint);

        assertEq(onyxToken.balanceOf(user1), _valueToMint, "Balance of user1 must be eq _valueToMint");
        assertEq(onyxStablecoinEngine.getUserShares(user1), _valueToMint, "Shares of user1 must be eq _valueToMint");

        vm.prank(user1);
        onyxStablecoinEngine.burnOnyxToken(_valueToBurn);

        assertEq(onyxToken.balanceOf(user1), _valueToMint - _valueToBurn, "Balance of user1 must be less that his balance before burn");
        assertEq(onyxStablecoinEngine.getUserShares(user1), _valueToMint - _valueToBurn, "Shares of user1 must be less that his shares before burn");
        vm.stopPrank();
    }

    function testLiquidationFailsIfHealthFactorIsNotBroken() external {
        vm.expectRevert(abi.encodeWithSelector(IOnyxStablecoinEngine.OnyxStablecoinEngine__HealthFactorOk.selector, type(uint256).max));
        vm.prank(user2);
        onyxStablecoinEngine.liquidate(user1, address(mockToken), COLLATERAL_VALUE);
    }

    function testUserHealthFactorWillBeBrokenIfCollateralPriceDrops() external mintTokens {
        int256 newMockTokenPrice = 15e7;

        mockTokenAggregator.updateAnswer(newMockTokenPrice);

        _mintTokens(user2, 2 * COLLATERAL_VALUE, VALUE_TO_MINT);

        uint256 VALUE_TO_LIQUIDATE = VALUE_TO_MINT - 1;
        uint256 expectedEndUser1Shares = 1;

        vm.prank(user2);
        onyxStablecoinEngine.liquidate(user1, address(mockToken), VALUE_TO_LIQUIDATE);
        
        assert(onyxStablecoinEngine.healthFactor(user1) >= 1e18);
        assertEq(onyxStablecoinEngine.getUserShares(user1), expectedEndUser1Shares, "Shares of user1 must be eq VALUE_TO_MINT - VALUE_TO_LIQUIDATE"); 
    }

    function testUserHealthFactorNotImproved() external mintTokens {
        int256 newMockTokenPrice = 15e7;

        mockTokenAggregator.updateAnswer(newMockTokenPrice);

        
        _mintTokens(user2, 2 * COLLATERAL_VALUE, VALUE_TO_MINT);

        uint256 VALUE_TO_LIQUIDATE = 1;
        uint256 expectedUserHealthFactorAfterLiquidate = 750000000000000000;
        
        vm.expectRevert(abi.encodeWithSelector(IOnyxStablecoinEngine.OnyxStablecoinEngine__UserHealthFactorNotImproved.selector, expectedUserHealthFactorAfterLiquidate));
        vm.prank(user2);
        onyxStablecoinEngine.liquidate(user1, address(mockToken), VALUE_TO_LIQUIDATE);
    }

    function testUsersDebtCantDecreaseIfUserSendTokens(uint256 _mintValue, uint256 _transferValue) external {
        _mintValue = bound(_mintValue, 1e18, 10000e18);
        _transferValue = bound(_transferValue, 1e18, _mintValue);

        _mintTokens(user1, _mintValue, _mintValue);
        
        uint256 initialUserShares = onyxStablecoinEngine.getUserShares(user1);
        vm.startPrank(user1);
        onyxToken.transfer(user2, _transferValue);

        uint256 newUserShares = onyxStablecoinEngine.getUserShares(user1);

        assertEq(onyxToken.balanceOf(user1), _mintValue - _transferValue, "Balance of user1 must be less that his balance before transfer");
        assertEq(onyxToken.balanceOf(user2), _transferValue, "Balance of user2 must be eq _transferValue");
        assertEq(newUserShares, initialUserShares, "Debt shares of user1 must be constant");
    }

    function testInvalidTokenCollateral() external {
        ERC20Mock unknownMockToken = new ERC20Mock();

        vm.startPrank(user1);
        unknownMockToken.mint(user1, 1);
        unknownMockToken.approve(address(onyxStablecoinEngine), 1);

        vm.expectRevert(IOnyxStablecoinEngine.OnyxStablecoinEngine__InvalidTokenCollateral.selector);
        onyxStablecoinEngine.depositCollateral(address(unknownMockToken), 1);
        vm.stopPrank();
    }

    
    function _mintTokens(address _user, uint256 _collateralValue, uint256 _valueToMint) internal {
        vm.startPrank(_user);
        mockToken.mint(_user, _collateralValue);
        mockToken.approve(address(onyxStablecoinEngine), _collateralValue);

        onyxStablecoinEngine.depositCollateral(address(mockToken), _collateralValue);
        onyxStablecoinEngine.mintOnyxToken(_valueToMint);
        vm.stopPrank();
    }

    function testHealthFactorsAfterRebase() external mintTokens {
        _mintTokens(user2, COLLATERAL_VALUE / 2, VALUE_TO_MINT / 2);

        uint256 user1InitialHealthFactor = onyxStablecoinEngine.healthFactor(user1);
        uint256 user2InitialHealthFactor = onyxStablecoinEngine.healthFactor(user2);

        int256 NEW_STABLECOIN_PRICE = 2 * STABLECOIN_PRICE;
        onyxTokenAggregator.updateAnswer(NEW_STABLECOIN_PRICE);
        
        vm.prank(fakeChainlinkAutomation);
        onyxToken.rebase();

        uint256 user1EndHealthFactor = onyxStablecoinEngine.healthFactor(user1);
        uint256 user2EndHealthFactor = onyxStablecoinEngine.healthFactor(user2);

        assertLt(user1EndHealthFactor, user1InitialHealthFactor, "User`s health factor must decrement");
        assertLt(user2EndHealthFactor, user2InitialHealthFactor, "User`s health factor must decrement");
    }

    function testGettersNeverReverts() external view {
        onyxStablecoinEngine.getCollateralTokens(0);
        onyxStablecoinEngine.getPriceFeed(address(mockToken));
        onyxStablecoinEngine.getUserCollateral(user1, address(mockToken));
        onyxStablecoinEngine.getUserShares(user1);
        onyxStablecoinEngine.getAccountInformation(user1);
        onyxStablecoinEngine.healthFactor(user1);
        onyxStablecoinEngine.getUsdValue(address(mockToken));
    }
}