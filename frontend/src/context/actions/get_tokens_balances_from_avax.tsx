import AxiosInstance from "../../helpers/axios";
import { PoolTokenListBNB, PoolTokenListAvax } from "../../constants/Tokens";

const API_KEY = "IP319HVUGSUYV461C8C3NM34SJIQG3TJK4";
const url_avax = "https://api-testnet.snowtrace.io/api";

interface IChainIds {
  id: string;
  url: string;
}

const avaxChainIds: any = {
  43114: "https://api.snowtrace.io/api",
  43113: "https://api-testnet.snowtrace.io/api",
};

const get_avax_price = (chainId: string) => {
  const request_string_url =
    avaxChainIds[chainId] +
    "?module=stats&action=bnbprice" +
    "&apikey=" +
    API_KEY;
  return AxiosInstance.get(request_string_url);
};

//function : get_token_from_bscscan
//input : token_symbol
//output : token_info
const get_token_price_from_avalanche = (token_symbol: string) => {
  const Backend_baseUrl = process.env.REACT_APP_POOL_BACKEND_URL;

  const request_string_url =
    // "https://dex.binance.org/api/v1/fees" +
    //"https://api.binance.com/api/v3/ticker/price?symbol=" +
    // "wss://stream.binance.com:9443/ws/etheur@trade";
    `${Backend_baseUrl}get_token_price_from_avalanche?symbol=${token_symbol}`;
  return AxiosInstance.get(request_string_url, {
    headers: {
      "cache-control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
  });
};

const get_tokens_balances_from_avalanche = async (
  wallet_address: string,
  chainId: string
) => {
  var tokens: any = [];

  let i = 0;
  let avax_price1 = await get_avax_price(chainId);
  let avax_price = await avax_price1.data.result.ethusd;

  while (i < PoolTokenListAvax.length) {
    let request_string_url = "";
    let TokenItem = PoolTokenListAvax[i];
    if (TokenItem.symbol == "ETH")
      request_string_url = `${avaxChainIds[chainId]}?module=account&action=balance&address=${wallet_address}&tag=latest&apikey=${API_KEY}`;
    else
      request_string_url = `${avaxChainIds[chainId]}?module=account&action=tokenbalance&address=${wallet_address}&contractaddress=${TokenItem.contract}&tag=latest&apikey=${API_KEY}`;
    let token = await AxiosInstance.get(request_string_url);

    let balance = 0;
    let eth_balance_in_usd = 0;

    if (token.data.status === "1") {
      balance = parseFloat(token.data.result) / 10 ** TokenItem.decimals;
      // # fantom_balance_in_usd = float(balance) * (float(get_matic_price(request)) / 1e18)
      eth_balance_in_usd = balance * parseFloat(avax_price);
    } else {
      balance = 0;
      eth_balance_in_usd = 0;
    }
    let price = { data: 0 };
    try {
      price = await get_token_price_from_avalanche(TokenItem.symbol);
    } catch (e) {
      console.log("error in get_token_price_from_avalanche = ", e);
    }

    if (!price.data) {
      price = { ...price, data: 0 };
    }
    let usd_balance = 1 * price.data * balance;
    if (TokenItem.symbol === "AVAX" || balance !== 0)
      tokens.push({
        symbol: TokenItem.symbol,
        price: price.data,
        // price: 1,

        contract: TokenItem.contract,
        balance: balance,
        usd_balance: usd_balance,
        // usd_balance: 0.1,
        avax_price: avax_price,
        // icon: get_token_logo(TokenItem.symbol),
        icon: TokenItem.icon,
        type: TokenItem.type,
        decimals: TokenItem.decimals,
      });
    i++;
  }

  return tokens;
};

export default get_tokens_balances_from_avalanche;
