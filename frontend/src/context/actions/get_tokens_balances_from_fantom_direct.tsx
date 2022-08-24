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

export const balanceOf = async (
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
    return balance;
  } catch (error) {
    return 0;
  }
}


interface IPairs {
  chainId: string;
  pairs: Pair[];
}

interface Pair {
  symbol: string;
  token: string;
  usd: string;
}

const getPrice = async (
  chainId: Number,
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

  const pairs: any = token_oracle_pairs.find((c: any) => c.chainId === chainId);
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

const get_tokens_balances_from_fantom = async (
  wallet_address: string,
  chainId: string
) => {
  var tokens: any = [];
  if (chainId !== "250") {
    return tokens;
  }
  // wallet_address = "0x63d62E6CB2aA4de4E3c7E59D188480C7f13d8be5";
  // wallet_address = "0x55fC0527919d3Cb5bEf131Ce3FBE5F12B36Febe1";

  let i = 0;
  const pairs: any = token_oracle_pairs.find((c: any) => c.chainId === 250);
  console.log("pairsssssssssssss = ", pairs)
  // console.log("fantom_price=", fantom_price);
  while (i < pairs.pairs.length) {
    let TokenItem: any = pairs.pairs[i];
    console.log("----------------------------------------", TokenItem)
    let balance = 0;
    if (TokenItem.symbol === "WNATIVE") {
      let balance = await balanceOf(wallet_address, TokenItem.token, TokenItem.decimals);
      let tokenPrice: any = await getPrice(250, TokenItem.token);
      tokens.push({
        symbol: "FTM",
        price: tokenPrice,
        contract: TokenItem.token,
        balance: balance,
        usd_balance: tokenPrice * balance,
        fantom_price: tokenPrice,
        // icon: get_token_logo(TokenItem.symbol),
        icon: FantomIcons(TokenItem.symbol),
        type: TokenItem.type,
        decimals: TokenItem.decimals,
      });
    }
    else if (TokenItem.symbol === "BABY") {
      let balance = await balanceOf(wallet_address, TokenItem.token, TokenItem.decimals);
      tokens.push({
        symbol: TokenItem.symbol,
        price: 0.01,
        contract: TokenItem.token,
        balance: balance,
        usd_balance: 0.01 * balance,
        fantom_price: 0.01,
        // icon: get_token_logo(TokenItem.symbol),
        icon: FantomIcons(TokenItem.symbol),
        type: TokenItem.type,
        decimals: TokenItem.decimals,
      });
    } else {
      let balance = await balanceOf(wallet_address, TokenItem.token, TokenItem.decimals);
      console.log("balance=", balance, "TokenItem.token=", TokenItem.token, "TokenItem.symbol=", TokenItem.symbol);
      if (balance !== 0) {
        let tokenPrice: any = await getPrice(250, TokenItem.token);
        tokens.push({
          symbol: TokenItem.symbol,
          price: tokenPrice,
          contract: TokenItem.token,
          balance: balance,
          usd_balance: tokenPrice * balance,
          fantom_price: tokenPrice,
          // icon: get_token_logo(TokenItem.symbol),
          icon: FantomIcons(TokenItem.symbol),
          type: TokenItem.type,
          decimals: TokenItem.decimals,
        });

      }
    }
    i++;
  }

  return tokens;
};

export default get_tokens_balances_from_fantom;
