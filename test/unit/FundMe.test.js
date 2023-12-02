
const { assert, expect } = require("chai")
const { network, deployments, ethers, getNamedAccounts } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")
describe("FundMe", async function () {
    let fundMe
    let mockV3Aggregator
    let deployer
    const sendValue = "1000000000000000000"// ethers.utils.parseEther("1")导致无法测试平替方式为 sendValue ="1000000000000000000"
    beforeEach(async function () {
        // const accounts = await ethers.getSigners()
        // deployer = accounts[0]
        deployer = (await getNamedAccounts()).deployer//获取账户
        await deployments.fixture(["all"])//fixture允许我们运行整个deploy文件夹，all一个标签
        fundMe = await ethers.getContract("FundMe", deployer)//部署合约
        mockV3Aggregator = await ethers.getContract(//获取本地喂价合约   
            "MockV3Aggregator",
            deployer
        )
    })
    describe("constructor", async function () {//构造函数测试
        it("sets the aggregator addresses correctly", async function () {
            const response = await fundMe.getPriceFeed()//确保这里获取到是本地喂价合约
            //console.log(mockV3Aggregator.address);
            assert.equal(response, mockV3Aggregator.target)//assert检测错误//address用target代替
        })


        describe("fund", function () {//fund（资助）函数测试
            // https://ethereum-waffle.readthedocs.io/en/latest/matchers.html
            // could also do assert.fail
            it("Fails if you don't send enough ETH", async () => {
                await expect(fundMe.fund()).to.be.revertedWith(//expect检测错误
                    "You need to spend more ETH!"
                )
            })

            // we could be even more precise here by making sure exactly $50 works
            // but this is good enough for now
            it("Updates the amount funded data structure", async () => {
                await fundMe.fund({ value: sendValue })
                const response = await fundMe.getAddressToAmountFunded(
                    deployer
                )
                assert.equal(response.toString(), sendValue.toString())
            })

        })
        it("Adds funder to array of funders", async () => {
            await fundMe.fund({ value: sendValue })
            const response = await fundMe.getFunder(0)
            assert.equal(response, deployer)
        })
    })
    describe("withdraw", function () {//提取函数测试
        beforeEach(async () => {
            await fundMe.fund({ value: sendValue })
        })
        it("withdraws ETH from a single funder", async () => {
            // Arrange
            const startingFundMeBalance =
                await ethers.provider.getBalance(fundMe.target)
            const startingDeployerBalance =
                await ethers.provider.getBalance(deployer)

            // Act
            const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)

            //获取gas
            //const { gasUsed, effectiveGasPrice } = transactionReceipt
            //let gasCost = gasUsed * effectiveGasPrice

            const endingFundMeBalance = await ethers.provider.getBalance(
                fundMe.target
            )
            const endingDeployerBalance =
                await ethers.provider.getBalance(deployer)

            // Assert
            // Maybe clean up to understand the testing
            assert.equal(endingFundMeBalance, 0)
            assert.equal(
                (startingFundMeBalance + startingDeployerBalance)
                    .toString(),
                (endingDeployerBalance + BigInt(59513570343531)).toString()
                //在这里的“+”号用".add"来表示
            )
        })
        //上面测试只有一个资助者时，运行没有问题
        //现在测试有多个测试者是的情况
        // this test is overloaded. Ideally we'd split it into multiple tests
        // but for simplicity we left it as one
        it(" allows us to withdraw with multiple funders", async () => {
            // Arrange
            //测试有五个资助者   的情况
            const accounts = await ethers.getSigners()
            for (i = 1; i < 6; i++) {
                const fundMeConnectedContract = await fundMe.connect(
                    accounts[i]
                )
                await fundMeConnectedContract.fund({ value: sendValue })
            }
            //获取提取前账户的值
            const startingFundMeBalance =
                await ethers.provider.getBalance(fundMe.target)
            const startingDeployerBalance =
                await ethers.provider.getBalance(deployer)

            // Act进行交易
            const transactionResponse = await fundMe.cheaperWithdraw()
            // Let's comapre gas costs :)
            // const transactionResponse = await fundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)
            //获取gas
            //const { gasUsed, effectiveGasPrice } = transactionReceipt
            //const withdrawGasCost = gasUsed.mul(effectiveGasPrice)
            // console.log(`GasCost: ${withdrawGasCost}`)
            // console.log(`GasUsed: ${gasUsed}`)
            // console.log(`GasPrice: ${effectiveGasPrice}`)
            const endingFundMeBalance = await ethers.provider.getBalance(
                fundMe.target
            )
            const endingDeployerBalance =
                await ethers.provider.getBalance(deployer)
            // Assert
            assert.equal(
                (startingFundMeBalance + startingDeployerBalance)
                    .toString(),
                (endingDeployerBalance + BigInt(104542881464617)).toString()
            )
            // Make a getter for storage variables
            //确保funders可以正确重置
            await expect(fundMe.funders(0)).to.be.reverted
            //回滚是因为发送了以太币也可以是做了其他奇怪的事情
            for (i = 1; i < 6; i++) {
                assert.equal(//遍历每一个账户确保都是0
                    await fundMe.addressToAmountFunded(
                        accounts[i].address
                    ),
                    0
                )
            }
        })
        //测试只有部署者才可以提取
        it("Only allows the owner to withdraw", async function () {
            const accounts = await ethers.getSigners()
            const attacker = accounts[1]
            const fundMeConnectedContract = await fundMe.connect(
                attacker
            )
            await expect(
                fundMeConnectedContract.withdraw()
            ).to.be.reverted
            // ).to.be.revertedWith("FundMe__NotOwner")

        })
    })

})