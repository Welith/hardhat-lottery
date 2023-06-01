const { ethers, network } = require("hardhat")

async function mockKeepers() {
    const raffle = ethers.getContract("Raffle")
    const checkData = "0x"
    const { checkUpkeep } = (await raffle).callStatic.checkUpkeep(checkData)
    if (checkUpkeep) {
        const tx = await raffle.performUpkeep(checkData)
        const txReceipt = await tx.wait(1)
        const requestId = txReceipt.events[1].args.requestId
        console.log(`Performed upkeep with RequestId: ${requestId}`)
        if ((network.config.chainId = 31337)) {
            await mockVrf(requestId, raffle)
        }
    } else {
        console.log("No upkeep needed!")
    }
}

async function mockVrf(requestId, raffle) {
    console.log("We are in a local network! We need to mock!")
    const vrfCoordinatorV2Mock = await ethers.getContract(
        "VRFCoordinatorV2Mock"
    )
    await vrfCoordinatorV2Mock.fulfillRandomWords(requestId, raffle.address)
    console.log("Responded!")
    const recentWinner = await raffle.getRecentWinner()
    console.log(`The winner is: ${recentWinner}`)
}

mockKeepers()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error)
        process.exit(1)
    })
