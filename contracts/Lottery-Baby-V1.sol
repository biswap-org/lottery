// File: @openzeppelin/contracts/utils/Context.sol

// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/*
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }
}

// File: @openzeppelin/contracts/access/Ownable.sol

pragma solidity ^0.8.0;

/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}




// File: contracts/interfaces/IRandomNumberGenerator.sol

pragma solidity ^0.8.4;

interface IRandomNumberGenerator {
    /**
     * Requests randomness from a user-provided seed
     */
    function getRandomNumber(uint256 _seed) external;

    /**
     * View latest lotteryId numbers
     */
    function viewLatestLotteryId() external view returns (uint256);

    /**
     * Views random result
     */
    function viewRandomResult() external view returns (uint32);
}

//Price Oracle interface

pragma solidity ^0.8.0;

interface IPriceOracle {
    struct Observation {
        uint timestamp;
        uint price0Cumulative;
        uint price1Cumulative;
    }
    function pairObservations(address pairAddress) external view returns(Observation memory);
    function update(address tokenA, address tokenB) external;
    function consult(address tokenIn, uint amountIn, address tokenOut) external view returns (uint);
}

// File: contracts/interfaces/IBiswapLottery.sol

pragma solidity ^0.8.4;

interface IBiswapLottery {
    /**
     * @notice Buy tickets for the current lottery
     * @param _lotteryId: lotteryId
     * @param _ticketNumbers: array of ticket numbers between 1,000,000 and 1,999,999
     * @dev Callable by users
     */
    function buyTickets(uint256 _lotteryId, uint32[] calldata _ticketNumbers) external;

    /**
     * @notice Claim a set of winning tickets for a lottery
     * @param _lotteryId: lottery id
     * @param _ticketIds: array of ticket ids
     * @param _brackets: array of brackets for the ticket ids
     * @dev Callable by users only, not contract!
     */
    function claimTickets(
        uint256 _lotteryId,
        uint256[] calldata _ticketIds,
        uint32[] calldata _brackets
    ) external;

    /**
     * @notice Close lottery
     * @param _lotteryId: lottery id
     * @dev Callable by operator
     */
    function closeLottery(uint256 _lotteryId) external;

    /**
     * @notice Draw the final number, calculate reward in BSW per group, and make lottery claimable
     * @param _lotteryId: lottery id
     * @param _autoInjection: reinjects funds into next lottery (vs. withdrawing all)
     * @param _bswPerBracket: distribution of winnings by bracket
     * @param _countTicketsPerBracket: total number of tickets in each bracket
     * @dev Callable by operator
     */
    function drawFinalNumberAndMakeLotteryClaimable(
        uint256 _lotteryId,
        uint[6] calldata _bswPerBracket,
        uint[6] calldata _countTicketsPerBracket,
        bool _autoInjection
    ) external;

    /**
     * @notice Inject funds
     * @param _lotteryId: lottery id
     * @param _amount: amount to inject in BSW token
     * @dev Callable by operator
     */
    function injectFunds(uint256 _lotteryId, uint256 _amount) external;

    /**
     * @notice Start the lottery
     * @dev Callable by operator
     * @param _endTime: endTime of the lottery
     * @param _priceTicketInUSDT: price of a ticket in BSW
     * @param _discountDivisor: the divisor to calculate the discount magnitude for bulks
     * @param _rewardsBreakdown: breakdown of rewards per bracket (must sum to 10,000)
     */
    function startLottery(
        uint256 _endTime,
        uint256 _priceTicketInUSDT,
        uint256 _discountDivisor,
        uint256[6] calldata _rewardsBreakdown
    ) external;

    /**
     * @notice View current lottery id
     */
    function viewCurrentLotteryId() external returns (uint256);

    function getCurrentTicketPriceInBSW(uint _lotteryId) external view returns(uint);
}

// File: contracts/BiswapLottery.sol

pragma solidity ^0.8.4;
pragma abicoder v2;

/** @title Biswap Lottery.
 * @notice It is a contract for a lottery system using
 * randomness provided externally.
 */
