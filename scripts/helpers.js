//npx hardhat run scripts/helpers.js --network mainnetBSC

const { ethers, network } = require(`hardhat`);
const {BigNumber} = require(`ethers`);

const Web3 = require(`web3`);
const { privatKey, PK_local, privatKey_acc1 } = require('../secrets.json');


const LOTTERY_ADDRESS = '0x75ff08dD82e667EeE968C1704294b05953B3aA2F';
const RNG_ADDRESS = `0xCfC6F620226d4Bf792E536D5cc189A6443e2b2BD`;
// const LOTTERY_ADDRESS = '0xccE260AfcACB58c79d0dE54f9D19cF94ECf94C9A'; //TestNet
// const RNG_ADDRESS = `0xD7DF6d2b1FD1E9Cf1C75BC4068AC3fb67e376D47`; //TestNet
const LOTTERY_DURATION = 600;
const PRICE_TICKET_IN_USDT = BigNumber.from(`1000000000000000`); //Min price 1000000000000
const REWARDS_BREAKDOWN = [250, 375, 625, 1250, 2500, 5000];
const DISCOUNT_DIVISOR = 10000;


const web3 = new Web3(`https://bsc-dataseed.binance.org/`);
// const web3 = new Web3(`https://data-seed-prebsc-1-s1.binance.org:8545`); //Testnet
// const web3 = new Web3(`http://127.0.0.1:8545`); //Localhost
const lotteryAbi = require(`../artifacts/contracts/Lottery.sol/BiswapLottery.json`);
const RngAbi = require(`../artifacts/contracts/RandomNumberGenerator.sol/RandomNumberGenerator.json`);

const argv1 = process.argv.slice(2)[0];

let bracketCalculator = [];
bracketCalculator[0] = 1;
bracketCalculator[1] = 11;
bracketCalculator[2] = 111;
bracketCalculator[3] = 1111;
bracketCalculator[4] = 11111;
bracketCalculator[5] = 111111;


//argv1:
// --open `Start new lottery`;
// --close `Close current lottery`;
// --draw `Draw final number and make Lottery claimable`
async function main(){
    const account = web3.eth.accounts.privateKeyToAccount(privatKey);
    web3.eth.accounts.wallet.add(account);
    const lottery = new web3.eth.Contract(lotteryAbi.abi, LOTTERY_ADDRESS, {from: account.address});
    const rng = new web3.eth.Contract(RngAbi.abi, RNG_ADDRESS, {from: account.address});
    const timeLastBlock = (await web3.eth.getBlock('latest')).timestamp;
    let currentLotteryId = await lottery.methods.viewCurrentLotteryId().call();
    let currentLottery = await lottery.methods.viewLottery(currentLotteryId).call();
    let currentStatusLottery = currentLottery.status;
    let burningShare = await lottery.methods.burningShare().call();
    let competitionAndRefShare = await lottery.methods.competitionAndRefShare().call();

    //--- start new lottery
    //Current lottery status == `close` or `claimable`
    if (currentStatusLottery !== `1` && argv1 === '--open'){
        console.log(`Lets start new lottery`);
        let endTime = timeLastBlock + LOTTERY_DURATION;
        await lottery.methods.startLottery(endTime, PRICE_TICKET_IN_USDT, DISCOUNT_DIVISOR, REWARDS_BREAKDOWN)
            .send({from: account.address, gas: 1000000})
            .on('receipt', function(receipt){
                if(receipt.status === true) {
                    console.log(`New lottery successfully started`, receipt.events);
                } else {
                    console.log(`Lottery start False!!!. txHash: ${receipt.transactionHash}`);
                }
            });
    } else if(argv1 === '--open'){
        console.log(`Current status lottery not close or claimable. Its: ${currentStatusLottery}`)
    }

    //--- close lottery
    //Current status lottery == `Open`
    if(currentStatusLottery === `1` && argv1 === '--close'){
        console.log(`Try to close current lottery`);
        if (currentLottery.endTime === 0 || currentLottery.endTime > timeLastBlock){
            console.log(`Current lottery not over. Current timestamp: ${timeLastBlock} End Timestamp: ${currentLottery.endTime}`)
        } else{
            await lottery.methods.closeLottery(currentLotteryId)
                .send({from: account.address, gas: 1000000})
                .on('receipt', function(receipt){
                    if(receipt.status === true) {
                        console.log(`Lottery ${currentLotteryId} successfully closed`, receipt.events);
                    } else {
                        console.log(`Lottery close False!!!. txHash: ${receipt.transactionHash}`);
                    }
                });
        }
    } else if(argv1 === '--close'){
        console.log(`Current status lottery not Open. Its: ${currentStatusLottery}`);
    }
    //--- draw final number and make lottery claimable
    //Current status lottery `Close`
    if(currentStatusLottery === `2` && argv1 === `--draw`){
        console.log(`Try to draw final number and make lottery claimable`);
        let autoInjection = true;
        let amountCollectedInBSW = new BigNumber.from(currentLottery.amountCollectedInBSW);
        let firstTicketId = currentLottery.firstTicketId;
        let lastTicketId = currentLottery.firstTicketIdNextLottery;
        let totalTicketsPerLottery = lastTicketId - firstTicketId;
        let rewardsBreakdown = currentLottery.rewardsBreakdown;
        let ticketIdsForCurLottery =
            (function(a,b,c){c=[];while(a--)c[a]=a+b;return c})(+totalTicketsPerLottery, +firstTicketId);
        let ticketsNumbers = (await lottery.methods.viewNumbersAndStatusesForTicketIds(ticketIdsForCurLottery).call())[0];

        let currentLotteryIdInRng = await rng.methods.viewLatestLotteryId().call();

        if(currentLotteryIdInRng !== currentLotteryId){
            console.log(`In RNG contract random number for this lottery not ready. ${currentLotteryIdInRng}`);
            return;
        }
        let randomResult = await rng.methods.viewRandomResult().call();
        let pendingInjectionNextLottery = new BigNumber.from(await lottery.methods.pendingInjectionNextLottery().call())
        let amountToDistribute = amountCollectedInBSW
            .sub((amountCollectedInBSW).mul(+burningShare + +competitionAndRefShare).div(10000))
            .add(pendingInjectionNextLottery);
        let calculateBrackets =
            getCountTicketsOnBrackets(ticketsNumbers, randomResult, rewardsBreakdown, amountToDistribute);
        await lottery.methods.drawFinalNumberAndMakeLotteryClaimable(currentLotteryId, calculateBrackets[0], calculateBrackets[1], autoInjection)
            .send({from: account.address, gas: 1000000})
            .on('receipt', function(receipt){
                if(receipt.status === true){
                    console.log(`Lottery successfully drowned `, receipt.events);
                } else{
                    console.log(`Draw lottery False!!!. txHash: ${receipt.transactionHash}`);
                }
            });
    }
}

