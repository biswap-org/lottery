import { getTokenAddress } from './index'
import { balanceOf as PolygonBalanceOf } from "../../../context/actions/get_tokens_balances_from_polygon_direct";
import { balanceOf as BnbBalanceOf } from "../../../context/actions/get_tokens_balances_from_binance_direct";
import { balanceOf as FantomBalanceOf } from "../../../context/actions/get_tokens_balances_from_fantom_direct";
import token_oracle_pairs from "../../../babies/abis/token-oracle-pairs.json";


const checkAllowanceSwapToken = async (owner: string | null | undefined, web3: any, spender: any, swapToken: { label: any, abi: any }, chainId: any) => {
  // const spender = presaleContract.address;
  if (typeof getTokenAddress(swapToken, chainId) === "undefined") return web3.utils.toBN(0);
  const _swapTokenContract = new web3.eth.Contract(
    swapToken.abi as any,
    getTokenAddress(swapToken, chainId)
  );
  if (typeof spender === "undefined") {
    return web3.utils.toBN(0);
  }
  try {
    let allowance = web3.utils.toBN(0);
    const result = await _swapTokenContract.methods
      .allowance(owner, spender)
      .call()
    // .then(async (i: any) => {
    // //   setSwapTokenAllowrance(web3.utils.toBN(i.toString()));
    //   allowance = web3.utils.toBN(i);
    // });

    allowance = web3.utils.toBN(result);
    return allowance;
  } catch (e: any) {
    console.log("Error ------>>>>>: ", e);
    return web3.utils.toBN(0)
  }
};


const getSwapTokenBalance = async (walletAddress: any, swapToken: { label: any, abi: any }, chainId: any,) => {
  let balance = 0.0;
  try {
    let symbol = swapToken.label.toUpperCase();
    if (chainId === 137) {
      const pairs: any = token_oracle_pairs.find((c: any) => c.chainId === 137);
      let token: any = pairs.pairs.find((t: any) => t.symbol === symbol);
      balance = await PolygonBalanceOf(walletAddress + "", token.token, token.decimals);
    } else if (chainId === 56) {
      const pairs: any = token_oracle_pairs.find((c: any) => c.chainId === 56);
      let token: any = pairs.pairs.find((t: any) => t.symbol === symbol);
      balance = await BnbBalanceOf(walletAddress + "", token.token, token.decimals);
    } else if (chainId === 250) {
      const pairs: any = token_oracle_pairs.find((c: any) => c.chainId === 250);
      let token: any = pairs.pairs.find((t: any) => t.symbol === symbol);
      balance = await FantomBalanceOf(walletAddress + "", token.token, token.decimals);
    }
    return balance.toString();
  } catch (error) {
    console.log("error  ==========> ", error);
  }
};

const getBABYBalance = async (address: string, tokenContract: { contract: any }, web3: any) => {
  if (address === "") {
    return web3.utils.toBN(0);
  }

  const result = await tokenContract.contract.methods
    .balanceOf(address)
    .call();
  return result;
};

const getDepositRate = async (account: string, presaleContract: { contract: any }, web3: any) => {
  try {
    if (typeof account === "undefined") {
      return web3.utils.toBN(0);
    }
    const result = await presaleContract.contract.methods.depositRate().call();
    return result;
  } catch (error) {
    return web3.utils.toBN(0);
  }
};

export { checkAllowanceSwapToken, getSwapTokenBalance, getBABYBalance, getDepositRate }