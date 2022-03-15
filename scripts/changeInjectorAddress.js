const { ethers } = require(`hardhat`);

const ownerAddress = `0x386fb61b34fe68341196e5c928cdc03b404a3d74`;
const operatorAddress = `0x102d074b4a440a1bebb935d080c21673b8b36426`;
const treasuryAddress = `0x386fb61b34fe68341196e5c928cdc03b404a3d74`;
const injectorAddress = `0xe843116517809C0d59c8a19dA4f7684f1d34433B`;
const burningAddress = `0x7adf1d930bf09460038278ca263552b47a0fa1f1`;
const competitionAndRefAddress = `0x6170df4be14785567589b912d5c9fd853ccdd061`;

const lotteryAddress = `0xB5137C46618337f7155a5Daad3d5309672F6255c`

let lottery;

async function main() {
    let accounts = await ethers.getSigners();
    console.log(`Deployer address: ${ accounts[0].address}`);
    if(accounts[0].address.toLowerCase() !== ownerAddress.toLowerCase()){
        console.log(`Change deployer address. Current deployer: ${accounts[0].address}. Owner: ${ownerAddress}`);
        return;
    }
    console.log(`Start upgrade Injector address`);
    const Lottery = await ethers.getContractFactory(`BiswapLottery`);
    lottery = Lottery.attach(lotteryAddress);
    await lottery.setManagingAddresses(
        operatorAddress,
        treasuryAddress,
        injectorAddress,
        burningAddress,
        competitionAndRefAddress
    );
    console.log(`Lottery addresses upgraded`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
