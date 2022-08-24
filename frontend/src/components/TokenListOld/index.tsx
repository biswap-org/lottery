import React, { useEffect, useState } from "react";
import {
  useEthers,
  ERC20Interface,
  useContractCalls,
  useEtherBalance,
} from "@usedapp/core";
import {
  useToast,
  useClipboard,
  useColorModeValue,
} from "@chakra-ui/react";
import { HiDotsHorizontal } from "react-icons/hi";
import { RiWallet3Line } from "react-icons/ri";
import { formatUnits } from "@ethersproject/units";
// import { useAsync } from "react-async";
// import { getCookie, setCookie } from "typescript-cookie";
import SolanaLogo from "@assets/icons/tokens/solana-logo400x400.png";
import { PoolTokenListBNB } from "../../constants/Tokens";
import get_tokens_balances_from_binance from "../../context/actions/get_tokens_balances_from_binance";
import get_tokens_balances_from_polygon from "../../context/actions/get_tokens_balances_from_polygon";
import get_tokens_balances_from_fantom from "../../context/actions/get_tokens_balances_from_fantom";
import get_tokens_balances_from_ethereum from "../../context/actions/get_tokens_balances_from_ethereum";
import get_tokens_balances_from_avalanche from "../../context/actions/get_tokens_balances_from_avax";
import get_tokens_balances_from_solana from "src/context/actions/get_Tokens_balances_from_solana";
// import grayscaleCss from "@assets/css/grayscale.css";
import { formatEther } from "@ethersproject/units";

import { walletActions } from "@store/walletSlice";
import { useAppSelector, useAppDispatch } from "@hooks";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useRouter } from "next/router";
import DisconnectedWalet from "./DisconnectedWalet";
import TokenListBNBWallet from "./TokenListBNBWallet";
import TokenListSolanaWallet from "./TokenListSolanaWallet";
import UnsupportedNetworks from "./UnsupportedNetworks";
import { default as chains } from "@config/chains.json";

import token_oracle_pairs from "../../babies/abis/token-oracle-pairs.json";
import Web3 from "web3";
// import Image from "@components/Common/Image";
declare const window: any;

function useTokensBalance(tokenList?: any[], account?: string | null) {
  return useContractCalls(
    tokenList && account
      ? tokenList.map((token: any) => ({
        abi: ERC20Interface,
        address: token.address,
        method: "balanceOf",
        args: [account],
      }))
      : []
  );
}

