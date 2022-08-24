import BabyBNBIcon from "@assets/Token-Icons/Baby-02-BNB_64.png";
import BabyPolygonIcon from "@assets/Token-Icons/Baby-02-polygon_64.png";
import BabyFantomIcon from "@assets/Token-Icons/Baby-02-fantom_64.png";
import BUSDTokenIcon from "@assets/Token-Icons/BUSD_64.png";
import CAKETokenIcon from "@assets/Token-Icons/CAKE_64.png";
import ETHTokenIcon from "@assets/Token-Icons/ETH_64.png";
import USDTTokenIcon from "@assets/Token-Icons/USDT_64.png";
import BTCBTokenIcon from "@assets/Token-Icons/BTCB.png";
import USDCTokenIcon from "@assets/Token-Icons/USDC_64.png";
import MATICTokenIcon from "@assets/Token-Icons/MATIC_64.png";
import WBTCTokenIcon from "@assets/Token-Icons/wbtc_64.png";
import WETHTokenIcon from "@assets/Token-Icons/WETH_128.png";
import FBTCTokenIcon from "@assets/Token-Icons/FBTC_64.png";
import DAITokenIcon from "@assets/Token-Icons/DAI_64.png";
import FTMTokenIcon from "@assets/Token-Icons/FTM_64.png";
import BNBTokenIcon from "@assets/Token-Icons/BNB_64.png";
import FUSDTTokenIcon from "@assets/Token-Icons/fUSDT_128px.png";
import WAVAXIcon from "@assets/Token-Icons/icon_avax_01_64px.png";
import RAYDIUM from '@assets/Token-Icons/raydium.png'
import SOLANA from '@assets/Token-Icons/solana-logo400x400.png'
export interface iNetworkParam {
  chainId: string;
  chainName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: [string];
  blockExplorerUrls: [string];
}

export interface IToken {
  symbol: string;
  contract: string;
  icon: any;
  type: string;
  decimals: number;
}

export const PoolTokenListBNB: IToken[] = [
  {
    symbol: "BABY",
    contract: "0xA4E26Bd6DCBa9021DCd3A1159BA52e97CD770b8a",
    icon: BabyBNBIcon,
    type: "ERC20",
    decimals: 18,
  },
  {
    symbol: "BNB",
    contract: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52",
    icon: BNBTokenIcon,
    type: "ERC20",
    decimals: 10,
  },
  {
    symbol: "BUSD",
    contract: "0xe9e7cea3dedca5984780bafc599bd69add087d56",
    icon: BUSDTokenIcon,
    type: "ERC20",
    decimals: 18,
  },
  {
    symbol: "CAKE",
    contract: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
    icon: CAKETokenIcon,
    type: "ERC20",
    decimals: 18,
  },

  {
    symbol: "USDC",
    contract: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
    icon: USDCTokenIcon,
    type: "ERC20",
    decimals: 18,
  },

  {
    symbol: "BTC",
    contract: "0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c",
    icon: BTCBTokenIcon,
    type: "ERC20",
    decimals: 18,
  },
  {
    symbol: "ETH",
    contract: "0x2170ed0880ac9a755fd29b2688956bd959f933f8",
    icon: ETHTokenIcon,
    type: "ERC20",
    decimals: 18,
  },
  {
    symbol: "USDT",
    contract: "0x55d398326f99059ff775485246999027b3197955",
    icon: USDTTokenIcon,
    type: "ERC20",
    decimals: 18,
  },
];

export const PoolTokenListPolygon: IToken[] = [
  {
    symbol: "BABY",
    contract: "0xA4E26Bd6DCBa9021DCd3A1159BA52e97CD770b8a",
    icon: BabyPolygonIcon,
    type: "ERC20",
    decimals: 18,
  },
  {
    symbol: "USDT",
    contract: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    icon: USDTTokenIcon,
    type: "ERC20",
    decimals: 6,
  },
  {
    symbol: "CAKE",
    contract: "0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82",
    icon: CAKETokenIcon,
    type: "ERC20",
    decimals: 18,
  },
  {
    symbol: "MATIC",
    contract: "0x0000000000000000000000000000000000001010",
    icon: MATICTokenIcon,
    type: "ERC20",
    decimals: 18,
  },
  {
    symbol: "USDC",
    contract: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    icon: USDCTokenIcon,
    type: "ERC20",
    decimals: 6,
  },
  {
    symbol: "BTC",
    contract: "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
    icon: WBTCTokenIcon,
    type: "ERC20",
    decimals: 8,
  },
  {
    symbol: "WETH",
    contract: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
    icon: WETHTokenIcon,
    type: "ERC20",
    decimals: 18,
  },
  {
    symbol: "DAI",
    contract: "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063",
    icon: DAITokenIcon,
    type: "ERC20",
    decimals: 18,
  },
];

