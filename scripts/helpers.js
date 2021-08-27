//npx hardhat run scripts/helpers.js --network mainnetBSC

const { ethers, network } = require(`hardhat`);
const {BigNumber} = require(`ethers`);

const Web3 = require(`web3`);
const { privatKey, PK_local, privatKey_acc1 } = require('../secrets.json');


const LOTTERY_ADDRESS = '0x825964Ac329A7Efefb895E83Af0615F68558Abe9';
const RNG_ADDRESS = `0x16398AAf8587e237cb3F6F5b4eA058b3EdE86419`;
// const LOTTERY_ADDRESS = '0xccE260AfcACB58c79d0dE54f9D19cF94ECf94C9A'; //TestNet
// const RNG_ADDRESS = `0xD7DF6d2b1FD1E9Cf1C75BC4068AC3fb67e376D47`; //TestNet
const LOTTERY_DURATION = 14400; // 4 hours
const PRICE_TICKET_IN_USDT = BigNumber.from(`1000000000000000000`);
const REWARDS_BREAKDOWN = [250, 375, 625, 1250, 2500, 5000];
const DISCOUNT_DIVISOR = 10000;

let web3 = new Web3(`https://bsc-dataseed.binance.org/`);
// let web3 = new Web3(`https://data-seed-prebsc-1-s1.binance.org:8545`); //Testnet
// let web3 = new Web3(`http://127.0.0.1:8545`); //Localhost
const lotteryAbi = require(`../artifacts/contracts/Lottery.sol/BiswapLottery.json`);
const RngAbi = require(`../artifacts/contracts/RandomNumberGenerator.sol/RandomNumberGenerator.json`);

//arg:
// 1 `Start new lottery`;
// 2 `Close current lottery`;
// 3 `Draw final number and make Lottery claimable`
async function main(arg){
    const account = web3.eth.accounts.privateKeyToAccount(privatKey);
    web3.eth.accounts.wallet.add(account);
    const lottery = new web3.eth.Contract(lotteryAbi.abi, LOTTERY_ADDRESS, account.address);
    const rng = new web3.eth.Contract(RngAbi.abi, RNG_ADDRESS);
    const timeLastBlock = (await web3.eth.getBlock('latest')).timestamp;
    let currentLotteryId = await lottery.methods.viewCurrentLotteryId().call();
    let currentLottery = (await lottery.methods.viewLottery(currentLotteryId).call());
    let currentStatusLottery = currentLottery.status;
    console.log(`Setting managing addresses`);
    await lottery.methods.setManagingAddresses(account.address, account.address, account.address, account.address, account.address)
        .send({from: account.address, gas: 1000000});

    //--- start new lottery
    //Current lottery status == `close` or `claimable`
    if (currentStatusLottery !== `1` && arg === 1){
        console.log(`Lets start new lottery`);
        let endTime = timeLastBlock + LOTTERY_DURATION;
        await lottery.methods.startLottery(endTime, PRICE_TICKET_IN_USDT, DISCOUNT_DIVISOR, REWARDS_BREAKDOWN)
            .send({from: account.address, gas: 1000000})
            .on('receipt', function(receipt){
                console.log(`New lottery successfully started`, receipt.events);
            });
        // console.log(`New lottery successfully started: ${event}`);
    } else if(arg === 1){
        console.log(`Current status lottery not close or claimable. Its: ${currentStatusLottery}`)
    }

    //--- close lottery
    //Current status lottery == `Open`
    if(currentStatusLottery === `1` && arg === 2){
        console.log(`Try to close current lottery`);
        if (currentLottery.endTime === 0 || currentLottery.endTime > timeLastBlock){
            console.log(`Current lottery not over. Current timestamp: ${timeLastBlock} End Timestamp: ${currentLottery.endTime}`)
        } else{
            let receipt = await lottery.methods.closeLottery(currentLotteryId)
                .send({from: account.address, gas: 1000000})
                .on('receipt', function(receipt){
                    console.log(`Lottery ${currentLotteryId} successfully closed`, receipt.events);
                });
        }
    } else if(arg === 2){
        console.log(`Current status lottery not Open. Its: ${currentStatusLottery}`);
    }

    //--- draw final number and make Lottery claimable
    //Current status lottery `Close`
    if(currentStatusLottery === 2 && arg === 3){

    }

    // console.log(await lottery.methods.viewCurrentLotteryId().call({from: account.address, gas: 1000000}));
    // console.log((await web3.eth.getBlock('latest')).timestamp)
}

main(1)
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

// async function main(arg) {
//     let accounts = await ethers.getSigners();
//     const lottery = await ethers.getContractAt(`BiswapLottery`, LOTTERY_ADDRESS, accounts[0]);
//     const rng = await ethers.getContractAt(`RandomNumberGenerator`, RNG_ADDRESS, accounts[0]);
//     const timeLastBlock = (await ethers.provider.getBlock(`latest`)).timestamp;
//
//     let currentLotteryId = await lottery.viewCurrentLotteryId();
//     let currentLottery = (await lottery.viewLottery(currentLotteryId));
//     let currentStatusLottery = currentLottery.status;
//
//     //--- start new lottery
//     //Current lottery status `close` or `claimable`
//     if (currentStatusLottery > 1 && arg === 1){
//         console.log(`Try to start new lottery`);
//         let endTime = timeLastBlock + LOTTERY_DURATION;
//         let tx = await lottery.startLottery(endTime, PRICE_TICKET_IN_USDT, DISCOUNT_DIVISOR, REWARDS_BREAKDOWN);
//         let receipt = await tx.wait();
//         let event = receipt.events?.filter((x) => {return x.event === "LotteryOpen"});
//         console.log(`New lottery successfully started: ${event}`);
//     } else {
//         console.log(`Current status lottery not close or claimable. Its: ${currentStatusLottery}`)
//     }
//
//     //--- close lottery
//     //Current status lottery `Open`
//     if(currentStatusLottery === 1 && arg === 2){
//         console.log(`Try to close current lottery`);
//         if (currentLottery.endTime === 0 || currentLottery.endTime > timeLastBlock){
//             console.log(`Current lottery not over. EndTime: ${new Date(currentLottery.endTime).toLocaleString()}`)
//         } else{
//             let tx = await lottery.closeLottery(currentLotteryId);
//             let receipt = await tx.wait();
//             let event = receipt.events?.filter((x) => {return x.event === "LotteryClose"});
//             console.log(`New lottery successfully closed: ${event}`);
//         }
//     } else {
//         console.log(`Current status lottery not Open. Its: ${currentStatusLottery}`);
//     }
//
//     //--- draw final number and make Lottery claimable
//     //Current status lottery `Close`
//     if(currentStatusLottery === 2 && arg === 3){
//
//     }
//
//
// }