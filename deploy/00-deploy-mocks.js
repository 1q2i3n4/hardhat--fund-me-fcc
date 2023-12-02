//要部署一个自己的喂价合约，因为本地网络没有任何喂价合约
const { network } = require("hardhat")
const DECIMALS = "8"
const INITIAL_PRICE = "200000000000" // 2000
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()//getNamedAccounts()就是一个获取namedAccounts的方法
    const chainId = network.config.chainId
    if (chainId == 31337) {
        log("Local network detected! Deploying mocks...")
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_PRICE],
        })
        log("Mocks Deployed!")
        log("------------------------------------------------")
        log(
            "You are deploying to a local network, you'll need a local network running to interact"
        )
        log(
            "Please run `npx hardhat console` to interact with the deployed smart contracts!"
        )
        log("------------------------------------------------")
    }
}
module.exports.tags = ["all", "mocks"]
//输入命令”yarn hardhat deploy --tags“
//他就只会运行带有特殊标签的部署脚本
//输入命令”yarn hardhat deploy --tags mocks“意味着它只会运行”deploy-mocks“脚本
