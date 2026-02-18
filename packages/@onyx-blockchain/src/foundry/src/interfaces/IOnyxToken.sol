// SPDX-License-Identifier: MIT
pragma solidity ^0.8.33;

import {IERC20} from "@openzeppelin/contracts/interfaces/IERC20.sol";

interface IOnyxToken is IERC20 {
    /*//////////////////////////////////////////////////////////////
                                ERRORS
    //////////////////////////////////////////////////////////////*/

    error OnyxToken__ValueMustBeGreaterThanZero();
    error OnyxToken__InsufficientBalance(uint256 userBalance);

    /*//////////////////////////////////////////////////////////////
                                EVENTS
    //////////////////////////////////////////////////////////////*/

    event ShareMinted(address indexed user, uint256 indexed amount);
    event ShareBurned(address indexed user, uint256 indexed amount);
    event Rebased(uint256 indexed oldTotalSupply, uint256 indexed newTotalSupply);

    /*//////////////////////////////////////////////////////////////
                            FUNCTIONS
    //////////////////////////////////////////////////////////////*/
    
    function rebase() external;
    function mint(address _to, uint256 _value) external returns (uint256);
    function burn(address _from, uint256 _value) external returns (uint256);

    /*//////////////////////////////////////////////////////////////
                          VIEW FUNCTIONS
    //////////////////////////////////////////////////////////////*/

    function getChainlinkPriceFeed() external view returns (address);
    function totalSupply() external view override returns (uint256);
    function totalShares() external view returns (uint256);
    function sharesOf(address _account) external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function getSharesByValue(uint256 _value) external view returns (uint256);
    function getValueByShares(uint256 _shares) external view returns (uint256);
}
