import { Box, Flex, Menu, MenuButton, MenuItem, MenuList, Text, useColorModeValue, useDisclosure } from "@chakra-ui/react";

import React from "react";
import PolygonNetwork from "@assets/networks/Polygon_128x128.png";
import FantomNetwork from "@assets/networks/Fantom_128x128.png";
import EthereumNetwork from "@assets/networks/icon_eth_01_64px.png";
import AvaxNetwork from "@assets/networks/icon_avax_01_64px.png";
import BinanceNetwork from "@assets/networks/BSC_128x128.png";
import UnselectedNetworks from "@assets/networks/Networks.png";
import PhantomNetwork from "@assets/connectwallet/phantom-wallet_128px.png";

// import { walletActions } from "../../store/walletSlice";
import { useAppSelector, useAppDispatch } from "@hooks";
import { default as chains } from "@config/chains.json";
import Image from "next/image";
import { useEthers } from "@usedapp/core";

declare const window: any;

const NetworkSelectedMenu = (props: any) => {
  const grayscaleMode = useAppSelector((state: any) => state.grayscale.value);
  const bgBtnDrawerSelected = useColorModeValue("gray.600", "gray.300");
  const bgBtnDrawerNotSelected = useColorModeValue("gray.300", "gray.800");
  const bgBtnTextSelected = useColorModeValue("gray.100", "gray.900");
  const bgBtnTextNotSelected = useColorModeValue("gray.800", "gray.400");
  const selectedWallet = useAppSelector(
    (state: any) => state.wallet.selectedWallet
  );
  const { chainId, activateBrowserWallet, deactivate, account } = useEthers();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const solana = useAppSelector((state: any) => state.solana);
  const selectedNetwork = useAppSelector(
    (state: any) => state.wallet.selectedNetwork
  );

  const addChainToNetwork = (ChainId: number) => {
    const chain = chains.find((c: any) => c.id === ChainId);
    console.log("addBSC", chain && chain.name);
    window.ethereum
      .request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: ChainId,
            chainName: chain && chain.name + "ssssss",
            nativeCurrency: chain && chain.nativeCurrency,
            rpcUrls: chain && chain.rpc,
            blockExplorerUrls: chain && chain.explorers,
          },
        ],
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const addBSCNet = () => {
    console.log("addBSC");
    // setSelectedNetwork("BSC", 56);
    window.ethereum
      .request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x38",
            chainName: "Binance Smart Chain Mainnet",
            nativeCurrency: {
              name: "Binance Coin",
              symbol: "BNB",
              decimals: 18,
            },
            rpcUrls: ["https://bsc-dataseed.binance.org/"],
            blockExplorerUrls: ["https://bscscan.com"],
          },
        ],
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const addPolygonNet = () => {
    console.log("addPolygonNet");
    // setSelectedNetwork("Polygon", 137);
    window.ethereum
      .request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0x89",
            chainName: "Polygon Mainnet",
            nativeCurrency: {
              name: "Polygon(MATIC) Coin",
              symbol: "MATIC",
              decimals: 18,
            },
            rpcUrls: ["https://polygon-rpc.com/"],
            blockExplorerUrls: ["https://polygonscan.com/"],
          },
        ],
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const addFantomNet = () => {
    console.log("addFantomNet");
    // setSelectedNetwork("Fantom", 250);
    window.ethereum
      .request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0xfa",
            chainName: "Fantom Opera",
            nativeCurrency: {
              name: "Fantom",
              symbol: "FTM",
              decimals: 18,
            },
            rpcUrls: ["https://rpc.ftm.tools/"],
            blockExplorerUrls: ["https://ftmscan.com/"],
          },
        ],
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const addEthereumNet = () => {
    window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x1' }], // chainId must be in hexadecimal numbers
    });
  };

  const addEthereumTestNet = () => {
    window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x4' }], // chainId must be in hexadecimal numbers
    });
  };
  const addAvaxMainNet = () => {
    console.log("addFantomTestNet");
    // setSelectedNetwork("Avax", 43114);
    window.ethereum
      .request({
        method: "wallet_addEthereumChain",
        params: [
          {
            chainId: "0xA86A",
            chainName: "Avax mainnet",
            nativeCurrency: {
              name: "AVAX",
              symbol: "AVAX",
              decimals: 18,
            },
            rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
            blockExplorerUrls: ["https://snowtrace.io/"],
          },
        ],
      })
      .catch((error: any) => {
        console.log(error);
      });
  };

  const { mode } = useAppSelector((state) => state.theme);
  const hover = {
    bg: "gray.300",
    color: "gray.700",
    borderRadius: "10px",
    px: "8px",
    mx: "5px",
    w: "96%",
  };

  if (selectedWallet === "Solana") {
    return (
      <Menu
      // isOpen={networkButton}
      >
        <MenuButton
          w="40px"
          h="40px"
          // icon={SettingsIcon.src}
          // borderRadius="10px"
          aria-label="Chain Selector Button"
          fontWeight="normal"
        >
          <Flex  {...props} cursor={'pointer'} w="40px" h="40px">
            <Image alt="Settings Button" className={grayscaleMode === "gray" ? "grayscale" : ""}
              src={PhantomNetwork.src}
              width="40px" height="40px">
            </Image>
          </Flex>
        </MenuButton>
        <MenuList
          // backgroundColor={mode === "dark" ? "gray.800" : "gray.200"}
          borderWidth={"1px"}
          borderColor={mode === "dark" ? "gray.200" : "gray.800"}
          zIndex={1400}
          borderRadius={"10px"}
          fontFamily={"Ropa Sans"}
          fontSize={16}
          _hover={{
            // transitionDuration: "100ms",
          }}
        >
          <MenuItem
            _hover={hover}
            onClick={() => {
              // onOpen();
              // comingsoon();
            }}
            h="45px"
            py="0"
          >
            <Flex
              align="center"
              cursor={'pointer'}
              className={'selectchain-item'}
              borderRadius="10"
              my="0"
              bg={
                chainId === 0xA86A
                  ? bgBtnDrawerSelected
                  : bgBtnDrawerNotSelected
              }
              onClick={() => {
                // addAvaxMainNet();
              }}
              w="full"
            >
              <Image
                className={grayscaleMode === "gray" ? "grayscale" : ""}
                width="40px"
                height="40px"
                src={PhantomNetwork.src}
                alt="Pahntom Mainnet"
              ></Image>
              <Text
                ml="10px"
                color={
                  chainId === 0xA86A
                    ? bgBtnTextSelected
                    : bgBtnTextNotSelected
                }
              >
                Phantom Mainnet
              </Text>
            </Flex>
          </MenuItem>
        </MenuList>
      </Menu>)
  } else
    if (selectedWallet === "MetaMask" || selectedWallet === "TrustWallet") {
      return (
        <Menu
        // isOpen={networkButton}
        >
          <MenuButton
            w="40px"
            h="40px"
            // icon={SettingsIcon.src}
            // borderRadius="10px"
            aria-label="Chain Selector Button"
            fontWeight="normal"
          >
            <Box  {...props} cursor={'pointer'} w="40px" h="40px">
              <Image alt="Settings Button" className={grayscaleMode === "gray" ? "grayscale" : ""}
                src={
                  chainId == 97 || chainId == 56
                    ? BinanceNetwork
                    : chainId == 137 || chainId == 80001
                      ? PolygonNetwork
                      : chainId == 250 || chainId == 4002
                        ? FantomNetwork
                        : chainId == 1 || chainId == 4
                          ? EthereumNetwork
                          : chainId == 43113 || chainId == 43114
                            ? AvaxNetwork
                            : UnselectedNetworks
                }
                width="40px" height="40px">
              </Image>
            </Box>
          </MenuButton>
          <MenuList
            // backgroundColor={mode === "dark" ? "gray.800" : "gray.200"}
            borderWidth={"1px"}
            borderColor={mode === "dark" ? "gray.200" : "gray.800"}
            zIndex={1400}
            borderRadius={"10px"}
            fontFamily={"Ropa Sans"}
            fontSize={16}
            _hover={{
              // transitionDuration: "100ms",
            }}
          >
            <MenuItem
              _hover={hover}
              onClick={() => {
                // onOpen();
                // comingsoon();
              }}
              h="45px"
              py="0"
            >
              <Flex
                align="center"
                cursor={'pointer'}
                className={'selectchain-item'}
                borderRadius="10"
                my="0"
                // bg={bgBtnDrawer}
                bg={
                  chainId === 56
                    ? bgBtnDrawerSelected
                    : bgBtnDrawerNotSelected
                }
                onClick={() => {
                  addBSCNet();
                }}
                w="full"
              >
                <Image
                  className={grayscaleMode === "gray" ? "grayscale" : ""}
                  width="40px"
                  height="40px"
                  src={BinanceNetwork}
                  alt="Binance Mainnet"
                ></Image>
                <Text
                  ml="10px"
                  color={
                    chainId === 56
                      ? bgBtnTextSelected
                      : bgBtnTextNotSelected
                  }
                >
                  Binance Mainnet
                </Text>
              </Flex>
            </MenuItem>

            <MenuItem
              _hover={hover}
              onClick={() => {
              }}
              h="45px"
              py="0"
            >
              <Flex
                align="center"
                cursor={'pointer'}
                className={'selectchain-item'}
                borderRadius="10"
                my="0"
                bg={
                  chainId === 137
                    ? bgBtnDrawerSelected
                    : bgBtnDrawerNotSelected
                }
                onClick={() => {
                  addPolygonNet();
                }}
                w="full"
              >
                <Image
                  className={grayscaleMode === "gray" ? "grayscale" : ""}
                  width="40px"
                  height="40px"
                  src={PolygonNetwork}
                  alt="Polygon Mainnet"
                ></Image>
                <Text
                  ml="10px"
                  color={
                    chainId === 137
                      ? bgBtnTextSelected
                      : bgBtnTextNotSelected
                  }
                >
                  Polygon Mainnet
                </Text>
              </Flex>
            </MenuItem>

            <MenuItem
              _hover={hover}
              onClick={() => {
                // onOpen();
                // comingsoon();
              }}
              h="45px"
              py="0"
            >
              <Flex
                align="center"
                cursor={'pointer'}
                className={'selectchain-item'}
                borderRadius="10"
                my="0"
                bg={
                  chainId === 250
                    ? bgBtnDrawerSelected
                    : bgBtnDrawerNotSelected
                }
                onClick={() => {
                  addFantomNet();
                }}
                w="full"
              >
                <Image
                  className={grayscaleMode === "gray" ? "grayscale" : ""}
                  width="40px"
                  height="40px"
                  src={FantomNetwork}
                  alt="Fantom mainnet"
                ></Image>
                <Text
                  ml="10px"
                  color={
                    chainId === 250
                      ? bgBtnTextSelected
                      : bgBtnTextNotSelected
                  }
                >
                  Fantom Mainnet
                </Text>
              </Flex>
            </MenuItem>
          </MenuList>
        </Menu>

      );
    } else {
      return (
        <Menu>
          <MenuButton
            w="40px"
            h="40px"
            aria-label="Chain Selector Button"
            fontWeight="normal"
          >
            <Box  {...props} cursor={'pointer'} w="40px" h="40px">
              <Image alt="Settings Button" className={grayscaleMode === "gray" ? "grayscale" : ""}
                src={UnselectedNetworks.src}
                width="40px" height="40px">
              </Image>
            </Box>
          </MenuButton>
        </Menu>
      )
    }
};

export default NetworkSelectedMenu;
