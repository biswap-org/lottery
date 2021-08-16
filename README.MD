### **СТАРТ ЛОТЕРЕИ**
Новая лотерея стартует функцией
```solidity
function startLottery(
    uint256 _endTime,
    uint256 _priceTicketInUSDT,
    uint256 _discountDivisor,
    uint256[6] calldata _rewardsBreakdown)
```
`_rewardsBreakdown`: [250, 375, 625, 1250, 2500, 5000], что соответствует [2, 3, 5, 10, 20, 40]% от общего пула
распределение выигрыша по количеству угаданных чисел в сумме должно быть 10000. 
***
### **ПОКУПКА БИЛЕТОВ**
User покупает билеты текущей (`currentLotteryId`) лотереи (`_lottery.status = Open`) 
транзакцией `buyTickets(uint256 _lotteryId, uint32[] _ticketNumbers)`, 

где: `_lotteryId` - Id текущей лотереи

`_ticketNumbers` - массив номеров билетов В ОБРАТНОМ ПОРЯДКЕ + 1 000 000, 
например, User загадал число 376549 => в массив передаем 1945673. В таком виде они хранятся в контракте.

>Перед вызовом `buyTickets` нужно утвердить (approve) стоимость всех билетов в BSW на адрес контракта.

Рассчитать стоимость всех билетов функцией смарт контракта

```solidity
/**
 * @notice Calculate price of a set of tickets
 * @param _discountDivisor: divisor for the discount
 * @param _priceTicket price of a ticket (in BSW)
 * @param _numberTickets number of tickets to buy
 */
function calculateTotalPriceForBulkTickets(
    uint256 _discountDivisor,
    uint256 _priceTicket,
    uint256 _numberTickets
```
>Количество билетов за 1 транзакцию не должно превышать `maxNumberTicketsPerBuyOrClaim`.
***
### **ЗАКРЫТИЕ ЛОТЕРЕИ**
По окончании срока лотереи вызывается функция `closeLottery(uint256 _lotteryId)`
***
### **РАСЧЕТ ВЫИГРАННЫХ БИЛЕТОВ И ОТКРЫТИЕ ЛОТЕРЕИ НА ПОЛУЧЕНИЕ ВЫИГРЫША**
После генерации `RandomResult` для текущей лотереи в контракте `RandomNumberGenerator` 
>В контракте `RandomNumberGenerator`: `latestLotteryId` == текущей закрытой лотерее.

получаем сгенерированный `randomResult` и рассчитываем на стороне сервера распределение количество билетов 
и сумму выигрыша по каждому пулу:
```javascript
function getCountTicketsOnBrackets(ticketsNumbers, winningNumber, rewardsBreakdown, amountCollectedInBSW){
    let bswPerBracket = [];
    let countTicketsPerBracket = [];
    let ticketsOnBrackets = new Map();
    let amountToInjectNextLottery = new BigNumber.from(0);
    ticketsOnBrackets.constructor.prototype.increment = function (key) {
        this.has(key) ? this.set(key, this.get(key) + 1) : this.set(key, 1);
    }
    for(let i = 0;i < ticketsNumbers.length; i++){
        if(ticketsNumbers[i] < 1000000 || ticketsNumbers[i] > 1999999){
            console.log('Wrong ticket number', ticketsNumbers[i]);
            return 0;
        }
        for(let j = 0; j < 6; j++){
        ticketsOnBrackets.increment(bracketCalculator[j] + ticketsNumbers[i] % 10**(j+1));
        }
    }
    let previousCount = 0;
    for(let i = 5; i>=0; i--){
        let transfWinningNumber = bracketCalculator[i] + (winningNumber % 10**(i+1));
        countTicketsPerBracket[i] = (ticketsOnBrackets.get(transfWinningNumber) - previousCount) || 0;
        if(countTicketsPerBracket[i] > 0){
            if(rewardsBreakdown[i] > 0){
                bswPerBracket[i] = (((amountCollectedInBSW.mul(rewardsBreakdown[i])).div(countTicketsPerBracket[i]))
                    .div(10000))
                    .add(1); // To Warn correct rounding when infinite fraction
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
```

