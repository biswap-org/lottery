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

export interface ITokenIcons {
    symbol: string;
    icon: any;
}

const BscIconList: ITokenIcons[] = [
    {
        "symbol": "BABY",
        "icon": BabyPolygonIcon
    },
    {
        "symbol": "DAI",
        "icon": DAITokenIcon
    },
    {
        "symbol": "USDC",
        "icon": USDCTokenIcon
    },
    {
        "symbol": "USDT",
        "icon": USDTTokenIcon
    },
    {
        "symbol": "WETH",
        "icon": WETHTokenIcon
    },
    {
        "symbol": "WBTC",
        "icon": WBTCTokenIcon
    },
    {
        "symbol": "WBNB",
        "icon": BNBTokenIcon
    },
    {
        "symbol": "CAKE",
        "icon": CAKETokenIcon
    },
    {
        "symbol": "BUSD",
        "icon": BUSDTokenIcon
    }
];

const PolygonIconList: ITokenIcons[] = [
    {
        "symbol": "BABY",
        "icon": BabyPolygonIcon
    },
    {
        "symbol": "DAI",
        "icon": DAITokenIcon
    },
    {
        "symbol": "USDC",
        "icon": USDCTokenIcon
    },
    {
        "symbol": "USDT",
        "icon": USDTTokenIcon
    },
    {
        "symbol": "WETH",
        "icon": WETHTokenIcon
    },
    {
        "symbol": "WBTC",
        "icon": WBTCTokenIcon
    },
    {
        "symbol": "WNATIVE",
        "icon": MATICTokenIcon
    },
    {
        "symbol": "WMATIC",
        "icon": MATICTokenIcon
    }
];


const FantomIconList: ITokenIcons[] = [
    {
        "symbol": "BABY",
        "icon": BabyFantomIcon
    },
    {
        "symbol": "DAI",
        "icon": DAITokenIcon
    },
    {
        "symbol": "USDC",
        "icon": USDCTokenIcon
    },
    {
        "symbol": "USDT",
        "icon": USDTTokenIcon
    },
    {
        "symbol": "WETH",
        "icon": WETHTokenIcon
    },
    {
        "symbol": "WBTC",
        "icon": WBTCTokenIcon
    },
    {
        "symbol": "WNATIVE",
        "icon": FTMTokenIcon
    },
    {
        "symbol": "WFTM",
        "icon": FTMTokenIcon
    }
];


export const BscIcons = (symbol: string) => {
    const token: any = BscIconList.find((c: any) => c.symbol === symbol);
    return token.icon;
}

export const PolygonIcons = (symbol: string) => {
    const token: any = PolygonIconList.find((c: any) => c.symbol === symbol);
    return token.icon;
}

export const FantomIcons = (symbol: string) => {
    const token: any = FantomIconList.find((c: any) => c.symbol === symbol);
    return token.icon;
}