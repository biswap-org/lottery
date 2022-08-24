
import { ethers } from "ethers";
import {getTokenAddress} from './index'

const ApproveSwapToken = async (address: string | null | undefined , spender : string | undefined , web3 : any , swapToken : {label : any, abi : any} , chainId : any) => {
    // const spender = presaleContract.address;
    const _swapTokenContract = new web3.eth.Contract(
      swapToken.abi as any,
      getTokenAddress(swapToken, chainId)
    );
    const gasPrice = await web3.eth.getGasPrice();
    const result = await _swapTokenContract.methods
      .approve(spender, ethers.constants.MaxUint256)
      .send({ from: address, gasPrice });
    return result;
  };

  const Depositusd = async (
    walletAddress: string | null | undefined,
    amount: any,
    swapToken : {label : any}, 
    chainId : any,
    web3 : any, 
    presaleContract : {contract : any}
  ) => {
    try{

    let val: any
    let depositMode = 0;
    let symbol = swapToken.label.toUpperCase();
    if (chainId === 56) {
      if (symbol === "BUSD") depositMode = 0;
      if (symbol === "USDT") depositMode = 1;
      if (symbol === "USDC") depositMode = 2;
    } else if (chainId === 137) {
      if (symbol === "USDT") depositMode = 0;
      if (symbol === "USDC") depositMode = 1;
    } else if (chainId === 250) {
      if (symbol === "DAI") depositMode = 0;
      if (symbol === "USDC") depositMode = 1;
    }
    const gasPrice = await web3.eth.getGasPrice();
    const result = await presaleContract.contract.methods
      .Depositusd((amount.toString()), depositMode)
      .send({
        from: walletAddress,// value: web3.utils.toHex(amount),
        gasPrice
      });
  
    return result;
  }catch(error){
    console.log('error in deposit usd:::' , error);
    return false;
  }
  };

  export {ApproveSwapToken, Depositusd}