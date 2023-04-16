require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config({ path: __dirname + '/.env' });

const BLOCK_HEIGHT = 15969633;


  console.log(`Forking Mainnet Block Height ${BLOCK_HEIGHT}`);
  module.exports = {
    networks: {
      hardhat: {
        forking: {
          url: process.env.MAINNET,
          blockNumber: BLOCK_HEIGHT,
        },
      },
    },
    solidity: {
      compilers: [
        {
          version: '0.6.12',
        },
        {
          version: '0.5.12',
        },
        {
          version: '0.8.4',
        },
        {
          version: '0.8.18',
        },
        {
          version: '0.7.0',
        },
        {
          version: '0.6.0',
        },
        {
          version: '0.4.24',
        },
      ],
    },
  };
