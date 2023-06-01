const { ethers, network } = require("hardhat")
const fs = require("fs")

const FRONTEND_ADDRESSES_FILE =
    "../next-js-lotarry/constants/contractAddress.json"

const ABI_FILE = "../next-js-lotarry/constants/abi.json"

module.exports = async function () {
    if (process.env.UPDATE_FRONTEND) {
        console.log("Updating front end...")
    }
    updateContractAddress()
    updateAbi()
}

async function updateAbi() {
    const raffle = await ethers.getContract("Raffle")
    fs.writeFileSync(
        ABI_FILE,
        raffle.interface.format(ethers.utils.FormatTypes.json)
    )
}

async function updateContractAddress() {
    const raffle = await ethers.getContract("Raffle")
    const chainId = network.config.chainId.toString()
    const currentAddresses = JSON.parse(
        fs.readFileSync(FRONTEND_ADDRESSES_FILE, "utf8")
    )
    if (chainId in currentAddresses) {
        if (!currentAddresses[chainId].includes(raffle.address)) {
            currentAddresses[chainId].push(raffle.address)
        }
    }
    {
        currentAddresses[chainId] = [raffle.address]
    }
    fs.writeFileSync(FRONTEND_ADDRESSES_FILE, JSON.stringify(currentAddresses))
}
