// SPDX-License-Identifier: MIT
pragma solidity ^0.8.33;

import {Test, console} from "forge-std/Test.sol";
import {IOnyxStablecoinEngine} from "src/interfaces/IOnyxStablecoinEngine.sol";
import {IOnyxToken} from "src/interfaces/IOnyxToken.sol";
import {DeployOnyx} from "script/DeployOnyx.s.sol";
import {HelperConfig} from "script/HelperConfig.s.sol";
import {OnyxHandler} from "test/fuzz/Handler.t.sol";

contract Invariants is Test {
    HelperConfig helperConfig;
    IOnyxToken onyxToken;
    IOnyxStablecoinEngine onyxEngine;
    OnyxHandler handler;

    function setUp() external {
        (address onyxTokenAddress, address onyxEngineAddress, address helperConfigAddress) = new DeployOnyx().run();
        
        onyxToken = IOnyxToken(onyxTokenAddress);
        onyxEngine = IOnyxStablecoinEngine(onyxEngineAddress);
        helperConfig = HelperConfig(helperConfigAddress);

        handler = new OnyxHandler(helperConfig, onyxToken, onyxEngine);
        targetContract(address(handler));
    }

    function invariant_sumOfUserSharesMustEqualTotalSupply() external view {
        
    }
}