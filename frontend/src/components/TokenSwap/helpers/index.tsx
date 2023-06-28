
import config from "../../../config";
// importing ABI
import ICO1M1_BSC_JSON from "../../../babies/abis/ICO1M1-BSC.json";
import ICO1M1_POLYGON_JSON from "../../../babies/abis/ICO1M1-POLYGON.json";
import ICO1M1_FANTOM_JSON from "../../../babies/abis/ICO1M1-FANTOM.json";
import tokenJSON from "../../../babies/abis/BABYToken.json";

const getTokenAddress = (swapToken: { label: string }, chainId: any) => {
  let networkId: any = chainId;

  switch (swapToken.label.toUpperCase()) {
    case "USDT":
      switch (networkId) {
        case 56:
          return config.contractAddress.usdt[56];
        case 137:
          return config.contractAddress.usdt[137];
      }
      break;
    case "USDC":
      // console.log(">>>>>>>>>>>", Object.entries(config.contractAddress.usdc));
      // let i = Object.entries(config.contractAddress.usdc).findIndex(t => t[0] === String(networkId));
      // console.log(">>>>>>>>>>>", Object.entries(config.contractAddress.usdc)[i][1]);
      switch (networkId) {
        case 56:
          return config.contractAddress.usdc[56];
        case 137:
          return config.contractAddress.usdc[137];
        case 250:
          return config.contractAddress.usdc[250];
      }
      break;
    case "BUSD":
      switch (networkId) {
        case 56:
          return config.contractAddress.busd[56];
      }
      break;
    case "DAI":
      switch (networkId) {
        case 250:
          return config.contractAddress.dai[250];
      }
      break;
    default:
      return "";
  }
};

const getBabyAddress = (chainId: any) => {
  switch (chainId) {
    // BNB
    case 56:
      return config.contractAddress.babyToken[56];
    // Polygon
    case 137:
      return config.contractAddress.babyToken[137];
    // Fantom
    case 250:
      return config.contractAddress.babyToken[250];
  }
};

const getICOContractAddress = (chainId: any) => {
  switch (chainId) {
    // BNB
    case 56:
      return config.contractAddress.ICO1M1[56];
    // Polygon
    case 137:
      return config.contractAddress.ICO1M1[137];
    // Fantom
    case 250:
      return config.contractAddress.ICO1M1[250];
  }
};



const getPresaleContract = (chainId: any, web3: any) => {
  return {
    address: getICOContractAddress(chainId),
    abi: (chainId == 56) ? ICO1M1_BSC_JSON.abi : (chainId == 137) ? ICO1M1_POLYGON_JSON.abi : ICO1M1_FANTOM_JSON.abi,
    contract: new web3.eth.Contract(
      (chainId == 56) ? ICO1M1_BSC_JSON.abi as any : (chainId == 137) ? ICO1M1_POLYGON_JSON.abi as any : ICO1M1_FANTOM_JSON.abi as any,
      getICOContractAddress(chainId)
    )
  }
}

const getTokenContract = (chainId: any, web3: any) => {
  return {
    address: getBabyAddress(chainId),
    abi: tokenJSON.abi,
    contract: new web3.eth.Contract(
      tokenJSON.abi as any,
      getBabyAddress(chainId)
    ),
    decimals: 18,
  }
}

export { getTokenAddress, getBabyAddress, getICOContractAddress, getPresaleContract, getTokenContract }