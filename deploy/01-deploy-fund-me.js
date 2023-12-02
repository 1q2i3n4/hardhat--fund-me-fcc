const { network } = require("hardhat")
//导入网络配置
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
//添加验证配置
const { verify } = require("../utils/verify")
//一般部署脚本步骤如下
//import
//main function
//calling of main function
//但是此时不需要2与3步
//因为hardhat-deploy就是在调用我们指定的某个函数
//所以我们就是创建一个函数指定要点用的即可
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    //箭头函数 (此处为异步匿名函数)
    //从hre（=hardhat）中提取两个变量getNamedAccounts与deployments 
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()//getNamedAccounts()就是一个获取namedAccounts的方法
    const chainId = network.config.chainId
    //当使用本地主机或者“hardhat network"时，我们要使用mock,mock也就是一个部署脚本
    //获取不同的喂价地址
    let ethUsdPriceFeedAddress
    if (chainId == 31337) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator")
        ethUsdPriceFeedAddress = ethUsdAggregator.address
    } else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }

    log("----------------------------------------------------")
    log("Deploying FundMe and waiting for confirmations...")
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],//这里用于给构造函数传参也就是priceFeedAddress
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
        //"!!1"表示如果我在networks里面没有写blockConfirmations，则只等待一个区块
    })
    log(`FundMe deployed at ${fundMe.address}`)
    if (
        !developmentChains.includes(network.name) &&
        process.env.ETHERSCAN_API_KEY
    ) //!developmentChains.includes(network.name)如果不包含network.name就进行验证
    //因为我们不想在本地网络上进行验证
    {
        await verify(fundMe.address, [ethUsdPriceFeedAddress])
    }


}
module.exports.tags = ["all", "fundme"]
//hardhat deploy还有一个特点，在运行本地网络时会自动运行所有脚本，并将其添加到node中