export const PoolTokenListFantom: IToken[] = [
  {
    symbol: "FTM",
    contract: "0x1ffbd1e3584f139ca42d77ef99ef99550ecf46a8",
    icon: FTMTokenIcon,
    type: "ERC20",
    decimals: 18,
  },
  {
    symbol: "BABY",
    contract: "0xA4E26Bd6DCBa9021DCd3A1159BA52e97CD770b8a",
    icon: BabyFantomIcon,
    type: "ERC20",
    decimals: 18,
  },
  {
    symbol: "BTC",
    contract: "0x321162cd933e2be498cd2267a90534a804051b11",
    icon: FBTCTokenIcon,
    type: "ERC20",
    decimals: 8,
  },
  {
    symbol: "USDT",
    contract: "0x049d68029688eabf473097a2fc38ef61633a3c7a",
    icon: FUSDTTokenIcon,
    type: "ERC20",
    decimals: 6,
  },
  {
    symbol: "ETH",
    contract: "0x74b23882a30290451A17c44f4F05243b6b58C76d",
    icon: WETHTokenIcon,
    type: "ERC20",
    decimals: 18,
  },
  {
    symbol: "USDC",
    contract: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
    icon: USDCTokenIcon,
    type: "ERC20",
    decimals: 6,
  },
  {
    symbol: "DAI",
    contract: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
    icon: DAITokenIcon,
    type: "ERC20",
    decimals: 18,
  },
];

export const PoolTokenListEthereum: IToken[] = [
  {
    symbol: "FTM",
    contract: "0x1ffbd1e3584f139ca42d77ef99ef99550ecf46a8",
    icon: FTMTokenIcon,
    type: "ERC20",
    decimals: 18,
  },
  {
    symbol: "BTC",
    contract: "0x321162cd933e2be498cd2267a90534a804051b11",
    icon: FBTCTokenIcon,
    type: "ERC20",
    decimals: 6,
  },
  {
    symbol: "USDT",
    contract: "0x049d68029688eabf473097a2fc38ef61633a3c7a",
    icon: FUSDTTokenIcon,
    type: "ERC20",
    decimals: 6,
  },
  {
    symbol: "ETH",
    contract: "0x74b23882a30290451A17c44f4F05243b6b58C76d",
    icon: ETHTokenIcon,
    type: "ERC20",
    decimals: 18,
  },
  {
    symbol: "USDC",
    contract: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75",
    icon: USDCTokenIcon,
    type: "ERC20",
    decimals: 6,
  },
  {
    symbol: "DAI",
    contract: "0x8D11eC38a3EB5E956B052f67Da8Bdc9bef8Abf3E",
    icon: DAITokenIcon,
    type: "ERC20",
    decimals: 18,
  },
];

export const PoolTokenListAvax: IToken[] = [
  {
    symbol: "USDT",
    contract: "0xde3A24028580884448a5397872046a019649b084",
    icon: FUSDTTokenIcon,
    type: "ERC20",
    decimals: 6,
  },
  {
    symbol: "WETH",
    contract: "0x30154562b81788b2a4FD126682795A49A02CCaE1",
    icon: WETHTokenIcon,
    type: "ERC20",
    decimals: 18,
  },
  {
    symbol: "USDC",
    contract: "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E",
    icon: USDCTokenIcon,
    type: "ERC20",
    decimals: 6,
  },
  {
    symbol: "DAI",
    contract: "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
    icon: DAITokenIcon,
    type: "ERC20",
    decimals: 18,
  },
  {
    symbol: "BTC", 
    contract: "0x50b7545627a5162F82A992c33b87aDc75187B218", 
    icon: BTCBTokenIcon, 
    type: "ERC 20", 
    decimals: 8
  }, 
  {
    symbol: "AVAX", 
    contract: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7", 
    icon: WAVAXIcon, 
    type: "ERC 20", 
    decimals: 18
  }
];
export const PoolTokenListSolana: IToken[] = [
  
  {
    symbol: "ETH",
    contract: "7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs",
    icon: WETHTokenIcon,
    type: "ERC20",
    decimals: 8,
  },
  {
    symbol: "USDT",
    contract: "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
    icon: USDTTokenIcon,
    type: "ERC20",
    decimals: 6,
  },
  {
    symbol: "USDC",
    contract: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    icon: USDCTokenIcon,
    type: "ERC20",
    decimals: 6,
  },
  {
    symbol: "BTC",
    contract: "9n4nbM75f5Ui33ZbPYXn59EwSgE8CGsHtAeTH5YFeJ9E",
    icon: WBTCTokenIcon,
    type: "ERC20",
    decimals: 6,
  },
  {
    symbol: "RAY",
    contract: "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R",
    icon: RAYDIUM,
    type: "ERC20",
    decimals: 8,
  },
  {
    symbol: "SOL",
    contract: "",
    icon: SOLANA,
    type: "ERC20",
    decimals: 9,
  },

];
