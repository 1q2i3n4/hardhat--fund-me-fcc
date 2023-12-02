require("@nomicfoundation/hardhat-toolbox");
//require("@nomiclabs/hardhat-solhint");
require("hardhat-deploy")
require("dotenv").config()
//require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
//require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy-ethers");
require("solidity-coverage")
/** @type import('hardhat/config').HardhatUserConfig */
const Arbitrum_RPC_URL = process.env.Arbitrum_RPC_URL//在这里如果有两个url去切换时，我们可以
//const Arbitrum_RPC_URL = process.env.Arbitrum_RPC_URL||“http:XXXXXX”
const PRIVATE_KEY = process.env.PRIVATE_KEY
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      // gasPrice: 130000000000,
    },
    arbitrum: {
      url: Arbitrum_RPC_URL,//此时，还需要一个私钥
      accounts: [PRIVATE_KEY],//添加私钥
      chainId: 421613,
      blockConfirmations: 6,
      //代表在这里等待6个区块
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
      //在这里没有accounts也没有关系，因为在本地运行时hardhat会自动提供我们10个假帐户
    }
    // sepolia: {
    //   url: SEPOLIA_RPC_URL,
    //   accounts: [PRIVATE_KEY],
    //   chainId: 11155111,
    //   blockConfirmations: 6,
    // },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.7",
      },
      {
        version: "0.6.6",
      },
    ],
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
    // customChains: [], // uncomment this line if you are getting a TypeError: customChains is not iterable
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gas-report.txt",
    noColors: true,
    // coinmarketcap: COINMARKETCAP_API_KEY,
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
  },
  mocha: {
    timeout: 500000,
  },
}
