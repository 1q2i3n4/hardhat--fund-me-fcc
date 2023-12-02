//定义网络配置的地方
const networkConfig = {
    31337: {
        name: "localhost",
    },
    // Price Feed Address, values can be obtained at https://docs.chain.link/data-feeds/price-feeds/addresses
    421613: {
        name: "arbitrum",
        ethUsdPriceFeed: "0x62CAe0FA2da220f43a51F86Db2EDb36DcA9A5A08",
    },
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {//导出
    networkConfig,
    developmentChains,
}