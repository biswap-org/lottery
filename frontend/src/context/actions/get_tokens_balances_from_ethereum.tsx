import AxiosInstance from "../../helpers/axios";
import { PoolTokenListEthereum } from "../../constants/Tokens";

const API_KEY = "YSZHHDASPMNK69MBP5B4WEW3TMVBUPGEK8";
const url_eth = "https://api-rinkeby.etherscan.io/api";

interface IChainIds {
  id: string;
  url: string;
}

const ethereumChainIds: any = {
  1: "https://api.etherscan.io/api",
  4: "https://api-rinkeby.etherscan.io/api",
};

const get_ether_price = (chainId: string) => {
  const request_string_url =
  ethereumChainIds[chainId] +
    "?module=stats&action=ethprice" +
    "&apikey=" +
    API_KEY;
  return AxiosInstance.get(request_string_url);
};

//function : get_token_from_bscscan
//input : token_symbol
//output : token_info
const get_token_price_from_ethereum = (token_symbol: string) => {
  const Backend_baseUrl = process.env.REACT_APP_POOL_BACKEND_URL;
  console.log(Backend_baseUrl);

  console.log("get_token_price_from_ethereum = ", token_symbol);
  const request_string_url =
    // "https://dex.binance.org/api/v1/fees" +
    //"https://api.binance.com/api/v3/ticker/price?symbol=" +
    // "wss://stream.binance.com:9443/ws/etheur@trade";
    `${Backend_baseUrl}get_token_price_from_ethereum?symbol=${token_symbol}`;
  return AxiosInstance.get(request_string_url, {
    headers: {
      "cache-control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
  });
};

const get_tokens_balances_from_ethereum = async (
  wallet_address: string,
  chainId: string
) => {
  var tokens: any = [];

  let i = 0;
  let eth_price1 = await get_ether_price(chainId);
  let eth_price = await eth_price1.data.result.ethusd;

  while (i < PoolTokenListEthereum.length) {
    let request_string_url = "";
    let TokenItem = PoolTokenListEthereum[i];
    if (TokenItem.symbol == "ETH")
      request_string_url = `${ethereumChainIds[chainId]}?module=account&action=balance&address=${wallet_address}&tag=latest&apikey=${API_KEY}`;
    else
      request_string_url = `${ethereumChainIds[chainId]}?module=account&action=tokenbalance&address=${wallet_address}&contractaddress=${TokenItem.contract}&tag=latest&apikey=${API_KEY}`;
    let token = await AxiosInstance.get(request_string_url);
    console.log("eth token = ", token);
    
    console.log("eth    poolllll  token = ", token.data.result);

    let balance = 0;
    let eth_balance_in_usd = 0;

    if (token.data.status === "1") {
      balance = parseFloat(token.data.result) / 10 ** TokenItem.decimals;
      // # fantom_balance_in_usd = float(balance) * (float(get_matic_price(request)) / 1e18)
      eth_balance_in_usd = balance * parseFloat(eth_price);
    } else {
      balance = 0;
      eth_balance_in_usd = 0;
    }
    let price = { data: 0 };
    try {
      price = await get_token_price_from_ethereum(TokenItem.symbol);
    } catch (e) {
      console.log("error in get_token_price_from_ethereum = ", e);
    }

    console.log("price = ", price.data);
    if (!price.data) {
      price = { ...price, data: 0 };
    }
    let usd_balance = 1 * price.data * balance;
    if (TokenItem.symbol === "ETH" || balance !== 0)
      tokens.push({
        symbol: TokenItem.symbol,
        price: price.data,
        // price: 1,

        contract: TokenItem.contract,
        balance: balance,
        usd_balance: usd_balance,
        // usd_balance: 0.1,
        eth_price: eth_price,
        // icon: get_token_logo(TokenItem.symbol),
        icon: TokenItem.icon,
        type: TokenItem.type,
        decimals: TokenItem.decimals,
      });
    i++;
  }
  console.log(tokens);
  return tokens;
};

export default get_tokens_balances_from_ethereum;
