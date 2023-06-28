import React, { useState, useEffect } from "react";

import Header from "../Header";
import Footer from "../Footer";
import Web3 from "web3";

import {
  Box,
  Container,
  Flex,
  VStack,
  Image,
  Center,
  Button,
  Text,
  InputGroup,
  InputRightElement,
  Input,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  Spacer,
} from "@chakra-ui/react";
import Menu from "../Menu";
import BabyTokenIcon from "../../assets/Token-Icons/icon_baby_02_64px.png";
import BUSDTokenIcon from "../../assets/Token-Icons/BUSD_64.png";
import USDTTokenIcon from "../../assets/Token-Icons/USDT_64.png";
import Babylonia_Logo from "../../assets/Babylonia_Logo.png";
import Swap_icon from "../../assets/swap_icon.png";
import finch from "../../assets/finch.png";
import { useEthers } from "@usedapp/core";
import { useToast } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { ethers } from "ethers";

import config from "../../config";

import presaleContractJSON from "../../babies/abis/Presale.json";
import tokenJSON from "../../babies/abis/BABYToken.json";
import busdJSON from "../../babies/abis/BUSDToken.json";
import usdtJSON from "../../babies/abis/USDTToken.json";
import { useAppSelector, useAppDispatch } from "@hooks";

declare const window: any;

