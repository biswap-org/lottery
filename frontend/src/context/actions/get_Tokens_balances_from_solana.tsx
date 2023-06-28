import AxiosInstance from "../../helpers/axios";
import BigNumber from "bignumber.js";

import { PoolTokenListSolana } from "../../constants/Tokens";

const API_KEY = "YSZHHDASPMNK69MBP5B4WEW3TMVBUPGEK8";
const url_eth = "https://api-rinkeby.etherscan.io/api";

interface IChainIds {
  id: string;
  url: string;
}

const ethereumChainIds: any = {
  1: "https://api.solscan.io/",
  4: "https://api.solscan.io/",
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
export function toSol(amount: any, decimals = 9) {
  console.log("toSol", amount);
  if (!amount) return 0;

  return new BigNumber(amount).div(10 ** 9).toNumber();
}
const get_token_price_from_solana = (token_symbol: string) => {
  const Backend_baseUrl = "https://api.solscan.io/market";
  const request_string_url = `${Backend_baseUrl}?symbol=${token_symbol}`;
  return AxiosInstance.get(request_string_url, {
    headers: {
      "cache-control": "no-cache",
      "Access-Control-Allow-Origin": "*",
    },
  });
};

const get_tokens_balances_from_solana = async (
  wallet_address: string,
  chainId: string
) => {
  try {
    var tokens: any = [];

    let i = 0;
    // let eth_price1 = await get_ether_price(chainId);
    // let eth_price = await eth_price1.data.result.ethusd;

    while (i < PoolTokenListSolana.length) {
      let request_string_url = "";
      let TokenItem = PoolTokenListSolana[i];
      request_string_url = `https://api.solscan.io/account/tokens?address=${wallet_address}&price=1`;
      let token = await AxiosInstance.get(request_string_url);
      console.log("sol token = ", token);

      // console.log("eth    poolllll  token = ", token.data.result);

      let balance = 0;
      let eth_balance_in_usd = 0;

      if (token.data.data) {
        token.data.data.map((item: any) => {
          // console.log("item------", item);
          // console.log("item", item.tokenSymbol);
          // console.log("token", TokenItem.symbol);
          if (item.tokenAddress == TokenItem.contract) {
            tokens.push({
              symbol: TokenItem.symbol,
              price: item.priceUsdt,
              // price: 1,

              contract: TokenItem.contract,
              balance: item.tokenAmount.uiAmountString,
              usd_balance: (item.tokenAmount.uiAmount * item.priceUsdt),
              // usd_balance: 0.1,
              eth_price: 0,
              // icon: get_token_logo(TokenItem.symbol),
              icon: TokenItem.icon,
              type: TokenItem.type,
              decimals: TokenItem.decimals,
            });
          }
        });
      }

      let userSolBalance = `https://api.solscan.io/account?address=${wallet_address}`;
      let userSolbalance1 = await AxiosInstance.get(userSolBalance);
      console.log("aaaaaaa", userSolbalance1);
      let solanaPrice1;
      let solana_price;
      if (TokenItem.symbol === "SOL") {
        solanaPrice1 = await get_token_price_from_solana(TokenItem.symbol);
        solana_price = solanaPrice1.data.data.priceUsdt;
        console.log("solanaPrice1", solanaPrice1);
      }
      let uiAmountofsol = toSol(userSolbalance1.data.data.lamports);
      if (TokenItem.symbol === "SOL")
        tokens.push({
          symbol: TokenItem.symbol,
          price: solana_price,
          // price: 1,

          contract: TokenItem.contract,
          balance: uiAmountofsol,
          usd_balance: (uiAmountofsol * solana_price),
          // usd_balance: 0.1,
          eth_price: 0,
          // icon: get_token_logo(TokenItem.symbol),
          icon: TokenItem.icon,
          type: TokenItem.type,
          decimals: TokenItem.decimals,
        });
      i++;
    }
    // console.log(tokens);
    return tokens;
  } catch (error) {
    console.log("error", error);
  }
};

export default get_tokens_balances_from_solana;
