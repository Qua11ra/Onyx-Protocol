// SPDX-License-Identifier: MIT
pragma solidity ^0.8.33;

import {Script} from "forge-std/Script.sol";
import {OnyxStablecoinEngine} from "../src/OnyxStablecoinEngine.sol";
import {HelperConfig} from "./HelperConfig.s.sol";
import {OnyxToken} from "../src/OnyxToken.sol";
import {ERC20Mock} from "@openzeppelin/contracts/mocks/token/ERC20Mock.sol";
import {MockV3Aggregator} from "../test/mocks/MockV3Aggregator.t.sol";

contract DeployOnyx is Script {
    address[] public collaterals;
    address[] public priceFeeds;

    address fakeChainlinkAutomation = makeAddr("fakeChainlinkAutomation");
        uint8 decimals = 8;
        int256 mockToken1InitialPrice = 200e8;
     int256 mockToken2InitialPrice = 1000e8;
    int256 onyxTokenInitialPrice = 1e8;

    function run() external returns(address onyxTokenAddress, address helperConfigAddress, address onyxStablecoinEngineAddress) {
        vm.startBroadcast();
        ERC20Mock wEthMock = new ERC20Mock();
        ERC20Mock wBtcMock = new ERC20Mock();

        MockV3Aggregator wEthAggregator = new MockV3Aggregator(decimals, mockToken1InitialPrice);
        MockV3Aggregator wBtcAggregator = new MockV3Aggregator(decimals, mockToken2InitialPrice);
        MockV3Aggregator onyxV3Aggregator = new MockV3Aggregator(decimals, onyxTokenInitialPrice);

        HelperConfig helperConfig = new HelperConfig(address(onyxV3Aggregator), address(wEthMock), address(wBtcMock), address(wEthAggregator), address(wBtcAggregator), fakeChainlinkAutomation);
        HelperConfig.NetworkConfig memory networkConfig = helperConfig.getConfig();

        OnyxToken onyxToken = new OnyxToken(networkConfig.chainlinkPriceFeed, networkConfig.chainlinkAutomation);
        vm.stopBroadcast();

        onyxTokenAddress = address(onyxToken);
        helperConfigAddress = address(helperConfig);

        HelperConfig.NetworkConfig memory config = HelperConfig(helperConfigAddress).getConfig();

        if (block.chainid == 31337) {
            collaterals.push(config.wEth);
            priceFeeds.push(config.wEthPriceFeed);
            collaterals.push(config.wBtc);
            priceFeeds.push(config.wBtcPriceFeed);
        }
        
        vm.startBroadcast();
        OnyxStablecoinEngine onyxStablecoinEngine = new OnyxStablecoinEngine(onyxTokenAddress, collaterals, priceFeeds);
        vm.stopBroadcast();

        onyxStablecoinEngineAddress = address(onyxStablecoinEngine);
    }
}