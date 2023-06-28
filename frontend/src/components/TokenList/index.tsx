import React, { useEffect, useState } from "react";
import { useEthers, } from "@usedapp/core";
import get_tokens_balances_from_binance_direct from "../../context/actions/get_tokens_balances_from_binance_direct";
import get_tokens_balances_from_polygon_direct from "../../context/actions/get_tokens_balances_from_polygon_direct";
import get_tokens_balances_from_fantom_direct from "../../context/actions/get_tokens_balances_from_fantom_direct";
import get_tokens_balances_from_ethereum from "../../context/actions/get_tokens_balances_from_ethereum";
import get_tokens_balances_from_avalanche from "../../context/actions/get_tokens_balances_from_avax";
import get_tokens_balances_from_solana from "src/context/actions/get_Tokens_balances_from_solana";

import { walletActions } from "@store/walletSlice";
import { useAppSelector, useAppDispatch } from "@hooks";
import { useRouter } from "next/router";
import DisconnectedWalet from "./DisconnectedWalet";
import TokenListBtcPolygonFantomWallet from "./TokenListBtcPolygonFantomWallet";
import TokenListSolanaWallet from "./TokenListSolanaWallet";
import UnsupportedNetworks from "./UnsupportedNetworks";
import { default as chains } from "@config/chains.json";

declare const window: any;

export default function TokenList(props: any) {

  const { chainId, activateBrowserWallet, deactivate, account } = useEthers();
  const [log, setLog] = useState<string[]>([]);
  const selectedWallet = useAppSelector((state: any) => state.wallet.selectedWallet);
  const solana = useAppSelector((state: any) => state.solana);
  const router = useRouter();

  const setTokenList = (tokens: any[]) => {
    dispatch(walletActions.setTokenList(tokens));
  }

  const loadTokenList = async (resetList: boolean) => {
    // if (resetList) setTokenList([]);
    if (selectedWallet === "MetaMask" || selectedWallet === "TrustWallet") {
      if ([56, 97].includes(chainId as number)) {
        var list: any = [];
        get_tokens_balances_from_binance_direct(String(account), String(chainId))
          .then((data) => {
            data.map((i: any) => {
              if (i.symbol === "BABY") list.push(i);
            });
            data.map((i: any) => {
              if (i.symbol === "BNB") list.push(i);
            });
            data.map((i: any) => {
              if ((i.symbol !== "BNB") && (i.symbol !== "BABY")) {
                if (parseFloat(i.usd_balance).toFixed(2) !== "0.00") list.push(i);
              }
            });
            setTokenList(list);
          })
          .catch((error) => {
            console.log("error ###############################", error, account);
          });
      } else
        if ([137, 80001].includes(chainId as number)) {
          var list: any = [];
          get_tokens_balances_from_polygon_direct(String(account), String(chainId))
            .then((data) => {
              data.map((i: any) => {
                if (i.symbol === "BABY") list.push(i);
              });
              data.map((i: any) => {
                if (i.symbol === "MATIC") list.push(i);
              });
              data.map((i: any) => {
                if ((i.symbol !== "MATIC") && (i.symbol !== "BABY")) {
                  if (parseFloat(i.usd_balance).toFixed(2) !== "0.00") list.push(i);
                }
              });
              console.log("list=", list);

              setTokenList(list);
            })
            .catch((error) => {
              console.log("error", error);
            });
        } else
          if ([250, 4002].includes(chainId as number)) {
            var list: any = [];
            get_tokens_balances_from_fantom_direct(String(account), String(chainId))
              .then((data) => {
                data.map((i: any) => {
                  if (i.symbol === "BABY") list.push(i);
                });
                data.map((i: any) => {
                  if (i.symbol === "FTM") {
                    list.push(i);
                  }
                });
                data.map((i: any) => {
                  if ((i.symbol !== "FTM") && (i.symbol !== "BABY")) {
                    if (parseFloat(i.usd_balance).toFixed(2) !== "0.00") list.push(i);
                  }
                });
                setTokenList(list);
              })
              .catch((error) => {
                console.log("error", error);
              });
          } else
            if ([1, 4].includes(chainId as number)) {
              var list: any = [];
              get_tokens_balances_from_ethereum(String(account), String(chainId))
                .then((data) => {
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
            } else
              if ([43113, 43114].includes(chainId as number)) {
                var list: any = [];
                get_tokens_balances_from_avalanche(String(account), String(chainId))
                  .then((data) => {
                    data.map((i: any) => {
                      if (i.symbol === "AVAX") {
                        list.push(i);
                      }
                    });
                    data.map((i: any) => {
                      if (i.symbol !== "AVAX") list.push(i);
                    });
                    setTokenList(list);
                  })
                  .catch((error) => {
                    console.log("error", error);
                  });
              }
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

  const BuyToken = (param: any) => {
    router.push("/Crowdsale1");
  };
  const dispatch = useAppDispatch();

  const getList = async (resetList: boolean) => { await loadTokenList(resetList); };

  const walletAddress = useAppSelector((state: any) => state.wallet.walletAddress);

  const setSelectedNetwork = (network: string, chainId: number) => {
    dispatch(walletActions.setTokenList([]));
    dispatch(walletActions.setSelectedNetwork(network));
  }

  useEffect(() => {
    if (selectedWallet === "MetaMask" || selectedWallet === "TrustWallet") {
      // if (account !== undefined || walletAddress !== undefined) {
      const chain = chains.find((c: any) => c.chainId === chainId);
      console.log("chain = ", chain)
      setSelectedNetwork(String(chain && chain.chain), Number(chainId));
      getList(true);
      // }
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

  if (selectedWallet === "Solana") { return (<TokenListSolanaWallet />); }

  if (selectedWallet === "MetaMask" || selectedWallet === "TrustWallet") {
    if (![56, 97, 137, 80001, 250, 4002, 1, 4, 43113, 43114].includes(chainId as number))
      return (<UnsupportedNetworks />);

    if ([56, 97, 137, 80001, 250, 4002, 1, 4, 43113, 43114].includes(chainId as number))
      return (<TokenListBtcPolygonFantomWallet {...props}></TokenListBtcPolygonFantomWallet>);
  }

  return (
    <DisconnectedWalet {...props}></DisconnectedWalet>
  );

}