Input parameters: 

- `ticketsNumbers` массив всех номеров билетов участвующих в розыгрыше в формате смарт контракта
- `winningNumber` сгенерированный `randomResult`
- `rewardsBreakdown`: `_rewardsBreakdown` текущей лотереи
- `amountCollectedInBSW`: количество собранных BSW в текущей лотерее ***+ `pendingInjectionNextLottery` если > 0;***

Return:
- `bswPerBracket` Массив стоимости 1 билета по пулам выигранных номеров; 0 элемент: 1 число угадано, 1 элемент: 2 числа и т.д.
- `countTicketsPerBracket` Массив количества билетов с выигрышными номерами по каждому пулу
- `amountToInjectNextLottery` Остаток не выигранной суммы, которая переносится на следующий розыгрыш

После расчета вызываем функцию смарт контракта 
```solidity
drawFinalNumberAndMakeLotteryClaimable(
    uint256 _lotteryId,
    uint[6] _bswPerBracket,
    uint[6] _countTicketsPerBracket,
    bool _autoInjection)
```
`_autoInjection` ***true*** если не выигранная сумма переносится на следующий розыгрыш. ***false*** - сумма выводится на адрес `treasuryAddress`

### **ПОЛУЧЕНИЕ ВЫИГРЫША**
пользователем происходит через вызов функции 
```solidity
claimTickets(
    uint256 _lotteryId,
    uint256[] _ticketIds,
    uint32[] _brackets)
```
где:
`_ticketIds` Массив Id выигрышных билетов пользователя

`_brackets` Массив номеров пулов по выигранным билетам

Получить маппинг с нужными данными:
```javascript
function getBracketsForTickets(ticketsIds, ticketsNumbers, winNumber){
    let transfWinNumber, transfTicketsNumber;
    let winTicketsId = new Map();
    for(let i = 0; i < ticketsNumbers.length; i++){
        transfWinNumber = 0;
        transfTicketsNumber = 0;
        for(let j = 0; j < bracketCalculator.length; j++){
            transfWinNumber = bracketCalculator[j] + (winNumber % (10**(j+1)));
            transfTicketsNumber = bracketCalculator[j] + (ticketsNumbers[i] % (10**(j+1)));
            if (transfWinNumber === transfTicketsNumber){
                winTicketsId.set(ticketsIds[i], j);
            } else {
                break;
            }
        }
    }
    // Map(key: ticketId, value: bracket)
    return winTicketsId;
}
```
### **ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ**
Возвращает сумму выигрыша для `TicketId` и `bracket`
```solidity
/**
 * @notice View rewards for a given ticket, providing a bracket, and lottery id
 * @dev Computations are mostly offchain. This is used to verify a ticket!
 * @param _lotteryId: lottery id
 * @param _ticketId: ticket id
 * @param _bracket: bracket for the ticketId to verify the claim and calculate rewards
 */
function viewRewardsForTicketId(
    uint256 _lotteryId,
    uint256 _ticketId,
    uint32 _bracket)
```
Возвращает массив со всеми билетами купленными `address _user` в конкретной `_lotteryId`
```solidity
/**
 * @notice View user ticket ids, numbers, and statuses of user for a given lottery
 * @param _user: user address
 * @param _lotteryId: lottery id
 * @param _cursor: cursor to start where to retrieve the tickets
 * @param _size: the number of tickets to retrieve
 */
function viewUserInfoForLotteryId(
    address _user,
    uint256 _lotteryId,
    uint256 _cursor,
    uint256 _size
    ...
    return (lotteryTicketIds, ticketNumbers, ticketStatuses, _cursor + length);
```
Возвращает массив с состоянием билетов `true`: билет можно обналичить и `false`: билет уже обналичен
```solidity
/**
 * @notice View ticker statuses and numbers for an array of ticket ids
 * @param _ticketIds: array of _ticketId
 */
function viewNumbersAndStatusesForTicketIds(uint256[] _ticketIds)
    external
    view
    ...
    returns (ticketNumbers, ticketStatuses)
```