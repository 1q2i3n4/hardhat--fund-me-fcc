const { assert } = require("chai")
const { network, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
//let variable = true
//let someVer = variable ?"yes":"no"//if 三目运算符

describe("FundMe Staging Tests", function () {
    let deployer
    let fundMe
    const sendValue = "1000000000000000000"
    beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(["all"])//fixture允许我们运行整个deploy文件夹，all一个标签
        fundMe = await ethers.getContract("FundMe", deployer)
    })

    it("allows people to fund and withdraw", async function () {
        const fundTxResponse = await fundMe.fund({ value: sendValue })
        await fundTxResponse.wait(1)
        const withdrawTxResponse = await fundMe.withdraw()
        await withdrawTxResponse.wait(1)

        const endingFundMeBalance = await ethers.provider.getBalance(
            fundMe.target
        )
        console.log(
            endingFundMeBalance.toString() +
            " should equal 0, running assert equal..."
        )
        assert.equal(endingFundMeBalance.toString(), "0")
    })
})