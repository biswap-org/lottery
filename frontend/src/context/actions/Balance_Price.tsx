import AxiosInstance from "../../helpers/axios";
import { PoolTokenListFantom } from "../../constants/Tokens";
import Web3 from "web3";
import token_oracle_pairs from "../../babies/abis/token-oracle-pairs.json";
import { FantomIcons } from "src/constants/TokenIcons";

let minABI = [
    // balanceOf
    {
        "constant": true,
        "inputs": [{ "name": "_owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "name": "balance", "type": "uint256" }],
        "type": "function"
    },
    // decimals
    {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [{ "name": "", "type": "uint8" }],
        "type": "function"
    },
];

let chainLinkABI = [
    {
        "inputs": [],
        "name": "latestAnswer",
        "outputs": [
            {
                "internalType": "int256",
                "name": "",
                "type": "int256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "decimals",
        "outputs": [
            {
                "internalType": "uint8",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },

    {
        "constant": true,
        "inputs": [],
        "name": "latestTimestamp",
        "outputs": [{ "name": "", "type": "uint256" }],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },

];

interface IPairs {
    chainId: string;
    pairs: Pair[];
}

interface Pair {
    symbol: string;
    token: string;
    usd: string;
}

export const get_User_Fantom_Balance = async (
    walletAddress: string
) => {
    let tokenAddress = "0xfc00face00000000000000000000000000000000";
    const web3 = new Web3(Web3.givenProvider);
    const ITokenContract = new web3.eth.Contract(
        minABI as any,
        tokenAddress
    );

    let balance = await web3.eth.getBalance(walletAddress)
    return (Number(balance)) / (10 ** 18);
}

export const get_User_Matic_Balance = async (
    walletAddress: string
) => {
    let tokenAddress = "0xB8c77482e45F1F44dE1745F52C74426C631bDD52";
    const web3 = new Web3(Web3.givenProvider);
    const ITokenContract = new web3.eth.Contract(
        minABI as any,
        tokenAddress
    );

    let balance = await web3.eth.getBalance(walletAddress)
    return (Number(balance)) / (10 ** 18);
}

export const get_User_BNB_Balance = async (
    walletAddress: string
) => {
    let tokenAddress = "0xB8c77482e45F1F44dE1745F52C74426C631bDD52";
    const web3 = new Web3(Web3.givenProvider);
    const ITokenContract = new web3.eth.Contract(
        minABI as any,
        tokenAddress
    );

    let balance = await web3.eth.getBalance(walletAddress)
    return (Number(balance)) / (10 ** 18);
}

export const getFantomTokenBalance = async (
    walletAddress: string,
    tokenAddress: string,
    decimals: number
) => {
    // let web3 = new Web3();
    const web3 = new Web3(Web3.givenProvider);
    const ITokenContract = new web3.eth.Contract(
        minABI as any,
        tokenAddress
    );

    const tokenContract = {
        address: tokenAddress,
        abi: minABI,
        contract: ITokenContract,
        decimals: decimals,
    };

    if (tokenAddress === "0xfc00face00000000000000000000000000000000") {
        let balance = await web3.eth.getBalance(walletAddress)
        return (Number(balance)) / (10 ** 18);
    }

    const web3_1 = new Web3(Web3.givenProvider);
    const accounts = await web3_1.eth.requestAccounts();
    try {
        const TokenBalance = await new web3_1.eth.Contract(minABI as any, tokenAddress).methods.balanceOf(walletAddress).call();

        const balance: any = TokenBalance / (10 ** decimals);
        console.log(" balanceOf", balance);
        return balance;
    } catch (error) {
        return 0;
    }
}

export const getPrice = async (
    tokenAddress: string,
) => {
    if ((tokenAddress).toLowerCase() === ("0xA4E26Bd6DCBa9021DCd3A1159BA52e97CD770b8a").toLowerCase())
        return 0.1;

    // if ((tokenAddress).toLowerCase() === ("0xB8c77482e45F1F44dE1745F52C74426C631bDD52").toLowerCase())
    //   tokenAddress = "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c";
    // let web3 = new Web3();
    const web3 = new Web3(Web3.givenProvider);
    const ITokenContract = new web3.eth.Contract(
        chainLinkABI as any,
        tokenAddress
    );

    const pairs: any = token_oracle_pairs.find((c: any) => c.chainId === 250);
    if (typeof pairs === "undefined") {
        console.log("getPrice pairs is undefined , tokenAddress = ", tokenAddress);
        return 0;
    }
    console.log("getPrice pairs  = ", pairs);

    const pair: any = pairs?.pairs.find((c: any) => c.token.toLowerCase() === tokenAddress.toLowerCase());

    if (typeof pair === "undefined") {
        return 0;
    }

    const tokenContract = {
        address: pair.usd,
        abi: chainLinkABI,
        contract: ITokenContract,
        // decimals: decimals,
    };

    try {
        const web3_1 = new Web3(Web3.givenProvider);
        const accounts = await web3_1.eth.requestAccounts();
        const price = await new web3_1.eth.Contract(chainLinkABI as any, pair.usd).methods.latestAnswer().call();
        const decimals = await new web3_1.eth.Contract(chainLinkABI as any, pair.usd).methods.decimals().call();
        // const decimals = pair.decimals;
        return price / (10 ** decimals);
    } catch (error) {
        console.log("error!!! Price of (", pair.symbol, "), ", tokenAddress, ") = ", tokenContract);
        return 0;
    }
}


export const getBNBPrice = async () => {
    const bnbAddress = "0x0567f2323251f0aab15c8dfb1967e4e8a7d42aee"
    const web3 = new Web3(Web3.givenProvider);
    const ITokenContract = new web3.eth.Contract(
        chainLinkABI as any,
        bnbAddress
    );

    const tokenContract = {
        address: "",
        abi: chainLinkABI,
        contract: ITokenContract,
        // decimals: decimals,
    };

    try {
        const web3_1 = new Web3(Web3.givenProvider);
        const accounts = await web3_1.eth.requestAccounts();
        const price = await new web3_1.eth.Contract(chainLinkABI as any, bnbAddress).methods.latestAnswer().call();
        const decimals = await new web3_1.eth.Contract(chainLinkABI as any, bnbAddress).methods.decimals().call();
        // const decimals = pair.decimals;
        return price / (10 ** decimals);
    } catch (error) {
        console.log("error!!! Price of = ", tokenContract);
        return 0;
    }
}

export const getMATICPrice = async () => {
    const bnbAddress = "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0"
    const web3 = new Web3(Web3.givenProvider);
    const ITokenContract = new web3.eth.Contract(
        chainLinkABI as any,
        bnbAddress
    );

    const tokenContract = {
        address: "",
        abi: chainLinkABI,
        contract: ITokenContract,
        // decimals: decimals,
    };

    try {
        const web3_1 = new Web3(Web3.givenProvider);
        const accounts = await web3_1.eth.requestAccounts();
        const price = await new web3_1.eth.Contract(chainLinkABI as any, bnbAddress).methods.latestAnswer().call();
        const decimals = await new web3_1.eth.Contract(chainLinkABI as any, bnbAddress).methods.decimals().call();
        // const decimals = pair.decimals;
        return price / (10 ** decimals);
    } catch (error) {
        console.log("error!!! Price of = ", tokenContract);
        return 0;
    }
}



export const getFTMPrice = async () => {
    const bnbAddress = "0xf4766552D15AE4d256Ad41B6cf2933482B0680dc"
    const web3 = new Web3(Web3.givenProvider);
    const ITokenContract = new web3.eth.Contract(
        chainLinkABI as any,
        bnbAddress
    );

    const tokenContract = {
        address: "",
        abi: chainLinkABI,
        contract: ITokenContract,
        // decimals: decimals,
    };

    try {
        const web3_1 = new Web3(Web3.givenProvider);
        const accounts = await web3_1.eth.requestAccounts();
        const price = await new web3_1.eth.Contract(chainLinkABI as any, bnbAddress).methods.latestAnswer().call();
        const decimals = await new web3_1.eth.Contract(chainLinkABI as any, bnbAddress).methods.decimals().call();
        // const decimals = pair.decimals;
        return price / (10 ** decimals);
    } catch (error) {
        console.log("error!!! Price of = ", tokenContract);
        return 0;
    }
}
