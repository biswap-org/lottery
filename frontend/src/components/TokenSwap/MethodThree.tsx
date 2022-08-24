import React, { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import {
  Image,
  Box,
  Spacer,
  Flex,
  Text,
  useDisclosure,
  useColorModeValue,
  useColorMode,
  Grid,
  GridItem,
  HStack,
  VStack,
  Center,
} from "@chakra-ui/react";

import BabyTokenIcon from "../../assets/Token-Icons/icon_baby_02_64px.png";
import information from "../../assets/info-01_128px.png";
import caution from "../../assets/warning-02_128px.png";

import BNBTokenIcon from "../../assets/Token-Icons/BNB_64.png";
import MATICTokenIcon from "../../assets/Token-Icons/MATIC_64.png";
import BnbBabyToken from "../../assets/Token-Icons/Baby-02-BNB_64.png";
import fantomBabyToken from "../../assets/Token-Icons/Baby-02-fantom_64.png";
import polygonBabyToken from "../../assets/Token-Icons/Baby-02-polygon_64.png";
import FTMTokenIcon from "../../assets/Token-Icons/FTM_64.png";
import { useEthers, useEtherBalance, useSendTransaction } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
import { useMediaQuery, useToast } from "@chakra-ui/react";
import { RepeatIcon, ArrowDownIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ethers, utils } from "ethers";
import useRefresh from "../../context/useRefresh";

import config from "../../config";

import presaleContractJSON from "../../babies/abis/Presale.json";
import Babylonia_Logo from "../../assets/Babylonia_Logo.png";
import BNBICOQRCODE from "../../assets/images/qrcode/BNBICO1M2-qr-code-F0B90B.png";
import FANTOMICOQRCODE from "../../assets/images/qrcode/fantomICO1M2-qr-code-13B5EC.png";
import POLYGONICOQRCODE from "../../assets/images/qrcode/polygonICO1M2-qr-code-8247E4.png";
import tokenJSON from "../../babies/abis/BABYToken.json";
import usdtJSON from "../../babies/abis/USDTToken.json";
import BnbJson from "../../babies/abis/BnbPolyFantPresaleAbi/BNB.json";
import PolygonJson from "../../babies/abis/BnbPolyFantPresaleAbi/polygon.json";
import { useAppSelector, useAppDispatch } from "@hooks";

import AxiosInstance from "../../helpers/axios";
// import { webInstance } from ".";

// import { RiSwapBoxLine } from "react-icons/ri";
declare const window: any;

export default function MethodTwo() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const grayscaleMode = useAppSelector((state: any) => state.grayscale.value);

  const textTitleColor = useColorModeValue("gray.800", "gray.100");
  const textColor = useColorModeValue("gray.900", "gray.200");
  const { colorMode, toggleColorMode } = useColorMode();

  const bgColor = useColorModeValue("white", "#1B1F3A");
  const bgBoxColor = useColorModeValue("#E2E2E2", "gray.600");
  const buttonColor = useColorModeValue("#F58634", "#0E1555");
  const buttonTxtColor = useColorModeValue("gray.900", "gray.200");

  let web3 = new Web3();
  //web3.currentProvider.setMaxListeners(300);
  if (typeof window !== "undefined") {
    web3 = new Web3(window.ethereum);
  }
  // let web3 = webInstance;

  const toast = useToast();

  const { activateBrowserWallet, account, chainId } = useEthers();
  const BNBBalance = useEtherBalance(account);
  const [bnbValue, setBnbValue] = useState("");
  const [babyValue, setBabyValue] = useState("1");
  const BabyBalance = useEtherBalance(0);
  const { sendTransaction, state } = useSendTransaction();
  const [swapTokenAllowrance, setSwapTokenAllowrance] = useState(
    web3.utils.toBN(0)
  );
  const { fastRefresh } = useRefresh();
  const [babyBalance, setBabyBalance] = useState("");
  const [swapTokenBalance, setSwapTokenBalance] = useState("");
  const [presaleRate, setPresaleRate] = useState(0);
  const [toggleSwap, setToggleSwap] = useState(false);
  const [presaleMatic, setPresaleMatic] = useState(50);
  const [presaleBNB, setPresaleBNB] = useState(25000);
  // const [presaleFantom, setPresaleFantom] = useState("64");

  const walletAddress = useAppSelector((state: any) => state.wallet.walletAddress);
  const selectedNetwork = useAppSelector((state: any) => state.wallet.selectedNetwork);
  const selectedWallet = useAppSelector((state: any) => state.wallet.selectedWallet);

  const [activeAccount, setactiveaccount] = useState(
    "0x84b1ef16C1461B7864a611925FbF31736f924a40"
  );
  const [swapToken, setSwapToken] = useState({
    icon: BNBTokenIcon,
    label: "BNB",
    abi: BnbJson as any,
    price: 25000,
    qrCodeImg: BNBICOQRCODE,
    babyIcon: BnbBabyToken,
  });
  // useEffect(() => {
  //   return () => {};
  // }, [account]);

  const setNativeToken = () => {
    if (chainId == 250) {
      setSwapToken({
        icon: FTMTokenIcon,
        label: "FANTOM",
        abi: usdtJSON as any,
        price: 20,
        babyIcon: fantomBabyToken,
        qrCodeImg: FANTOMICOQRCODE,
      });
    }
    if (chainId == 137) {
      // console.log("matic");
      setSwapToken({
        icon: MATICTokenIcon,
        label: "MATIC",
        abi: PolygonJson as any,
        price: 50,
        qrCodeImg: POLYGONICOQRCODE,
        babyIcon: polygonBabyToken,
      });
    }
    if (chainId == 56) {
      setSwapToken({
        icon: BNBTokenIcon,
        label: "BNB",
        abi: BnbJson as any,
        price: 25000,
        qrCodeImg: BNBICOQRCODE,
        babyIcon: BnbBabyToken,
      });
    }
  };
  const getTokenAddress = () => {
    const networkId = chainId;
    switch (swapToken.label) {
      case "MATIC":
        switch (networkId) {
          case 137:
            return config.contractAddress.usdt[137];
        }
      case "BNB":
        switch (networkId) {
          case 56:
            return config.contractAddress.usdc[56];
        }
        break;
      case "FANTOM":
        switch (networkId) {
          case 250:
            return config.contractAddress.dai[250];
        }
        break;
    }
  };

  // const getBalance = async (address: string) => {
  //   const result = await tokenContract.contract.methods
  //     .balanceOf(address)
  //     .call();
  //   return web3.utils.toBN(result);
  // };

  // const getDepositRate = async () => {
  //   const result = await presaleContract.contract.methods.depositRate().call();
  //   return result;
  // };

  // const DepositBusd = async (
  //   address: string | null | undefined,
  //   amount: string
  // ) => {
  //   const depositMode =
  //     swapToken.label == "busd" ? 0 : swapToken.label == "usdt" ? 1 : 2;
  //   const result = await presaleContract.contract.methods
  //     .DepositBusd(amount, depositMode)
  //     .send({ from: address });
  //   toast({
  //     title: "Thanks for purchasing.",
  //     status: "success",
  //     duration: 9000,
  //     isClosable: true,
  //     position: "top-right",
  //   });
  //   return result;
  // };

  useEffect(() => {
    setNativeToken();
    if (account) {
      // getSwapTokenBalance();
    }

    return () => {};
  }, [chainId, account]);

  useEffect(() => {
    if (account != undefined || account != null) {
      // getRates();
      // loadUserDetail();
    } else {
      // setBabyBalance("-");
      // setSwapTokenBalance("-");
    }
  }, [account, swapToken]);

  const getRates = async () => {
    // if(account){
    //   const swaptokenbalance:any = await getSwapTokenBalance(account ? account : "");
    //   const babybalance = await getBalance(account ? account : "");
    //   const depositRate = await getDepositRate();
    //   setBabyBalance(web3.utils.fromWei(babybalance));
    //   setSwapTokenBalance(web3.utils.fromWei(swaptokenbalance));
    //   // console.log("deeeee", depositRate);
    //   setPresaleRate(depositRate);
    // }
  };

  const loadUserDetail = async () => {
    // const tokenAllowrance = await checkAllowanceSwapToken(account);
    // setSwapTokenAllowrance(tokenAllowrance);
  };

  // const { state, send , sendTransaction} = useContractFunction(contract, "withdraw", {
  //   transactionName: "Unwrap",
  // });

  const Buy = async () => {
    // const amount = `${bnbValue}`;
    // const result = await DepositBusd(account, web3.utils.toWei(amount));
    // getRates();
    // return;
  };

  const swapToggleFunc = async () => {
    setToggleSwap(!toggleSwap);
  };
  const copyAddress = () => {
    navigator.clipboard.writeText("0x84b1ef16C1461B7864a611925FbF31736f924a40");

    toast({
      title: "Address Copied",
      description: "Address Copied to Clipboard",
      status: "success",
      duration: 9000,
      isClosable: true,
    });

    // toast({
    //   title: "coming soon",
    //   description: "Coming soon",
    //   status: "success",
    //   duration: 9000,
    //   isClosable: true,
    // });
  };
  return (
    <>
      <Flex justifyContent={"center"}>
        <Box
          w={["90vw", "90vw", "406px", "406px"]}
          borderRadius="10px"
          border="1px"
          m="0px"
          bg={colorMode === "dark" ? "black" : "white"}
          // boxShadow="2xl"
          // colorshodow="0px 0px 120px rgba(0, 0, 0,1)"
          boxShadow="lg"
          p="7px"
          sx={{ overflowX: "hidden" }}
        >
          <Box
            p={"15px"}
            border="1px"
            borderRadius="10px"
            borderColor={colorMode === "dark" ? "black" : "textTitleColor"}
            bg={colorMode === "dark" ? "#5C5C5C" : bgBoxColor}
            minH={"462px"}
          >
            <Flex>
              <Box
                color={colorMode === "dark" ? "gray.100" : textTitleColor}
                fontSize="18px"
              >
                <Image
                  src={Babylonia_Logo.src}
                  className={grayscaleMode === "gray" ? "grayscale" : ""}
                  alt="babylonia logo"
                  width={"120px"}
                  height="44px"
                />
                <Text fontSize={["20px", "20px", "24px", "24px"]}>METHOD #2</Text>
              </Box>
              <Box ml={["60px", "60px", "130px", "130px"]} mt={"30px"}>
                <Flex gap={5}>
                  <Image
                    src={caution.src}
                    className={grayscaleMode === "gray" ? "grayscale" : ""}
                    alt="warning"
                    width={"40px"}
                    height={"40px"}
                    sx={{
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      window.open(
                        "https://github.com/babyloniaapp/docs/blob/main/guidelines/crowdsale-risks.md"
                      )
                    }
                  />
                  <Image
                    src={information.src}
                    className={grayscaleMode === "gray" ? "grayscale" : ""}
                    sx={{
                      cursor: "pointer",
                    }}
                    alt="information"
                    onClick={() =>
                      window.open(
                        "https://github.com/babyloniaapp/docs/blob/main/guidelines/crowdsale1M2-guide-02.md"
                      )
                    }
                    width={"40px"}
                    height={"40px"}
                  />
                </Flex>
              </Box>
              <Spacer />
            </Flex>
            <Flex height={1}></Flex>
            <Box
              color={colorMode === "dark" ? "white" : textColor}
              id="BNB Field"
              p="3"
              height="60px"
              backgroundColor="white"
              bg={colorMode === "dark" ? "black" : bgColor}
              borderRadius="5"
              border="1px"
            >
              <Flex>
                <Box
                  cursor={"pointer"}
                  display={"flex"}
                  fontWeight={"500"}
                  // onClick={onOpen}
                  textAlign={"center"}
                  justifyContent={"center"}
                  width={"100%"}
                >
                  <Text
                    display={{ base: "none", md: "none", xl: "block" }}
                    textAlign={"center"}
                    fontSize={["12px", "12px", "16px", "18px"]}
                    onClick={copyAddress}
                  >
                    {activeAccount ? activeAccount : "Copy Address"}
                  </Text>
                  <Text
                    display={{ base: "block", md: "none", xl: "none" }}
                    textAlign={"center"}
                    fontSize={["18px", "24px", "16px", "18px"]}
                    onClick={copyAddress}
                  >
                    {activeAccount &&
                      `${activeAccount.slice(0, 10)} ... ${activeAccount.slice(
                        activeAccount.length - 10,
                        activeAccount.length
                      )}`}
                    {/* {activeAccount ? activeAccount : "Copy Address"} */}
                  </Text>
                </Box>
              </Flex>
            </Box>

            <Flex height="3"></Flex>
            <Flex justifyContent={"center"}>
              <Center
                fontSize="18px"
                // pt={"30px"}
                fontFamily="Ropa sans"
                textAlign={"center"}
                m="0px"
                w="full"
                mb="20px"
                h="35px"
              >
                {/* <Box
              > */}
                Only send
                <Image
                  src={swapToken.icon.src}
                  // style={{
                  //   marginRight: "10px",
                  //   height: "30px",
                  //   width: "30px",
                  // }}
                  // pt="4px"
                  alt="BNB Icon"
                  boxSize="25px"
                  objectFit="cover"
                  display="inline"
                  mx={"8px"}
                  className={grayscaleMode === "gray" ? "grayscale" : ""}
                />
                {swapToken.label.toUpperCase()} to this Address
                {/* <Image
                  src={swapToken.babyIcon.src}
                  style={{
                    marginLeft: "4px",
                    height: "23px",
                    width: "23px",
                  }}
                  alt="BABY Icon"
                  boxSize="35px"
                  objectFit="cover"
                  display="inline"
                  className={grayscaleMode === "gray" ? "grayscale" : ""}
                  />{" "}
                BABY TOKEN */}
                {/* </Box> */}
              </Center>
            </Flex>
            <VStack>
              <Box>
                {/* {console.log("swapToken", swapToken)} */}
                <Image
                  src={swapToken.qrCodeImg.src}
                  width={["200px", "200px", "200px"]}
                  height={["200px", "200px", "200px"]}
                  alt="Qrcode"
                  className={grayscaleMode === "gray" ? "grayscale" : ""}
                ></Image>
              </Box>
            </VStack>

            <Flex height={4}></Flex>
          </Box>
        </Box>
      </Flex>
    </>
  );
}