contract BiswapLottery is ReentrancyGuard, IBiswapLottery, Ownable {
    using SafeERC20 for IERC20;

    address public injectorAddress;
    address public operatorAddress;
    address public treasuryAddress;
    address public burningAddress;  //Send tokens from every deposit to burn
    address public competitionAndRefAddress; //Send tokens from every deposit to referrals and competitions
    address public usdtTokenAddress;
    address public bswTokenAddress;

    uint256 public currentLotteryId;
    uint256 public currentTicketId;

    uint256 public burningShare = 1300; //1300: 13%
    uint256 public competitionAndRefShare = 700; //700: 7%

    uint256 public maxNumberTicketsPerBuyOrClaim = 100;

    uint256 public maxPriceTicketInBSW = 50 ether;
    uint256 public minPriceTicketInBSW = 0.005 ether;
    uint256 public maxDiffPriceUpdate = 1500; //Difference between old and new price given from oracle

    uint256 public pendingInjectionNextLottery;

    uint256 public constant MIN_DISCOUNT_DIVISOR = 300;
    uint256 public constant MIN_LENGTH_LOTTERY = 4 hours - 5 minutes; // 4 hours
    uint256 public constant MAX_LENGTH_LOTTERY = 4 days + 5 minutes; // 4 days


    IERC20 public bswToken;
    IRandomNumberGenerator public randomGenerator;
    IPriceOracle public priceOracle;

    enum Status {
        Pending,
        Open,
        Close,
        Claimable
    }

    struct Lottery {
        Status status;
        uint256 startTime;
        uint256 endTime;
        uint256 priceTicketInBSW;
        uint256 priceTicketInUSDT;
        uint256 discountDivisor;    //Must be 10000 for discount 4,99% for 500 tickets
        uint256[6] rewardsBreakdown; // 0: 1 matching number // 5: 6 matching numbers
        uint256[6] bswPerBracket;
        uint256[6] countWinnersPerBracket;
        uint256 firstTicketId;
        uint256 firstTicketIdNextLottery;
        uint256 amountCollectedInBSW;
        uint32 finalNumber;
    }

    struct Ticket {
        uint32 number;
        address owner;
    }

    // Mapping are cheaper than arrays
    mapping(uint256 => Lottery) private _lotteries;
    mapping(uint256 => Ticket) private _tickets;

    // Bracket calculator is used for verifying claims for ticket prizes
    mapping(uint32 => uint32) private _bracketCalculator;

    // Keep track of user ticket ids for a given lotteryId
    mapping(address => mapping(uint256 => uint256[])) private _userTicketIdsPerLotteryId;

    modifier notContract() {
        require(!_isContract(msg.sender), "Contract not allowed");
        require(msg.sender == tx.origin, "Proxy contract not allowed");
        _;
    }

    modifier onlyOperator() {
        require(msg.sender == operatorAddress, "Not operator");
        _;
    }

    modifier onlyOwnerOrInjector() {
        require((msg.sender == owner()) || (msg.sender == injectorAddress), "Not owner or injector");
        _;
    }

    event AdminTokenRecovery(address token, uint256 amount);
    event LotteryClose(uint256 indexed lotteryId, uint256 firstTicketIdNextLottery);
    event LotteryInjection(uint256 indexed lotteryId, uint256 injectedAmount);
    event LotteryOpen(
        uint256 indexed lotteryId,
        uint256 startTime,
        uint256 endTime,
        uint256 priceTicketInUSDT,
        uint256 firstTicketId,
        uint256 injectedAmount
    );
    event LotteryNumberDrawn(uint256 indexed lotteryId, uint256 finalNumber, uint256 countWinningTickets);
    event NewManagingAddresses(
        address operator,
        address treasury,
        address injector,
        address burningAddress,
        address competitionAndRefAddress
    );
    event NewRandomGenerator(address indexed randomGenerator);
    event NewPriceOracle(address oracle);
    event TicketsPurchase(address indexed buyer, uint256 indexed lotteryId, uint256 numberTickets);
    event TicketsClaim(address indexed claimer, uint256 amount, uint256 indexed lotteryId, uint256 numberTickets);

    /**
     * @notice Constructor
     * @dev RandomNumberGenerator must be deployed prior to this contract
     * @param _bswTokenAddress: address of the BSW token
     * @param _usdtTokenAddress: address of the USDT token
     * @param _randomGeneratorAddress: address of the RandomGenerator contract used to work with ChainLink VRF
     * @param _priceOracleAddress: address of oracle
     */
    constructor(
        address _bswTokenAddress,
        address _usdtTokenAddress,
        address _randomGeneratorAddress,
        address _priceOracleAddress
    ) {
        bswToken = IERC20(_bswTokenAddress);
        bswTokenAddress = _bswTokenAddress;
        usdtTokenAddress = _usdtTokenAddress;
        randomGenerator = IRandomNumberGenerator(_randomGeneratorAddress);
        priceOracle = IPriceOracle(_priceOracleAddress);

        // Initializes a mapping
        _bracketCalculator[0] = 1;
        _bracketCalculator[1] = 11;
        _bracketCalculator[2] = 111;
        _bracketCalculator[3] = 1111;
        _bracketCalculator[4] = 11111;
        _bracketCalculator[5] = 111111;
    }

    /**
     * @notice Buy tickets for the current lottery
     * @param _lotteryId: lotteryId
     * @param _ticketNumbers: array of ticket numbers between 1,000,000 and 1,999,999 TAKE CARE! NUMBERS IS INVERTED
     * @dev Callable by users
     */
    function buyTickets(uint256 _lotteryId, uint32[] calldata _ticketNumbers)
        external
        override
        notContract
        nonReentrant
    {
        require(_ticketNumbers.length != 0, "No ticket specified");
        require(_ticketNumbers.length <= maxNumberTicketsPerBuyOrClaim, "Too many tickets");

        require(_lotteries[_lotteryId].status == Status.Open, "Lottery is not open");
        require(block.timestamp < _lotteries[_lotteryId].endTime, "Lottery is over");

        // Update BSW price for _lotteryId
        _updateBSWPrice(_lotteryId);

        // Calculate number of BSW to this contract
        uint256 amountBSWToTransfer = _calculateTotalPriceForBulkTickets(
            _lotteries[_lotteryId].discountDivisor,
            _lotteries[_lotteryId].priceTicketInBSW,
            _ticketNumbers.length
        );

        // Transfer BSW tokens to this contract
        bswToken.safeTransferFrom(address(msg.sender), address(this), amountBSWToTransfer);

        // Increment the total amount collected for the lottery round
        _lotteries[_lotteryId].amountCollectedInBSW += amountBSWToTransfer;

        uint _currentTicketId = currentTicketId;
        for (uint256 i = 0; i < _ticketNumbers.length; i++) {
            uint32 thisTicketNumber = _ticketNumbers[i];
            uint thisCurrentTicketId = _currentTicketId++;
            require((thisTicketNumber >= 1000000) && (thisTicketNumber <= 1999999), "Outside range");

            _userTicketIdsPerLotteryId[msg.sender][_lotteryId].push(thisCurrentTicketId);
            _tickets[thisCurrentTicketId] = Ticket({number: thisTicketNumber, owner: msg.sender});
        }
        // Increase lottery ticket number
        currentTicketId += _ticketNumbers.length;

        emit TicketsPurchase(msg.sender, _lotteryId, _ticketNumbers.length);
    }

    /**
     * @notice Claim a set of winning tickets for a lottery
     * @param _lotteryId: lottery id
     * @param _ticketIds: array of ticket ids
     * @param _brackets: array of brackets for the ticket ids
     * @dev Callable by users only, not contract!
     */
    function claimTickets(
        uint256 _lotteryId,
        uint256[] calldata _ticketIds,
        uint32[] calldata _brackets
    )
        external
        override
        notContract
        nonReentrant
    {
        require(_ticketIds.length == _brackets.length, "Not same length");
        require(_ticketIds.length != 0, "Length must be >0");
        require(_ticketIds.length <= maxNumberTicketsPerBuyOrClaim, "Too many tickets");
        require(_lotteries[_lotteryId].status == Status.Claimable, "Lottery not claimable");

        // Initializes the rewardInBSWToTransfer
        uint256 rewardInBSWToTransfer;

        for (uint256 i = 0; i < _ticketIds.length; i++) {
            require(_brackets[i] < 6, "Bracket out of range"); // Must be between 0 and 5

            uint256 thisTicketId = _ticketIds[i];

            require(_lotteries[_lotteryId].firstTicketIdNextLottery > thisTicketId, "TicketId too high");
            require(_lotteries[_lotteryId].firstTicketId <= thisTicketId, "TicketId too low");
            require(msg.sender == _tickets[thisTicketId].owner, "Not the owner");

            // Update the lottery ticket owner to 0x address
            _tickets[thisTicketId].owner = address(0);

            uint256 rewardForTicketId = _calculateRewardsForTicketId(_lotteryId, thisTicketId, _brackets[i]);

            // Check user is claiming the correct bracket
            require(rewardForTicketId != 0, "No prize for this bracket");

            if (_brackets[i] != 5) {
                require(
                    _calculateRewardsForTicketId(_lotteryId, thisTicketId, _brackets[i] + 1) == 0,
                    "Bracket must be higher"
                );
            }

            // Increment the reward to transfer
            rewardInBSWToTransfer += rewardForTicketId;
        }

        // Transfer money to msg.sender
        bswToken.safeTransfer(msg.sender, rewardInBSWToTransfer);

        emit TicketsClaim(msg.sender, rewardInBSWToTransfer, _lotteryId, _ticketIds.length);
    }

    function getCurrentTicketPriceInBSW(uint _lotteryId) override external view returns(uint){
        return priceOracle.consult(
            usdtTokenAddress,
            _lotteries[_lotteryId].priceTicketInUSDT,
            bswTokenAddress
        );
    }

    /**
     * @notice Close lottery
     * @param _lotteryId: lottery id
     * @dev Callable by operator
     */
    function closeLottery(uint256 _lotteryId) external override onlyOperator nonReentrant {
        require(_lotteries[_lotteryId].status == Status.Open, "Lottery not open");
        require(block.timestamp > _lotteries[_lotteryId].endTime, "Lottery not over");
        _lotteries[_lotteryId].firstTicketIdNextLottery = currentTicketId;

        _lotteries[_lotteryId].status = Status.Close;

        // Request a random number from the generator based on a seed
        randomGenerator.getRandomNumber(uint256(keccak256(abi.encodePacked(_lotteryId, currentTicketId))));

        emit LotteryClose(_lotteryId, currentTicketId);
    }

    /**
     * @notice Draw the final number, calculate reward in BSW per group, and make lottery claimable
     * @param _lotteryId: lottery id
     * @param _autoInjection: reinjects funds into next lottery (vs. withdrawing all)
     * @param _bswPerBracket: distribution of winnings by bracket
     * @param _countTicketsPerBracket: total number of tickets in each bracket
     * @dev Callable by operator
     */
    function drawFinalNumberAndMakeLotteryClaimable(
        uint256 _lotteryId,
        uint[6] calldata _bswPerBracket,
        uint[6] calldata _countTicketsPerBracket,
        bool _autoInjection
    )
        external
        override
        onlyOperator
        nonReentrant
    {
        require(_lotteries[_lotteryId].status == Status.Close, "Lottery not close");
        require(_lotteryId == randomGenerator.viewLatestLotteryId(), "Numbers not drawn");
        require(_bswPerBracket.length == 6, 'Wrong bswPerBracket array size!');
        require(_countTicketsPerBracket.length == 6, 'Wrong countTicketsPerBracket array size!');

        //Withdraw burn, referrals and competitions pool

        uint amountToDistribute = _withdrawBurnAndCompetition(_lotteryId) + pendingInjectionNextLottery;
        pendingInjectionNextLottery = 0;

        // Calculate the finalNumber based on the randomResult generated by ChainLink's fallback
        uint32 finalNumber = randomGenerator.viewRandomResult();
        uint ticketsCountPerBrackets = 0;
        uint bswSumPerBrackets = 0;
        for (uint i = 0; i < 6; i++){
            uint winningPoolPerBracket = _bswPerBracket[i] * _countTicketsPerBracket[i];
            ticketsCountPerBrackets += _countTicketsPerBracket[i];
            if(_countTicketsPerBracket[i] > 0){
                require(
                    winningPoolPerBracket >= (_lotteries[_lotteryId].rewardsBreakdown[i] * amountToDistribute) / 10000,
                    'Wrong amount on bracket'
                );
            }
            bswSumPerBrackets += winningPoolPerBracket;
        }

        require(bswSumPerBrackets <= amountToDistribute, 'Wrong brackets Total amount');

        _lotteries[_lotteryId].bswPerBracket = _bswPerBracket;
        _lotteries[_lotteryId].countWinnersPerBracket = _countTicketsPerBracket;

        // Update internal statuses for lottery
        _lotteries[_lotteryId].finalNumber = finalNumber;
        _lotteries[_lotteryId].status = Status.Claimable;

        // Transfer not winning BSW to treasury address if _autoInjection is false
        if (_autoInjection) {
            pendingInjectionNextLottery = amountToDistribute - bswSumPerBrackets;
        } else {
            bswToken.safeTransfer(treasuryAddress, amountToDistribute - bswSumPerBrackets);
        }

        emit LotteryNumberDrawn(currentLotteryId, finalNumber, ticketsCountPerBrackets);
    }

    /**
     * @notice Change the random generator
     * @dev The calls to functions are used to verify the new generator implements them properly.
     * It is necessary to wait for the VRF response before starting a round.
     * Callable only by the contract owner
     * @param _randomGeneratorAddress: address of the random generator
     */
    function changeRandomGenerator(address _randomGeneratorAddress) external onlyOwner {
        require(_lotteries[currentLotteryId].status == Status.Claimable, "Lottery not in claimable");

        // Request a random number from the generator based on a seed
        IRandomNumberGenerator(_randomGeneratorAddress).getRandomNumber(
            uint256(keccak256(abi.encodePacked(currentLotteryId, currentTicketId)))
        );

        // Calculate the finalNumber based on the randomResult generated by ChainLink's fallback
        IRandomNumberGenerator(_randomGeneratorAddress).viewRandomResult();

        randomGenerator = IRandomNumberGenerator(_randomGeneratorAddress);

        emit NewRandomGenerator(_randomGeneratorAddress);
    }

    /**
     * @notice Change price oracle
     * @param _priceOracleAddress: address for new price oracle contract
     * @dev Callable only by owner address
     */
    function changeOracle(address _priceOracleAddress) external onlyOwner {
        require(_lotteries[currentLotteryId].status == Status.Claimable, "Lottery not in claimable");
        priceOracle = IPriceOracle(_priceOracleAddress);

        emit NewPriceOracle(_priceOracleAddress);
    }

    /**
     * @notice Inject funds
     * @param _lotteryId: lottery id
     * @param _amount: amount to inject in BSW token
     * @dev Callable by owner or injector address
     */
    function injectFunds(uint256 _lotteryId, uint256 _amount) external override onlyOwnerOrInjector {
        require(_lotteries[_lotteryId].status == Status.Open, "Lottery not open");

        bswToken.safeTransferFrom(address(msg.sender), address(this), _amount);
        _lotteries[_lotteryId].amountCollectedInBSW += _amount;

        emit LotteryInjection(_lotteryId, _amount);
    }

    /**
     * @notice Start the lottery
     * @dev Callable by operator
     * @param _endTime: endTime of the lottery
     * @param _priceTicketInUSDT: price of a ticket in USDT
     * @param _discountDivisor: the divisor to calculate the discount magnitude for bulks
     * @param _rewardsBreakdown: breakdown of rewards per bracket (must sum to 10,000)
     */
    function startLottery(
        uint256 _endTime,
        uint256 _priceTicketInUSDT,
        uint256 _discountDivisor,
        uint256[6] calldata _rewardsBreakdown
    ) external override onlyOperator {
        require(
            (currentLotteryId == 0) || (_lotteries[currentLotteryId].status == Status.Claimable),
            "Not time to start lottery"
        );

        require(
            ((_endTime - block.timestamp) > MIN_LENGTH_LOTTERY) && ((_endTime - block.timestamp) < MAX_LENGTH_LOTTERY),
            "Lottery length outside of range"
        );

        //Calculation price in BSW
        uint256 _priceTicketInBSW = _getPriceInBSW(_priceTicketInUSDT);

        require(
            (_priceTicketInBSW >= minPriceTicketInBSW) && (_priceTicketInBSW <= maxPriceTicketInBSW),
            "Price ticket in BSW Outside of limits"
        );

        require(_discountDivisor >= MIN_DISCOUNT_DIVISOR, "Discount divisor too low");

        require(
            (_rewardsBreakdown[0] +
            _rewardsBreakdown[1] +
            _rewardsBreakdown[2] +
            _rewardsBreakdown[3] +
            _rewardsBreakdown[4] +
            _rewardsBreakdown[5]) == 10000,
            "Rewards must equal 10000"
        );

        currentLotteryId++;
        _lotteries[currentLotteryId] = Lottery({
            status: Status.Open,
            startTime: block.timestamp,
            endTime: _endTime,
            priceTicketInBSW: _priceTicketInBSW,
            priceTicketInUSDT: _priceTicketInUSDT,
            discountDivisor: _discountDivisor,
            rewardsBreakdown: _rewardsBreakdown,
            bswPerBracket: [uint256(0), uint256(0), uint256(0), uint256(0), uint256(0), uint256(0)],
            countWinnersPerBracket: [uint256(0), uint256(0), uint256(0), uint256(0), uint256(0), uint256(0)],
            firstTicketId: currentTicketId,
            firstTicketIdNextLottery: currentTicketId,
            amountCollectedInBSW: 0,
            finalNumber: 0
        });

        emit LotteryOpen(
            currentLotteryId,
            block.timestamp,
            _endTime,
            _priceTicketInUSDT,
            currentTicketId,
            pendingInjectionNextLottery
        );
    }

    /**
     * @notice It allows the admin to recover wrong tokens sent to the contract
     * @param _tokenAddress: the address of the token to withdraw
     * @param _tokenAmount: the number of token amount to withdraw
     * @dev Only callable by owner.
     */
    function recoverWrongTokens(address _tokenAddress, uint256 _tokenAmount) external onlyOwner {
        require(_tokenAddress != address(bswTokenAddress), "Cannot be BSW token");

        IERC20(_tokenAddress).safeTransfer(address(msg.sender), _tokenAmount);

        emit AdminTokenRecovery(_tokenAddress, _tokenAmount);
    }

    /**
     * @notice Set BSW price ticket upper/lower limit
     * @dev Only callable by owner
     * @param _minPriceTicketInBSW: minimum price of a ticket in BSW
     * @param _maxPriceTicketInBSW: maximum price of a ticket in BSW
     */
    function setMinAndMaxTicketPriceInBSW(uint256 _minPriceTicketInBSW, uint256 _maxPriceTicketInBSW)
        external
        onlyOwner
    {
        require(_minPriceTicketInBSW <= _maxPriceTicketInBSW, "minPrice must be < maxPrice");

        minPriceTicketInBSW = _minPriceTicketInBSW;
        maxPriceTicketInBSW = _maxPriceTicketInBSW;
    }

    /**
     * @notice Set max number of tickets
     * @dev Only callable by owner
     */
    function setMaxNumberTicketsPerBuy(uint256 _maxNumberTicketsPerBuy) external onlyOwner {
        require(_maxNumberTicketsPerBuy != 0, "Must be > 0");
        maxNumberTicketsPerBuyOrClaim = _maxNumberTicketsPerBuy;
    }

    /**
     * @notice Set burning and competitions shares
     * @dev Only callable by owner
     */
    function setBurningAndCompetitionShare(uint256 _burningShare, uint256 _competitionAndRefShare) external onlyOwner {
        require(_burningShare != 0 && _competitionAndRefShare != 0, "Must be > 0");
        require(_lotteries[currentLotteryId].status == Status.Claimable, "Lottery not in claimable");
        burningShare = _burningShare;
        competitionAndRefShare = _competitionAndRefShare;
    }

    /**
     * @notice Set max difference between old and new price when update from oracle
     * @dev Only callable by owner
     */
    function setMaxDiffPriceUpdate(uint256 _maxDiffPriceUpdate) external onlyOwner {
        require(_maxDiffPriceUpdate != 0, "Must be > 0");
        maxDiffPriceUpdate = _maxDiffPriceUpdate;
    }

    /**
     * @notice Set operator, treasury, and injector addresses
     * @dev Only callable by owner
     * @param _operatorAddress: address of the operator
     * @param _treasuryAddress: address of the treasury
     * @param _injectorAddress: address of the injector
     * @param _burningAddress: address to collect burn tokens
     * @param _competitionAndRefAddress: address to distribute competitions and referrals shares
     */
    function setManagingAddresses(
        address _operatorAddress,
        address _treasuryAddress,
        address _injectorAddress,
        address _burningAddress,
        address _competitionAndRefAddress
    ) external onlyOwner {
        require(_operatorAddress != address(0), "Cannot be zero address");
        require(_treasuryAddress != address(0), "Cannot be zero address");
        require(_injectorAddress != address(0), "Cannot be zero address");
        require(_burningAddress != address(0), "Cannot be zero address");
        require(_competitionAndRefAddress != address(0), "Cannot be zero address");

        operatorAddress = _operatorAddress;
        treasuryAddress = _treasuryAddress;
        injectorAddress = _injectorAddress;
        burningAddress = _burningAddress;
        competitionAndRefAddress = _competitionAndRefAddress;

        emit NewManagingAddresses(
            _operatorAddress,
            _treasuryAddress,
            _injectorAddress,
            _burningAddress,
            _competitionAndRefAddress
        );
    }

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
    ) external pure returns (uint256) {
        require(_discountDivisor >= MIN_DISCOUNT_DIVISOR, "Must be >= MIN_DISCOUNT_DIVISOR");
        require(_numberTickets != 0, "Number of tickets must be > 0");

        return _calculateTotalPriceForBulkTickets(_discountDivisor, _priceTicket, _numberTickets);
    }

    /**
     * @notice View current lottery id
     */
    function viewCurrentLotteryId() external view override returns (uint256) {
        return currentLotteryId;
    }

    /**
     * @notice View lottery information
     * @param _lotteryId: lottery id
     */
    function viewLottery(uint256 _lotteryId) external view returns (Lottery memory) {
        return _lotteries[_lotteryId];
    }

    /**
     * @notice View ticker statuses and numbers for an array of ticket ids
     * @param _ticketIds: array of _ticketId
     */
    function viewNumbersAndStatusesForTicketIds(uint256[] calldata _ticketIds)
        external
        view
        returns (uint32[] memory, bool[] memory)
    {
        uint256 length = _ticketIds.length;
        uint32[] memory ticketNumbers = new uint32[](length);
        bool[] memory ticketStatuses = new bool[](length);

        for (uint256 i = 0; i < length; i++) {
            ticketNumbers[i] = _tickets[_ticketIds[i]].number;
            if (_tickets[_ticketIds[i]].owner == address(0)) {
                ticketStatuses[i] = true;
            } else {
                ticketStatuses[i] = false;
            }
        }

        return (ticketNumbers, ticketStatuses);
    }

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
        uint32 _bracket
    ) external view returns (uint256) {
        // Check lottery is in claimable status
        if (_lotteries[_lotteryId].status != Status.Claimable) {
            return 0;
            }

        // Check ticketId is within range
        if (
            (_lotteries[_lotteryId].firstTicketIdNextLottery < _ticketId) &&
            (_lotteries[_lotteryId].firstTicketId >= _ticketId)
        ){
            return 0;
        }
        return _calculateRewardsForTicketId(_lotteryId, _ticketId, _bracket);
    }

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
    ) external view returns (
        uint256[] memory,
        uint32[] memory,
        bool[] memory,
        uint256
    ){
        uint256 length = _size;
        uint256 numberTicketsBoughtAtLotteryId = _userTicketIdsPerLotteryId[_user][_lotteryId].length;

        if (length > (numberTicketsBoughtAtLotteryId - _cursor)) {
            length = numberTicketsBoughtAtLotteryId - _cursor;
        }

        uint256[] memory lotteryTicketIds = new uint256[](length);
        uint32[] memory ticketNumbers = new uint32[](length);
        bool[] memory ticketStatuses = new bool[](length);

        for (uint256 i = 0; i < length; i++) {
            lotteryTicketIds[i] = _userTicketIdsPerLotteryId[_user][_lotteryId][i + _cursor];
            ticketNumbers[i] = _tickets[lotteryTicketIds[i]].number;

            // True = ticket claimed
            if (_tickets[lotteryTicketIds[i]].owner == address(0)) {
                ticketStatuses[i] = true;
            } else {
                // ticket not claimed (includes the ones that cannot be claimed)
                ticketStatuses[i] = false;
            }
        }
        return (lotteryTicketIds, ticketNumbers, ticketStatuses, _cursor + length);
    }

    /**
     * @notice Withdraw burn, referrals and competitions pool
     * @param _lotteryId: lottery Id
     * @dev Return collected amount without withdrawal burn ref and comp sum
     */
    function _withdrawBurnAndCompetition(uint _lotteryId) internal returns(uint){
        require(_lotteries[_lotteryId].status == Status.Close, "Lottery not close");

        uint collectedAmount = _lotteries[_lotteryId].amountCollectedInBSW;
        uint burnSum = (collectedAmount * burningShare) / 10000 ;
        uint competitionAndRefSum = (collectedAmount * competitionAndRefShare) / 10000 ;
        bswToken.safeTransfer(burningAddress, burnSum);
        bswToken.safeTransfer(competitionAndRefAddress, competitionAndRefSum);
        return (collectedAmount - burnSum - competitionAndRefSum);
    }

    /**
     * @notice Update BSW price for lotteryID
     */
    function _updateBSWPrice(uint256 _lotteryId) private {
        uint oldPriceInBSW = _lotteries[_lotteryId].priceTicketInBSW;
        uint newPriceInBSW = priceOracle.consult(usdtTokenAddress, _lotteries[_lotteryId].priceTicketInUSDT, bswTokenAddress);

        require(_chekPriceDifference(newPriceInBSW, oldPriceInBSW, maxDiffPriceUpdate), 'Oracle give invalid price');
        _lotteries[_lotteryId].priceTicketInBSW = newPriceInBSW;
    }

    /**
     * @notice Check difference between old and new prices
     */
    function _chekPriceDifference(uint256 _newPrice, uint256 _oldPrice, uint _maxDiff) internal pure returns(bool diff){
        require(_newPrice > 0 && _oldPrice > 0, 'Wrong prices given');
        if(_newPrice > _oldPrice){
            diff = (((_newPrice * 10000) / _oldPrice) - 10000) <= _maxDiff;
        } else {
            diff = (((_oldPrice * 10000) / _newPrice) - 10000) <= _maxDiff;
        }
    }

    /**
     * @notice Get current exchange rate BSW/USDT from oracle
     */
    function _getPriceInBSW(uint256 _priceInUSDT) internal view returns(uint256) {
        return priceOracle.consult(usdtTokenAddress, _priceInUSDT, bswTokenAddress);
    }

    /**
     * @notice Calculate rewards for a given ticket
     * @param _lotteryId: lottery id
     * @param _ticketId: ticket id
     * @param _bracket: bracket for the ticketId to verify the claim and calculate rewards
     */
    function _calculateRewardsForTicketId(
        uint256 _lotteryId,
        uint256 _ticketId,
        uint32 _bracket
    ) internal view returns (uint256) {
        // Retrieve the winning number combination
        uint32 userNumber = _lotteries[_lotteryId].finalNumber;

        // Retrieve the user number combination from the ticketId
        uint32 winningTicketNumber = _tickets[_ticketId].number;

        // Apply transformation to verify the claim provided by the user is true
        uint32 transformedWinningNumber = _bracketCalculator[_bracket] +
        (winningTicketNumber % (uint32(10)**(_bracket + 1)));

        uint32 transformedUserNumber = _bracketCalculator[_bracket] + (userNumber % (uint32(10)**(_bracket + 1)));

        // Confirm that the two transformed numbers are the same, if not throw
        if (transformedWinningNumber == transformedUserNumber) {
            return _lotteries[_lotteryId].bswPerBracket[_bracket];
        } else {
            return 0;
        }
    }

    /**
     * @notice Calculate final price for bulk of tickets
     * @param _discountDivisor: divisor for the discount (the smaller it is, the greater the discount is)
     * @param _priceTicket: price of a ticket
     * @param _numberTickets: number of tickets purchased
     */
    function _calculateTotalPriceForBulkTickets(
        uint256 _discountDivisor,
        uint256 _priceTicket,
        uint256 _numberTickets
    ) internal pure returns (uint256) {
        return (_priceTicket * _numberTickets * (_discountDivisor + 1 - _numberTickets)) / _discountDivisor;
    }

    /**
     * @notice Check if an address is a contract
     */
    function _isContract(address _addr) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(_addr)
        }
        return size > 0;
    }
}