function getCountTicketsOnBrackets(ticketsNumbers, winningNumber, rewardsBreakdown, amountCollectedInBSW) {
    let bswPerBracket = [];
    let countTicketsPerBracket = [];
    let ticketsOnBrackets = new Map();
    let amountToInjectNextLottery = new BigNumber.from(0);
    ticketsOnBrackets.constructor.prototype.increment = function (key) {
        this.has(key) ? this.set(key, this.get(key) + 1) : this.set(key, 1);
    }
    for (let i = 0; i < ticketsNumbers.length; i++) {
        if (ticketsNumbers[i] < 1000000 || ticketsNumbers[i] > 1999999) {
            console.log('Wrong ticket number', ticketsNumbers[i]);
            return 0;
        }
        for (let j = 0; j < 6; j++) {
            ticketsOnBrackets.increment(bracketCalculator[j] + ticketsNumbers[i] % 10 ** (j + 1));
        }
    }
    let previousCount = 0;
    for (let i = 5; i >= 0; i--) {
        let transfWinningNumber = bracketCalculator[i] + (winningNumber % 10 ** (i + 1));
        countTicketsPerBracket[i] = (ticketsOnBrackets.get(transfWinningNumber) - previousCount) || 0;

        if (countTicketsPerBracket[i] > 0) {
            if (rewardsBreakdown[i] > 0) {
                bswPerBracket[i] = (((amountCollectedInBSW.mul(rewardsBreakdown[i])).div(countTicketsPerBracket[i]))
                    .div(10000))
                    .sub(1); // To Warn correct rounding when infinite fraction
                previousCount = ticketsOnBrackets.get(transfWinningNumber);
            }
        } else {
            bswPerBracket[i] = 0;
            amountToInjectNextLottery = amountToInjectNextLottery
                .add((amountCollectedInBSW.mul(rewardsBreakdown[i])).div(10000))
        }
    }
    return [bswPerBracket, countTicketsPerBracket, amountToInjectNextLottery];
}



main()
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