const SwapBox = () => {

  // const dispatch = useAppDispatch();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const grayscaleMode = useAppSelector((state: any) => state.grayscale.value);

  const textTitleColor = useColorModeValue("black", "gray.100");
  const textColor = useColorModeValue("black", "gray.200");
  const { colorMode, toggleColorMode } = useColorMode();

  const bgColor = useColorModeValue("gray.300", "gray.700");

  const bgBoxColor = useColorModeValue("#E2E2E2", "FFFFFF");
  const buttonColor = useColorModeValue("#F58634", "#0E1555");
  const buttonTxtColor = useColorModeValue("gray.900", "gray.200");

  let web3 = new Web3();
  if (typeof window !== "undefined") {
    web3 = new Web3(window.ethereum);
  }

  const toast = useToast();

  const { activateBrowserWallet, account, chainId } = useEthers();
  // const BNBBalance = useEtherBalance(account);
  const [bnbValue, setBnbValue] = useState("0");
  // const [babyValue, setBabyValue] = useState("0");
  // const BabyBalance = useEtherBalance(0);
  // const { sendTransaction, state } = useSendTransaction();
  const [swapTokenAllowrance, setSwapTokenAllowrance] = useState(
    web3.utils.toBN(0)
  );
  // const { fastRefresh } = useRefresh();
  const [babyBalance, setBabyBalance] = useState("");
  const [swapTokenBalance, setSwapTokenBalance] = useState("");
  const [presaleRate, setPresaleRate] = useState(200);

  const [swapToken, setSwapToken] = useState(
    chainId == 56 || chainId == 97
      ? {
        icon: BUSDTokenIcon,
        label: "busd",
        abi: busdJSON as any,
      }
      : {
        icon: USDTTokenIcon,
        label: "usdt",
        abi: usdtJSON as any,
      }
  );

  const getTokenAddress = () => {
    const networkId = chainId;
    switch (swapToken.label) {
      case "usdt":
        switch (networkId) {
          // case 4:
          //   return config.contractAddress.usdt[4];
          case 56:
            return config.contractAddress.usdt[56];
          // case 97:
          //   return config.contractAddress.usdt[97];
          // case 80001:
          //   return config.contractAddress.usdt[80001];
          // case 43113:
          //   return config.contractAddress.usdt[43113];
        }
      case "usdc":
        switch (networkId) {
          // case 4:
          //   return config.contractAddress.usdc[4];
          case 56:
            return config.contractAddress.usdc[56];
          // case 97:
          //   return config.contractAddress.usdc[97];
          // case 80001:
          //   return config.contractAddress.usdc[80001];
          // case 43113:
          //   return config.contractAddress.usdc[43113];
        }
        break;
      case "busd":
        switch (networkId) {
          // case 4:
          //   return config.contractAddress.busd[4];
          case 56:
            return config.contractAddress.busd[56];
          // case 97:
          //   return config.contractAddress.busd[97];
          // case 80001:
          //   return config.contractAddress.usdc[80001];
          // case 43113:
          //   return config.contractAddress.usdc[43113];
        }
        break;
    }
  };
  const getBabyAddress = () => {
    switch (chainId) {
      // case 4:
      //   return config.contractAddress.babyToken[4];
      case 56:
        return config.contractAddress.babyToken[56];
      // case 97:
      //   return config.contractAddress.babyToken[97];
      // case 80001:
      //   return config.contractAddress.babyToken[80001];
      // case 43113:
      //   return config.contractAddress.babyToken[43113];
    }
  };
  const getICOContractAddress = () => {
    switch (chainId) {
      // case 4:
      //   return config.contractAddress.presale[4];
      case 56:
        return config.contractAddress.presale[56];
      // case 97:
      //   return config.contractAddress.presale[97];
      // case 80001:
      //   return config.contractAddress.presale[80001];
      // case 43113:
      //   return config.contractAddress.presale[43113];
    }
  };

  const ITokenContract = new web3.eth.Contract(
    tokenJSON.abi as any,
    getBabyAddress()
  );

  const IPresaleContractAddress = new web3.eth.Contract(
    presaleContractJSON.abi as any,
    getICOContractAddress()
  );

  const tokenContract = {
    address: getBabyAddress(),
    abi: tokenJSON.abi,
    contract: ITokenContract,
    decimals: 18,
  };

  const presaleContract = {
    address: getICOContractAddress(),
    abi: presaleContractJSON.abi,
    contract: IPresaleContractAddress,
  };

  const ApproveSwapToken = async (address: string | null | undefined) => {
    const spender = presaleContract.address;
    const _swapTokenContract = new web3.eth.Contract(
      swapToken.abi as any,
      getTokenAddress()
    );
    const gasPrice = await web3.eth.getGasPrice();
    const result = await _swapTokenContract.methods
      .approve(spender, ethers.constants.MaxUint256)
      .send({ from: address, gasPrice });
    return result;
  };

  const checkAllowanceSwapToken = async (owner: string | null | undefined) => {
    const spender = presaleContract.address;
    const _swapTokenContract = new web3.eth.Contract(
      swapToken.abi as any,
      getTokenAddress()
    );
    const result = await _swapTokenContract.methods
      .allowance(owner, spender)
      .call();
    return web3.utils.toBN(result);
  };

  const getSwapTokenBalance = async (address: string) => {
    const _swapTokenContract = new web3.eth.Contract(
      swapToken.abi as any,
      getTokenAddress()
    );
    const result = await _swapTokenContract.methods.balanceOf(address).call();
    return web3.utils.toBN(result);
  };

  const getBalance = async (address: string) => {
    const result = await tokenContract.contract.methods
      .balanceOf(address)
      .call();
    return web3.utils.toBN(result);
  };

  const getDepositRate = async () => {
    const result = await presaleContract.contract.methods.depositRate().call();
    return result;
  };

  const DepositBusd = async (
    address: string | null | undefined,
    amount: string
  ) => {
    const depositMode =
      swapToken.label == "busd" ? 0 : swapToken.label == "usdt" ? 1 : 2;
      const gasPrice = await web3.eth.getGasPrice();
    const result = await presaleContract.contract.methods
      .DepositBusd(amount, depositMode)
      .send({ from: address, gasPrice });
    toast({
      title: "Thanks for purchasing.",
      status: "success",
      duration: 9000,
      isClosable: true,
      position: "top-right",
    });
    return result;
  };

  useEffect(() => {
    if (account != undefined || account != null) {
      getRates();
      loadUserDetail();
    } else {
      setBabyBalance("0");
      setSwapTokenBalance("0");
    }
  }, [account, swapToken]);

  const getRates = async () => {
    const swaptokenbalance = await getSwapTokenBalance(account ? account : "");
    const babybalance = await getBalance(account ? account : "");
    const depositRate = await getDepositRate();
    setBabyBalance(web3.utils.fromWei(babybalance));
    setSwapTokenBalance(web3.utils.fromWei(swaptokenbalance));
    setPresaleRate(depositRate);
  };

  const loadUserDetail = async () => {
    const tokenAllowrance = await checkAllowanceSwapToken(account);
    setSwapTokenAllowrance(tokenAllowrance);
  };

  // const approveTokens = async () => {
  //   const result = await ApproveSwapToken(account);
  //   const tokenAllowrance = await checkAllowanceSwapToken(account);
  //   toast({
  //     title: "Successfully approved.",
  //     description: "You can purchase BABY with your Token from now.",
  //     status: "success",
  //     duration: 9000,
  //     isClosable: true,
  //     position: "top-right",
  //   });
  //   loadUserDetail();
  // };

  // const Buy = async () => {
  //   const amount = `${bnbValue}`;
  //   const result = await DepositBusd(account, web3.utils.toWei(amount));
  //   getRates();
  //   return;
  // };

  return (
    <Container maxW="100vw" bg="black.900" pt="7vh" pb="3" pl="0" pr="0">
      <Box>
        <Header />
        <Box h="90vh" backgroundColor={bgColor}>
          <Flex
            maxW="100vw"
            align="center"
            bg={bgColor}
            m="0px"
            justifyContent="center"
          // pb={["5vh", "12vh", "12vh", "10vh"]}
          >
            <Box flex="100vw" bg={bgColor}>
              <VStack>
                <Flex
                  pt={["5vh", "10vh", "10vh", "8vh"]}
                  pb={["5vh", "12vh", "12vh", "15vh"]}
                  w={["80vw", "97vw", "50vw", "50vw"]}
                  justifyContent="center"
                  className="ipad-portrait"
                >
                  <Box
                   w={["100%"]}
                    borderRadius="10px"
                    boxShadow="lg"
                    p="7px"
                    border={"1px"}
                    backgroundColor={colorMode === "dark" ? "black" : "white"}
                  >
                    <Box
                      p={"15px"}
                      border="1px"
                      borderRadius={"10px"}
                      bg={colorMode === "dark" ? "#5C5C5C" : bgBoxColor}
                    >
                      <Flex>
                        <Box
                          color={
                            colorMode === "dark" ? "gray.100" : textTitleColor
                          }
                          fontSize="18px"
                        >
                          {/* <Image
                            src={Babylonia_Logo.src}
                            style={{}}
                            alt="BABY logo"
                            className={
                              grayscaleMode === "gray" ? "grayscale" : ""
                            }
                            width="140px"
                          /> */}
                        </Box>
                        <Spacer />
                      </Flex>
                      <Text fontSize="2xl">SWAP</Text>
                      <Flex height="1"></Flex>

                      <Box
                        color={colorMode === "dark" ? "gray.100" : textColor}
                        id="BNB Field"
                        p="3"
                        height="100px"
                        backgroundColor="white"
                        bg={colorMode === "dark" ? "black" : "white"}
                        borderRadius="5"
                        border="1px"
                      >
                        <Flex>
                          <Box
                            cursor={"pointer"}
                            display={"flex"}
                            paddingBottom={"10px"}
                            fontWeight={"300"}
                            onClick={onOpen}
                          >
                            <Image
                              src={swapToken.icon.src}
                              style={{
                                marginRight: "10px",
                                height: "23px",
                                width: "23px",
                              }}
                              className={
                                grayscaleMode === "gray" ? "grayscale" : ""
                              }
                              alt="BABY Icon"
                              boxSize="35px"
                              objectFit="cover"
                              display="inline"
                            />
                            <Text fontSize="lg">
                              USDT
                              <ChevronDownIcon />
                            </Text>
                          </Box>
                          <Spacer />
                          <Box>
                            <Text paddingRight={"0"} fontSize="lg">
                              Balance: 0123456789
                            </Text>
                          </Box>
                        </Flex>
                        <Flex>
                          <InputGroup size="md">
                            <Input
                              pr="4.5rem"
                              type={"number"}
                              value={"0"}
                              borderColor={
                                colorMode === "dark" ? "white" : textColor
                              }
                              border="1px"
                              max={parseFloat(swapTokenBalance)}
                              min={0}
                            />
                            <InputRightElement width="4.5rem">
                              <Button
                                bg="transparent"
                                h="1.75rem"
                                size="sm"
                                style={{ height: "35px" }}
                              >
                                Max
                              </Button>
                            </InputRightElement>
                          </InputGroup>
                        </Flex>
                      </Box>
                      <Box>
                        <Flex justifyContent={"center"}>
                          <Image
                            alt="Grayscale Mode"
                            src={Swap_icon.src}
                            height="43px"
                            className={
                              grayscaleMode === "gray" ? "grayscale" : ""
                            }
                          />
                        </Flex>
                      </Box>
                      <Box
                        color={colorMode === "dark" ? "gray.100" : textColor}
                        id="Baby Field"
                        p="3"
                        height="100px"
                        backgroundColor="white"
                        bg={colorMode === "dark" ? "black" : "white"}
                        borderRadius="5"
                        border="1px"
                      >
                        <Flex>
                          <Box
                            cursor={"pointer"}
                            display={"flex"}
                            paddingBottom={"10px"}
                            fontWeight={"500"}
                          >
                            <Image
                              src={BabyTokenIcon.src}
                              style={{
                                marginRight: "10px",
                                height: "23px",
                                width: "23px",
                              }}
                              className={
                                grayscaleMode === "gray" ? "grayscale" : ""
                              }
                              alt="BABY Icon"
                              boxSize="35px"
                              objectFit="cover"
                              display="inline"
                            />

                            <Text fontSize="lg">
                              BABY
                              <ChevronDownIcon />
                            </Text>
                          </Box>
                          <Spacer />
                          <Box>
                            <Text paddingRight="0" fontSize="lg">
                              Balance: 0123456789
                            </Text>
                          </Box>
                        </Flex>
                        <Flex>
                          <InputGroup>
                            <InputGroup size="md">
                              <Input
                                pr="4.5rem"
                                type={"number"}
                                border="1px"
                                borderColor={
                                  colorMode === "dark" ? "white" : textColor
                                }
                                min={0}
                                value={"0"}
                              />
                            </InputGroup>
                          </InputGroup>
                        </Flex>
                      </Box>
                      <Flex height="6"></Flex>
                      <Box>
                        <Flex>
                          <Text pr={"4px"}>Price 0123456789</Text>{" "}
                          <Image
                            src={swapToken.icon.src}
                            style={{
                              marginRight: "10px",
                              height: "23px",
                              width: "23px",
                            }}
                            className={
                              grayscaleMode === "gray" ? "grayscale" : ""
                            }
                            alt="BABY Icon"
                            boxSize="35px"
                            objectFit="cover"
                            display="inline"
                          />
                          <Text pr="3px">USDT per</Text>
                          <Image
                            src={BabyTokenIcon.src}
                            style={{
                              marginRight: "10px",
                              height: "23px",
                              width: "23px",
                            }}
                            alt="BABY Icon"
                            boxSize="35px"
                            objectFit="cover"
                            className={
                              grayscaleMode === "gray" ? "grayscale" : ""
                            }
                            display="inline"
                          />
                        </Flex>
                        <Flex height="5"></Flex>
                        <Flex>
                          <Text>Minimum received 50050 </Text>{" "}
                          <Image
                            src={BabyTokenIcon.src}
                            style={{
                              marginRight: "10px",
                              marginLeft: "7px",
                              height: "23px",
                              width: "23px",
                            }}
                            className={
                              grayscaleMode === "gray" ? "grayscale" : ""
                            }
                            alt="BABY Icon"
                            boxSize="35px"
                            objectFit="cover"
                            display="inline"
                          />{" "}
                          <Text> BABY </Text>
                        </Flex>
                        <Text>Price Impact 0.30%</Text>
                        <Text>Liquidity Provider Fee 2.5 BNB</Text>
                      </Box>
                      <Flex h={3}></Flex>
                      <Center>
                        <Button
                          // focusBorderColor="none"
                          id="swap_button"
                          border="1px"
                          w="55%"
                          h="40px"
                          borderRadius="5"
                          color={colorMode === "dark" ? "white" : "black"}
                          backgroundColor={
                            colorMode === "dark" ? "black" : "white"
                          }
                          fontFamily="Ropa Sans"
                          fontSize={"19px"}
                          fontWeight="150"
                        >
                          Connect wallet
                        </Button>
                      </Center>
                      <Flex justifyContent={"end"}>
                        <Box mt="-35px">
                          <Image
                            alt="Grayscale Mode"
                            src={finch.src}
                            className={
                              grayscaleMode === "gray" ? "grayscale" : ""
                            }
                          ></Image>
                        </Box>
                      </Flex>
                    </Box>
                  </Box>
                </Flex>
              </VStack>
            </Box>
          </Flex>
        </Box>
        <Menu />
        <Footer />
      </Box>
    </Container>
  );
};

export default SwapBox;
