// SPDX-License-Identifier: MIT
pragma solidity ^0.8.33;

import {Test, console} from "forge-std/Test.sol";
import {OnyxToken} from "../../src/OnyxToken.sol";
import {IOnyxToken} from "../../src/interfaces/IOnyxToken.sol";
import {HelperConfig} from "../../script/HelperConfig.s.sol";
import {MockV3Aggregator} from "../../test/mocks/MockV3Aggregator.t.sol";

contract TestOnyxToken is Test {
    address public fakeChainlinkAutomation = makeAddr("fakeChainlinkAutomation");
    OnyxToken onyxToken;
    HelperConfig helperConfig;
    MockV3Aggregator mockV3Aggregator;

    address public owner = makeAddr("owner");
    address public user1 = makeAddr("user1");
    address public user2 = makeAddr("user2");
    address public user3 = makeAddr("user3");

    uint256 constant INITIAL_SUPPLY = 100e18;
    int256 constant INITIAL_TOKEN_PRICE = 1e8;
    int256 constant BIGGER_TOKEN_PRICE = 1e8 + 5e7;
    int256 constant SMALLER_TOKEN_PRICE = 1e8 - 5e7;

    function setUp() public {
        vm.startPrank(owner);
        mockV3Aggregator = new MockV3Aggregator(8, 1e8);
        onyxToken = new OnyxToken(address(mockV3Aggregator), fakeChainlinkAutomation);

        mockV3Aggregator.updateAnswer(1);
        vm.stopPrank();
        assertEq(onyxToken.getChainlinkPriceFeed(), address(mockV3Aggregator), "Address of onyxTokenPriceFeed must be address of mockV3Aggregator");
    }

    function testOnlyOwnerCanCallFunctions() external {
        vm.expectRevert();
        onyxToken.mint(user1, INITIAL_SUPPLY);

        vm.expectRevert();
        onyxToken.burn(user1, INITIAL_SUPPLY);

        vm.startPrank(owner);
        onyxToken.mint(user1, INITIAL_SUPPLY);
        onyxToken.burn(user1, INITIAL_SUPPLY);
        vm.stopPrank();
    }

    function testOnlyChainlinkAutomationCanRebase() external {
        mockV3Aggregator.updateAnswer(1e8 + 1e7);
        
        vm.expectRevert();
        onyxToken.rebase();

        vm.expectRevert();
        vm.prank(owner);
        onyxToken.rebase();

        vm.prank(fakeChainlinkAutomation);
        onyxToken.rebase();
    }

    function testMintTokensAndCheckTotalSupplyAndShares() public {
        assertEq(onyxToken.totalSupply(), 0, "Invalid initial Onyx total supply");

        vm.startPrank(owner);
        onyxToken.mint(user1, INITIAL_SUPPLY);
        vm.stopPrank();
        assertEq(onyxToken.balanceOf(user1), INITIAL_SUPPLY, "Balance of user1 must be eq INITIAL_SUPPLY");
        assertEq(onyxToken.totalSupply(), INITIAL_SUPPLY, "Onyx totalSupply must be eq user1 balance");
        assertEq(onyxToken.totalShares(), INITIAL_SUPPLY, "Onyx totalShares must be eq user1 shares");
    }

    function testEveryUserShares() public {
        vm.startPrank(owner);
        onyxToken.mint(user1, INITIAL_SUPPLY);
        onyxToken.mint(user2, INITIAL_SUPPLY / 2);
        onyxToken.mint(user3, INITIAL_SUPPLY / 5);
        vm.stopPrank();

        assertEq(onyxToken.totalSupply(), INITIAL_SUPPLY + INITIAL_SUPPLY / 2 + INITIAL_SUPPLY / 5, "Onyx totalSupply must be eq sum of users balances");
        assertEq(onyxToken.totalShares(), INITIAL_SUPPLY + INITIAL_SUPPLY / 2 + INITIAL_SUPPLY / 5, "Onyx totalShares must be eq sum of users shares");
        assertEq(onyxToken.sharesOf(user2), INITIAL_SUPPLY / 2, "User2 shares must be eq INITIAL_SUPPLY / 2");
        assertEq(onyxToken.sharesOf(user3), INITIAL_SUPPLY / 5, "User3 shares must be eq INITIAL_SUPPLY / 5");
    }

    function testBurnTokensAndCheckTotalSupplyAndShares() public {
        vm.startPrank(owner);
        onyxToken.mint(user1, INITIAL_SUPPLY);

        assertEq(onyxToken.totalSupply(), INITIAL_SUPPLY, "Onyx totalSupply must be eq INITIAL_SUPPLY");
        assertEq(onyxToken.totalShares(), INITIAL_SUPPLY, "Onyx totalShares must be eq INITIAL_SUPPLY");

        onyxToken.burn(user1, INITIAL_SUPPLY / 2);

        assertEq(onyxToken.totalSupply(), INITIAL_SUPPLY / 2, "Onyx totalSupply must be less that totalSupply before burn");
        assertEq(onyxToken.totalShares(), INITIAL_SUPPLY / 2, "Onyx totalShares must be less that totalSupply before burn");
        assertEq(onyxToken.sharesOf(user1), INITIAL_SUPPLY / 2, "Balance of user2 must be less that his balance before burn");
        vm.stopPrank();
    }

    function testRebase() public {
        testEveryUserShares();
        uint256 initialTotalSupply = onyxToken.totalSupply();

        mockV3Aggregator.updateAnswer(BIGGER_TOKEN_PRICE);

        vm.prank(fakeChainlinkAutomation);
        onyxToken.rebase();

        uint256 biggerTotalSupply = onyxToken.totalSupply();
        assertEq(biggerTotalSupply, initialTotalSupply * uint256(BIGGER_TOKEN_PRICE) / 1e8, "Onyx totalSupply must increase");
        assertEq(onyxToken.totalShares(), INITIAL_SUPPLY + INITIAL_SUPPLY / 2 + INITIAL_SUPPLY / 5, "Onyx totalShares must be constant");

        mockV3Aggregator.updateAnswer(SMALLER_TOKEN_PRICE);

        vm.prank(fakeChainlinkAutomation);
        onyxToken.rebase();

        uint256 smallerTotalSupply = onyxToken.totalSupply();
        assertEq(smallerTotalSupply, initialTotalSupply * uint256(SMALLER_TOKEN_PRICE) / 1e8, "Onyx totalSupply must decrease");
        assertEq(onyxToken.totalShares(), INITIAL_SUPPLY + INITIAL_SUPPLY / 2 + INITIAL_SUPPLY / 5, "Onyx totalShares must be constant");

        mockV3Aggregator.updateAnswer(INITIAL_TOKEN_PRICE);

        vm.prank(fakeChainlinkAutomation);
        onyxToken.rebase();

        assertEq(onyxToken.totalSupply(), initialTotalSupply, "Onyx totalSupply be initialTokenSupply");
        assertEq(onyxToken.totalShares(), INITIAL_SUPPLY + INITIAL_SUPPLY / 2 + INITIAL_SUPPLY / 5, "Onyx totalShares must be constant");
    }

    function testFuzzMintAndRebase(uint256 amount1, uint256 amount2, int256 tokenPrice) public {
        amount1 = bound(amount1, 1e18, 10000e18);
        amount2 = bound(amount2, 1e18, 10000e18);
        tokenPrice = bound(tokenPrice, 1e7, 1e9);

        vm.startPrank(owner);
        onyxToken.mint(user1, amount1);
        onyxToken.mint(user2, amount2);
        vm.stopPrank(); 

        mockV3Aggregator.updateAnswer(tokenPrice);
        vm.prank(fakeChainlinkAutomation);
        onyxToken.rebase();

        uint256 expectedUser1Balance = amount1 * uint256(tokenPrice) / 1e8;
        uint256 expectedUser2Balance = amount2 * uint256(tokenPrice) / 1e8;
        assertApproxEqAbs(onyxToken.balanceOf(user1), expectedUser1Balance, 1, "Balance of user1 must be eq expectedUser1Balance");
        assertApproxEqAbs(onyxToken.balanceOf(user2), expectedUser2Balance, 1, "Balance of user2 must be eq expectedUser2Balance");
    }

    function testTransfer() public {
        vm.prank(owner);
        onyxToken.mint(user1, INITIAL_SUPPLY);

        mockV3Aggregator.updateAnswer(BIGGER_TOKEN_PRICE);
        vm.prank(fakeChainlinkAutomation);
        onyxToken.rebase();

        uint256 user1balance = onyxToken.balanceOf(user1);
        uint256 user1shares = onyxToken.sharesOf(user1);

        vm.prank(user1);
        onyxToken.transfer(user2, user1balance);

        assertEq(onyxToken.balanceOf(user1), 0, "Balance of user1 must be 0");
        assertEq(onyxToken.balanceOf(user2), user1balance, "Balance of user2 must be eq user1 balance before transfer");

        assertEq(onyxToken.sharesOf(user1), 0, "Shares of user1 must be 0");
        assertEq(onyxToken.sharesOf(user2), user1shares, "Shares of user2 must be eq user1 shares before transfer");
    }

    function testTransferFrom() public {
        vm.prank(owner);
        onyxToken.mint(user1, INITIAL_SUPPLY);

        vm.prank(user1);
        onyxToken.approve(user2, INITIAL_SUPPLY);
        vm.prank(user2);
        onyxToken.transferFrom(user1, user3, INITIAL_SUPPLY / 2);
        
        assertEq(onyxToken.balanceOf(user3), INITIAL_SUPPLY / 2, "Balance of user3 must be eq half of user1balance");
        assertEq(onyxToken.balanceOf(user1), INITIAL_SUPPLY / 2, "Balance of user2 must be eq half of his initial balance");

        assertEq(onyxToken.sharesOf(user1), INITIAL_SUPPLY / 2, "Shares of user3 must be eq half of user1shares");
        assertEq(onyxToken.sharesOf(user3), INITIAL_SUPPLY / 2, "Shares of user2 must be eq half of his initial shares");
    }

    function testZeroValueRevert() public {
        vm.expectRevert(IOnyxToken.OnyxToken__ValueMustBeGreaterThanZero.selector);

        vm.prank(owner);
        onyxToken.mint(user1, 0);
    }

    function testGettersCantRevert() public view {
        onyxToken.getChainlinkPriceFeed();
        onyxToken.getSharesByValue(0);
        onyxToken.getValueByShares(0);
        onyxToken.totalSupply();
        onyxToken.totalShares();
        onyxToken.balanceOf(user1);
        onyxToken.sharesOf(user1);
    }
}