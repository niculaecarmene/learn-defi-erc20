//SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {rToken} from "./rToken.sol";

/**
 * @title TokensDepository
 */
contract TokensDepository is Ownable{

    mapping(address => rToken) public receiptTokens;

    // TODO: Complete this contract functionality
    address public constant _aaveAddress = 0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9;
    address public constant _uniAddress = 0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984;
    address public constant _wethAddress = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2;

    modifier validateTokenAddress(address _address) {
        require(_address == _aaveAddress || 
                _address == _uniAddress || 
                _address == _wethAddress, "wrong token address!");
        _;
    }

    constructor() {
        _transferOwnership(msg.sender);

        receiptTokens[_aaveAddress] = new rToken(_aaveAddress, 'Wrapper for rToken Aave', 'RTA');
        receiptTokens[_uniAddress] = new rToken(_uniAddress, 'Wrapper for rToken Uni', 'RTU');
        receiptTokens[_wethAddress] = new rToken(_wethAddress, 'Wrapper for rToken Weth', 'RTW');
    }

    function depositeToken(uint256 amount, address tokenAddress) validateTokenAddress(tokenAddress) public{
        
        bool success = IERC20(tokenAddress).transferFrom(msg.sender, address(this), amount);
        require(success, "Transfer failed");
        
        receiptTokens[tokenAddress].mint(msg.sender, amount);
    }

    function withdrawalToken(uint256 amount, address tokenAddress) validateTokenAddress(tokenAddress) public {
        require(amount <= receiptTokens[tokenAddress].balanceOf(msg.sender), 
                            'There is not enough tokens in your account!');
        bool succesBurn = receiptTokens[tokenAddress].burn(msg.sender, amount);

        bool success = IERC20(tokenAddress).transfer(msg.sender, amount);

        if (!success && succesBurn) {
            receiptTokens[tokenAddress].mint(msg.sender, amount);
        }
        require(success, "Transfer failed");
    }
}