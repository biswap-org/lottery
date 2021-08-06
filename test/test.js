const { expect } = require(`chai`);
const { BigNumber } = require("ethers");
const { ethers, network } = require(`hardhat`);

let accounts,owner, bswToken, oracle, rng, lottery;
let bracketCalculator = [];
before(async function(){
    accounts = await ethers.getSigners();
    owner = accounts[0];
    const BSWToken = await ethers.getContractFactory(`BSWToken`);
    bswToken = await BSWToken.deploy();
    await bswToken.deployed();

    const Oracle = await ethers.getContractFactory(`TestOracle`);
    oracle = await Oracle.deploy();
    await oracle.deployed();

    const Rng = await ethers.getContractFactory(`TestRandomNumberGenerator`);
    rng = await Rng.deploy();
    await rng.deployed();

    const Lottery = await ethers.getContractFactory(`BiswapLottery`);
    lottery = await Lottery.deploy(bswToken.address, bswToken.address, rng.address, oracle.address);
    await lottery.deployed();

    await lottery.setManagingAddresses(owner.address, owner.address, owner.address, owner.address, owner.address);
    await rng.setLotteryAddress(lottery.address);

});

// await network.provider.send("evm_mine");
// await network.provider.send("evm_setNextBlockTimestamp", [1625097600])
// await network.provider.send("evm_increaseTime", [3600])
bracketCalculator[0] = 1;
bracketCalculator[1] = 11;
bracketCalculator[2] = 111;
bracketCalculator[3] = 1111;
bracketCalculator[4] = 11111;
bracketCalculator[5] = 111111;

function getBracketsForTickets(ticketsNumbers, winNumber){
    let transfWinNumber, transfTicketsNumber, brackets = [];
    for(let i = 0; i < ticketsNumbers.length; i++){
        transfWinNumber = 0;
        transfTicketsNumber = 0;
        brackets[i] = 0;
        for(let j = 0; j < bracketCalculator.length; j++){
            transfWinNumber = bracketCalculator[j] + (winNumber % (10**(j+1)));
            transfTicketsNumber = bracketCalculator[j] + (ticketsNumbers[i] % (10**(j+1)));
            if (transfWinNumber === transfTicketsNumber){
                brackets[i] = j+1;
            } else {
                break;
            }
        }
    }
    return brackets;
}

describe(`Check start new lottery`, function () {
    let endTime;
    it(`Start new lottery`, async function () {
        const timeLastBlock = (await ethers.provider.getBlock(`latest`)).timestamp;
        endTime = timeLastBlock + 14400; //after 4 hours
        let priceTicketInUSDT = BigNumber.from(`1000000000000000000`);
        let rewardsBreakdown = [125, 375, 750, 1250, 2500, 5000];
        let discountDivisor = 10000;
        await expect(lottery.startLottery(endTime, priceTicketInUSDT, discountDivisor, rewardsBreakdown)).to.be //(uint256 _endTime, uint256 _priceTicketInUSDT, uint256 _discountDivisor, uint256[6] calldata _rewardsBreakdown})
            .emit(lottery,'LotteryOpen');
        console.log(`Lottery start. Current lottery id: `, (await lottery.currentLotteryId()).toString());
    });

    it(`Buy 1 ticket and check transfers amounts`, async function(){
        //                  1853548  1853548  1853548 1903507
        let ticketNumber = [1852548, 1892948, 1092221];
        console.log(getBracketsForTickets(ticketNumber, 1853548));
        let currentPriceInBSW = await lottery.getCurrentTicketPriceInBSW(1);
        let balanceLotteryBefore = await bswToken.balanceOf(lottery.address);
        let burningShare = await lottery.burningShare();
        let competitionAndRefShare = await lottery.competitionAndRefShare();
        await bswToken.approve(lottery.address, currentPriceInBSW.mul(ticketNumber.length));
        await expect(lottery.buyTickets(1, ticketNumber)).to.be.emit(lottery, `TicketsPurchase`);
        let balanceLotteryAfter = await bswToken.balanceOf(lottery.address);
        expect(balanceLotteryAfter - balanceLotteryBefore)
            .equal(currentPriceInBSW * (10000 - burningShare.add(competitionAndRefShare))/10000);
    });

    it(`Check close lottery`, async function (){
        await network.provider.send("evm_setNextBlockTimestamp", [endTime+1]);
        await expect(lottery.closeLottery(1)).to.be.emit(lottery, `LotteryClose`);
        await expect(lottery.drawFinalNumberAndMakeLotteryClaimable(1, true)).to.be
            .emit(lottery, `LotteryNumberDrawn`)
        let winNumber = await lottery.viewLottery(1);

        console.log(winNumber.finalNumber.toString());
        console.log(winNumber.bswPerBracket.toString());
        console.log(winNumber.countWinnersPerBracket.toString());
        console.log((await bswToken.balanceOf(lottery.address)).toString());
    });

    it(`Check winning number and claimed ticket`, async function (){

    })
})