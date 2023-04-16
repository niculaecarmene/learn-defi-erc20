# Learn DEFI - ERC20 Tokens

In this project I am playing around with ERC20 tokens, basically you can give AAVE, UNI and WETH tokens and in return receive a new token RTA, RTU, RTW. The new tokens can be returned back anytime and then the initial tokens will be received by the user.

# Steps to create project - run the commands below

mkdir learn-defi-star
cd learn-defi-star
npm init --yes
npm install --save-dev hardhat

// only for Windows users
npm install --save-dev @nomicfoundation/hardhat-toolbox

npx hardhat

npm install @openzeppelin/contracts

npm install dotenv

npx hardhat compile

# Contract explanations

    rToken Contract
        ✔ Extends ERC20 and Ownable
        ✔ ERC20 to mint/burn tokens etc
        ✔ Ownable to make sure that the address that will deploy the contract is always the owner 

    TokensDepository contract
        ✔ Extends Ownable
        ✔ It has setup as constants the AAVE, UNI and WETH addresses, like this no other tokens can be accepted
        ✔ There is also a modifier to check if the tokens are from the contracts specified above
        ✔ Function depositeToken to deposite one of the accepted tokens and to mint one of the RTA, RTU, RTW tokens
        ✔ Function withdrawalToken to take back the tokens that were deposited and then to burn the tokens minted

# Testing and deployment happens on mainnet block 15969633

    Check the hardhat.config.js to see the exact configuration

# Tests - test/tests.js

    Test deposit function
        ✔ Deposit all 3 type of tokens
        ✔ Check if the contract ownes now the correct amount of tokens
        ✔ Check if the test addresses have received the receipt tokens

    Test withdraw function
        ✔ Withdraw the deposited tokens
        ✔ Check if the contract have send back the right tokens amount
        ✔ Check if the receipt tokens were burned

# Test - run the command below
npx hardhat test test/tests.js
