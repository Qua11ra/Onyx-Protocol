// SPDX-License-Identifier: MIT
pragma solidity ^0.8.33;

import {Test, console} from "forge-std/Test.sol";
import {IOnyxStablecoinEngine} from "src/interfaces/IOnyxStablecoinEngine.sol";
import {IOnyxToken} from "src/interfaces/IOnyxToken.sol";
import {DeployOnyx} from "script/DeployOnyx.s.sol";
import {HelperConfig} from "script/HelperConfig.s.sol";
import {ERC20Mock} from "@openzeppelin/contracts/mocks/token/ERC20Mock.sol";
import {MockV3Aggregator} from "../mocks/MockV3Aggregator.t.sol";

contract OnyxHandler is Test {
    HelperConfig helperConfig;
    IOnyxToken onyxToken;
    IOnyxStablecoinEngine onyxEngine;

    ERC20Mock wEth;
    ERC20Mock wBtc;

    MockV3Aggregator wEthUsdPriceFeed;
    MockV3Aggregator wBtcUsdPriceFeed;

    constructor(HelperConfig _helperConfig, IOnyxToken _onyxToken, IOnyxStablecoinEngine _onyxEngine) {
        helperConfig = _helperConfig;
        onyxToken = _onyxToken;
        onyxEngine = _onyxEngine;

        HelperConfig.NetworkConfig memory networkConfig = helperConfig.getConfig();

        if (block.chainid == 31337) {
            wEth = ERC20Mock(networkConfig.wEth);
            wBtc = ERC20Mock(networkConfig.wBtc);
            wEthUsdPriceFeed = MockV3Aggregator(networkConfig.wEthPriceFeed);
            wBtcUsdPriceFeed = MockV3Aggregator(networkConfig.wBtcPriceFeed);
        }
    }
}