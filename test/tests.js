const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('Learn Defi', function () {
  
  let deployer;
  let tokensDepository;
  let rAve, rUni, rWeth;

  const amountAave = ethers.utils.parseEther('15');
  const amountUni = ethers.utils.parseEther('5231');
  const amountWeth = ethers.utils.parseEther('33');

  const AAVE_ADDRESS = "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9"
  const UNI_ADDRESS = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
  const WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"

  const AAVE_HOLDER = "0x2efb50e952580f4ff32d8d2122853432bbf2e204";
  const UNI_HOLDER = "0x193ced5710223558cd37100165fae3fa4dfcdc14";
  const WETH_HOLDER = "0x741aa7cfb2c7bf2a1e7d4da2e3df6a56ca4131f3";

  const ONE_ETH = ethers.utils.parseEther('1');

  before(async function () {
    /** SETUP EXERCISE - */

    [deployer] = await ethers.getSigners();

    // Load tokens mainnet contracts
    this.aave = await ethers.getContractAt(
      "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",
      AAVE_ADDRESS
    );
    this.uni = await ethers.getContractAt(
      "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",
      UNI_ADDRESS
    );
    this.weth = await ethers.getContractAt(
      "@openzeppelin/contracts/token/ERC20/IERC20.sol:IERC20",
      WETH_ADDRESS
    );

    // Load holders (accounts which hold tokens on Mainnet)
    this.aaveHolder = await ethers.getImpersonatedSigner(AAVE_HOLDER);
    this.uniHolder = await ethers.getImpersonatedSigner(UNI_HOLDER);
    this.wethHolder = await ethers.getImpersonatedSigner(WETH_HOLDER);

    // Send some ETH to tokens holders
    await deployer.sendTransaction({
      to: this.aaveHolder.address,
      value: ONE_ETH
    });
    await deployer.sendTransaction({
      to: this.uniHolder.address,
      value: ONE_ETH
    });
    await deployer.sendTransaction({
      to: this.wethHolder.address,
      value: ONE_ETH
    });

    this.initialAAVEBalance = await this.aave.balanceOf(this.aaveHolder.address)
    this.initialUNIBalance = await this.uni.balanceOf(this.uniHolder.address)
    this.initialWETHBalance = await this.weth.balanceOf(this.wethHolder.address)

    console.log("AAVE Holder AAVE Balance: ", ethers.utils.formatUnits(this.initialAAVEBalance))
    console.log("UNI Holder UNI Balance: ", ethers.utils.formatUnits(this.initialUNIBalance))
    console.log("WETH Holder WETH Balance: ", ethers.utils.formatUnits(this.initialWETHBalance))
  
  });

  it('Deploy depository and load receipt tokens', async function () {
    /** CODE YOUR SOLUTION HERE */

    // TODO: Deploy your depository contract with the supported assets
    // TODO: Contract deployment
    const tokensDepositoryContract = await ethers.getContractFactory("TokensDepository");
    tokensDepository = await tokensDepositoryContract.deploy();
    
    // TODO: Load receipt tokens into objects under `this` (e.g this.rAve)
    rAve = await ethers.getContractAt("rToken", await tokensDepository.receiptTokens(AAVE_ADDRESS));
    rUni = await ethers.getContractAt("rToken", await tokensDepository.receiptTokens(UNI_ADDRESS));
    rWeth = await ethers.getContractAt("rToken", await tokensDepository.receiptTokens(WETH_ADDRESS));

    console.log("token depository address:", tokensDepository.address);
    console.log("AAVE user rToken:", await rAve.balanceOf(AAVE_HOLDER));
    console.log("UNI user rToken:", await rUni.balanceOf(UNI_HOLDER));
    console.log("WETH user rToken:", await rWeth.balanceOf(WETH_ADDRESS));
    
  });

  it('Deposit tokens tests', async function () {
    /** CODE YOUR SOLUTION HERE */

    // TODO: Deposit Tokens
    // 15 AAVE from AAVE Holder
    await this.aave.connect(this.aaveHolder).approve(tokensDepository.address, amountAave);
    await tokensDepository.connect(this.aaveHolder).depositeToken(amountAave, AAVE_ADDRESS);
    
    // 5231 UNI from UNI Holder
    await this.uni.connect(this.uniHolder).approve(tokensDepository.address, amountUni);
    await tokensDepository.connect(this.uniHolder).depositeToken(amountUni, UNI_ADDRESS);
    
    // 33 WETH from WETH Holder
    await this.weth.connect(this.wethHolder).approve(tokensDepository.address, amountWeth);
    await tokensDepository.connect(this.wethHolder).depositeToken(amountWeth, WETH_ADDRESS);
    
    // TODO: Check that the tokens were sucessfuly transfered to the depository
    expect(await this.aave.balanceOf(tokensDepository.address)).to.equal(amountAave);
    expect(await this.uni.balanceOf(tokensDepository.address)).to.equal(amountUni);
    expect(await this.weth.balanceOf(tokensDepository.address)).to.equal(amountWeth);

    // TODO: Check that the right amount of receipt tokens were minted
    expect(await rAve.balanceOf(AAVE_HOLDER)).to.equal(amountAave);
    expect(await rUni.balanceOf(UNI_HOLDER)).to.equal(amountUni);
    expect(await rWeth.balanceOf(WETH_HOLDER)).to.equal(amountWeth);

    console.log("AAVE user rToken:", await rAve.balanceOf(AAVE_HOLDER));
    console.log("UNI user rToken:", await rUni.balanceOf(UNI_HOLDER));
    console.log("WETH user rToken:", await rWeth.balanceOf(WETH_HOLDER));
    
  });

  it('Withdraw tokens tests', async function () {
    /** CODE YOUR SOLUTION HERE */

    // TODO: Withdraw ALL the Tokens
    await tokensDepository.connect(this.aaveHolder).withdrawalToken(amountAave, AAVE_ADDRESS);
    await tokensDepository.connect(this.uniHolder).withdrawalToken(amountUni, UNI_ADDRESS);
    await tokensDepository.connect(this.wethHolder).withdrawalToken(amountWeth, WETH_ADDRESS);
    
    // TODO: Check that the right amount of tokens were withdrawn (depositors got back the assets)
    expect(await this.aave.balanceOf(this.aaveHolder.address)).to.equal(this.initialAAVEBalance);
    expect(await this.uni.balanceOf(this.uniHolder.address)).to.equal(this.initialUNIBalance);
    expect(await this.weth.balanceOf(this.wethHolder.address)).to.equal(this.initialWETHBalance);
    
    // TODO: Check that the right amount of receipt tokens were burned
    expect(await rAve.balanceOf(AAVE_HOLDER)).to.equal(0);
    expect(await rUni.balanceOf(UNI_HOLDER)).to.equal(0);
    expect(await rWeth.balanceOf(WETH_HOLDER)).to.equal(0);
  });


});