export default function TokenList(props: any) {

  const textColor = useColorModeValue("gray.900", "#C5C5C5");
  const bgListColor = useColorModeValue("gray.300", "gray.600");
  const bgMenuColor = useColorModeValue("gray.300", "gray.600");

  const [loadStatus, setLoadStatus] = useState("");
  const { chainId, activateBrowserWallet, deactivate, account } = useEthers();
  const { hasCopied, onCopy } = useClipboard("");
  const [log, setLog] = useState<string[]>([]);
  const [showZeroTokens, SetShowZeroTokens] = useState(false);
  const toast = useToast();
  const balanceWallet = useAppSelector((state: any) => state.wallet.balance);
  const selectedNetwork = useAppSelector((state: any) => state.wallet.selectedNetwork);
  const selectedWallet = useAppSelector((state: any) => state.wallet.selectedWallet);
  const tokenList = useAppSelector((state: any) => state.wallet.tokenList);

  const etherBalance = useEtherBalance(account);
  // const Balance = useEtherBalance(account);
  const solana = useAppSelector((state: any) => state.solana);
  const router = useRouter();

  const equals = (a: any, b: any) =>
    a.length === b.length &&
    a.every((v: any, i: any) => v === b[i]);

  const setTokenList = (tokens: any[]) => {
    if (equals(tokenList, tokens)) {
      console.log("tokenList is equal to tokens");
      return;
    }
    dispatch(walletActions.setTokenList(tokens));
  }

  const loadTokenList = (resetList: boolean) => {
    if (resetList) setTokenList([]);
    if (selectedWallet === "MetaMask" || selectedWallet === "TrustWallet") {
      if ([56, 97].includes(chainId as number))
        get_tokens_balances_from_binance(String(account), String(chainId))
          .then((data) => {
            var list: any = [];
            data.map((i: any) => {
              if (i.symbol === "BABY") list.push(i);
            });
            data.map((i: any) => {
              if (i.symbol === "BNB") {
                let balance = 0.0;
                i.usd_balance = i.price * i.balance;
              }
              if (i.symbol !== "BABY") {
                list.push(i);
              }
            });
            setTokenList(list);
          })
          .catch((error) => {
            console.log("error", error);
          });
      // console.log("polygoin, account = (", chainId, ")");
      if ([137, 80001].includes(chainId as number))
        get_tokens_balances_from_polygon(String(account), String(chainId))
          .then((data) => {
            var list: any = [];
            data.map((i: any) => {
              if (i.symbol === "MATIC") list.push(i);
            });
            data.map((i: any) => {
              if (i.symbol !== "MATIC") list.push(i);
            });
            // console.log("liiiissstttttt ====", list);
            setTokenList(list);
          })
          .catch((error) => {
            console.log("error", error);
          });
      if ([250, 4002].includes(chainId as number))
        get_tokens_balances_from_fantom(String(account), String(chainId))
          .then((data) => {
            var list: any = [];
            data.map((i: any) => {
              if (i.symbol === "FTM") {
                // dispatch(balanceWallet);
                // let balance = 0.0;
                // if (typeof etherBalance !== "undefined") {
                //   balance = parseFloat(formatEther(etherBalance));
                // }
                // i.balance = balance;
                // i.usd_balance = i.price * balance;
                // console.log("FTM = ", etherBalance);
                list.push(i);
              }
            });
            data.map((i: any) => {
              if (i.symbol !== "FTM") list.push(i);
            });
            setTokenList(list);
          })
          .catch((error) => {
            console.log("error", error);
          });
      if ([1, 4].includes(chainId as number))
        get_tokens_balances_from_ethereum(String(account), String(chainId))
          .then((data) => {
            var list: any = [];
            data.map((i: any) => {
              if (i.symbol === "ETH") {
                // console.log("ETH = ", etherBalance);
                list.push(i);
              }
            });
            data.map((i: any) => {
              if (i.symbol !== "ETH") list.push(i);
            });
            setTokenList(list);
          })
          .catch((error) => {
            console.log("error", error);
          });

      if ([43113, 43114].includes(chainId as number))
        get_tokens_balances_from_avalanche(String(account), String(chainId))
          .then((data) => {
            var list: any = [];
            data.map((i: any) => {
              if (i.symbol === "AVAX") {
                list.push(i);
              }
            });
            data.map((i: any) => {
              if (i.symbol !== "AVAX") list.push(i);
            });
            // console.log("liiiissstttttt ====", list);
            setTokenList(list);
          })
          .catch((error) => {
            console.log("error", error);
          });
    } else if (selectedWallet === "Solana") {
      if (solana.network === "solana") {
        get_tokens_balances_from_solana(solana.walletAddress, "10000")
          .then((data) => {
            var list: any = [];
            data.map((i: any) => {
              if (i.symbol === "SOL") {
                list.push(i);
              }
            });
            data.map((i: any) => {
              if (i.symbol !== "SOL") list.push(i);
            });
            // console.log("liiiissstttttt ====", list);
            setTokenList(list);
          })
          .catch((error) => {
            console.log("error", error);
          });
      }
    }
  };

  const addToken = (params: any) =>
    window.ethereum
      .request({ method: "wallet_watchAsset", params })
      .then(() => setLog([...log, "Success, Token added!"]))
      .catch((error: Error) => setLog([...log, `Error: ${error.message}`]));

  const addTokenToWallet = async (param: any) => {
    const p: any = {
      type: param.type,
      options: {
        address: param.contract,
        symbol: param.symbol,
        decimals: param.decimals,
        image: param.icon,
      },
    };
    const params = await addToken(p);
  };
  // const { data, error, isLoading } = useAsync({ promiseFn: loadTokenList });

  const BuyToken = (param: any) => {
    router.push("/Crowdsale1");
  };
  // const wallet = useAppSelector((state: any) => state.wallet.walletAddress);
  const dispatch = useAppDispatch();
  // dispatch(walletActions.setWalletAddress(account as string));

  const getList = async (resetList: boolean) => {
    await loadTokenList(resetList);
  };

  const walletAddress = useAppSelector(
    (state: any) => state.wallet.walletAddress
  );

  const setSelectedNetwork = (network: string, chainId: number) => {
    dispatch(walletActions.setTokenList([]));
    dispatch(walletActions.setSelectedNetwork(network));
  }

  useEffect(() => {
    if (selectedWallet === "MetaMask" || selectedWallet === "TrustWallet") {
      if (account !== undefined || walletAddress !== undefined) {
        // alert("sssssssssssss")
        getList(true);

      }
    } else
      if (selectedWallet === "Solana") {
        if (solana.network === "solana") {
          getList(true);
          console.log("SelectedNetwork 888888=======================================>>>>>>>>>>>>>>>>")
        }
      }
  }, [selectedNetwork]);

  useEffect(() => {
    if (selectedWallet === "MetaMask" || selectedWallet === "TrustWallet") {
      if (account !== undefined || walletAddress !== undefined) {
        const chain = chains.find((c: any) => c.chainId === chainId);
        console.log("chain = ", chain)
        setSelectedNetwork(String(chain && chain.chain), Number(chainId));
        getList(true);
      }
    } else
      if (selectedWallet === "Solana") {
        if (solana.network === "solana") {
          getList(true);
        }
      }
  }, [chainId]);

  useEffect(() => {
    if (selectedWallet === "MetaMask" || selectedWallet === "TrustWallet") {
      if (account !== undefined || walletAddress !== undefined) {
        const chain = chains.find((c: any) => c.chainId === chainId);
        setSelectedNetwork(String(chain && chain.chain), Number(chainId));
        getList(true);
      }
    } else
      if (selectedWallet === "Solana") {
        if (solana.network === "solana") {
          getList(true);
        }
      }
  }, [selectedWallet]);

  useEffect(() => {
    if (selectedWallet === "MetaMask" || selectedWallet === "TrustWallet") {
      if (account !== undefined || walletAddress !== undefined) {
        getList(false);
      }
    } else
      if (selectedWallet === "Solana") {
        if (solana.network === "solana") {
          getList(false);
        }
      }
  }, [account]);

  useEffect(() => {
    if (selectedWallet === "MetaMask" || selectedWallet === "TrustWallet") {
      if (account !== undefined || walletAddress !== undefined) {
        getList(false);
      }
    } else
      if (selectedWallet === "Solana") {
        if (solana.network === "solana") {
          getList(false);
        }
      }
  }, [walletAddress]);


  useEffect(() => {
    if (selectedWallet === "Solana") {
      if (solana.network === "solana") {
        getList(false);
      }
    }
  }, [solana.network]);

  // useEffect(() => {
  //   if (selectedWallet === "MetaMask" || selectedWallet === "TrustWallet") {
  //     if (etherBalance !== undefined) {
  //       getList(true);
  //     }
  //   }
  // }, [etherBalance]);

  if (selectedWallet === "Solana") {
    return (
      <TokenListSolanaWallet />
    );
  }

  // if (!account)
  //   return (
  //   <DisconnectedWalet {...props}></DisconnectedWalet>
  // );

  if (selectedWallet === "MetaMask" || selectedWallet === "TrustWallet") {
    if (
      ![56, 97, 137, 80001, 250, 4002, 1, 4, 43113, 43114].includes(
        chainId as number
      )
    )
      return (
        <UnsupportedNetworks />
      );

    if (
      [56, 97, 137, 80001, 250, 4002, 1, 4, 43113, 43114].includes(
        chainId as number
      )
    )
      return (
        <TokenListBNBWallet {...props}></TokenListBNBWallet>
      );
  }

  // if ([137, 80001].includes(chainId as number)) return <Text>nothing</Text>;
  // if ([250, 4002].includes(chainId as number)) return <Text>nothing</Text>;
  return (
    <DisconnectedWalet {...props}></DisconnectedWalet>
  );

}
