// SPDX-License-Identifier: MIT
pragma solidity ^0.8.33;

import {Script} from "forge-std/Script.sol";

contract HelperConfig is Script {
    struct NetworkConfig {
        address chainlinkPriceFeed;
        address chainlinkAutomation;
        address wEth;
        address wBtc;
        address wEthPriceFeed;
        address wBtcPriceFeed;
    }

    NetworkConfig public networkConfig;
    mapping(uint256 => NetworkConfig) public networkConfigs;

    constructor(address _onyxV3Aggregator, address _wEth, address _wBtc, address _wEthPriceFeed, address _wBtcPriceFeed, address _fakeChainlinkAutomation) {
        networkConfig = block.chainid == 31337 ? getOrCreateAnvilNetworkConfig(_onyxV3Aggregator, _wEth, _wBtc, _wEthPriceFeed, _wBtcPriceFeed, _fakeChainlinkAutomation) : getEthSepoliaNetworkConfig();
    }

    function getConfig() external view returns (NetworkConfig memory) {
        return networkConfig;
    }

    function getEthSepoliaNetworkConfig() public pure returns (NetworkConfig memory) { //TODO update sepolia config
        return NetworkConfig({
            chainlinkPriceFeed: 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e, 
            chainlinkAutomation: 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e,
            wEth: 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e,
            wBtc: 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e,
            wEthPriceFeed: 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e,
            wBtcPriceFeed: 0x8A753747A1Fa494EC906cE90E9f37563A8AF630e
        });
    }

    function getOrCreateAnvilNetworkConfig(address _onyxV3Aggregator, address _wEth, address _wBtc, address _wEthPriceFeed, address _wBtcPriceFeed, address _fakeChainlinkAutomation) public returns (NetworkConfig memory) {
        if (networkConfig.chainlinkPriceFeed != address(0)) {
            return networkConfig;
        }

        return NetworkConfig({
            chainlinkPriceFeed: _onyxV3Aggregator,
            chainlinkAutomation: _fakeChainlinkAutomation,
            wEth: _wEth,
            wBtc: _wBtc,
            wEthPriceFeed: _wEthPriceFeed,
            wBtcPriceFeed: _wBtcPriceFeed
        });
    }
}