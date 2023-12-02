

////linting是运行一个程序的过程，该程序将分析代码是否存在潜在错误
//solhint是一种用于solidity代码的lint方法
//使用脚本部署，会出现一些问题，如：测试不兼容等，为了避免问题的发生，
//我们可以使用一个包：hardhat-deploy
//有了这个包，我们就不需要script里面的deploy。js了
//重新建立一个文件夹deploy用来编写脚本
//这样我们在deploy文件夹里面添加的脚本都会在执行yarn hardhat deploy时运行
//下面配置环境
//用 hardhat-deploy-ethers ethers取代之前的 @nomiclabs/hardhat-ethers 可以让ethers更好的跟踪
//ether是一个js的工具包可以让我们与不同的区块链进行交互并且有很多封装函数可以进行API调用
//配置好后，我们可以对脚本进行编码
//随着系统的越来越复杂，我们的测试就需要更加高级的测试
//分为unit（单元测试）和staging（集成测试）
//unit测试可以使用“local hardhat”或者“forked hardhat”
//在solidity中全局变量可以永久存在是因为他们储存在一个名为Storage的地方
//storage是一个与合约相关联的巨大列表
//存放在该数组中的某个32字节长的槽位中
//每个存储位置和数组一样，从0开始递增
//对于布尔值，储存时会从布尔值形式转换到他的十六进制形式
//对于动态变量（如：动态数组或者字典）他们的内部元素实际上是以一种名为“哈希函数”的形式存储
//但是需要一个槽位去运行他的哈希函数
//有趣的是“constant”和“immutable“变量并不占用storage的空间
//这是因为constant变量已经成为了合约字节码其本身的一部分了
//对于一些局部变量，不会添加在storage中
//而是会被添加到它们自己的menmory数据结构中，运行完就会从、删掉
//所以对于字符串必须标明menmory关键字、
//即使将一个函数设置为private或者internal，其他人任然可以读取，因为区块链的信息是公开透明的
//对于storage的变量在存储与读取时会花费大量的gas
//而对于menmory变量则只需要花费比较少的gas
//所以对于一些storage的变量可以保存成menmory变量，从而节约gas


