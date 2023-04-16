//SPDX-License-Identifier: UNLICENSED 
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


/**
 * @title rToken
 */
contract rToken is ERC20, Ownable {

    // TODO: Complete this contract functionality
    address public underlyingToken;

    modifier validateAddress(address _address) {
        require(_address != address(0), "wrong address!");
        _;
    }
    
    constructor(address _underlyingToken, string memory _name, string memory _symbol)
    ERC20(_name, _symbol) validateAddress(_underlyingToken){
        _transferOwnership(msg.sender);
        underlyingToken = _underlyingToken;
    }

    function mint(address to, uint256 tokenId) onlyOwner public {
        _mint(to, tokenId);
    }

    function burn(address account, uint256 tokenId) onlyOwner public returns (bool){
        uint256 beforeBurn = balanceOf(account);
        _burn(account, tokenId);

        uint256 afterBurn = balanceOf(account);
        if (beforeBurn == afterBurn) {
            return false;
        }

        return true;
    }
}
