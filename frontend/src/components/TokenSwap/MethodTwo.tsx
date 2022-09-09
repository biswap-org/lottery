import React, { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import {
  Image,
  Center,
  Button,
  Box,
  Spacer,
  Flex,
  Text,
  InputGroup,
  InputRightElement,
  Input,
  useDisclosure,
  useColorModeValue,
  useColorMode,
} from "@chakra-ui/react";
// SettingsIcon,
import BabyTokenIcon from "../../assets/Token-Icons/icon_baby_02_64px.png";
import BnbBabyToken from "../../assets/Token-Icons/Baby-02-BNB_64.png";
import fantomBabyToken from "../../assets/Token-Icons/Baby-02-fantom_64.png";
import polygonBabyToken from "../../assets/Token-Icons/Baby-02-polygon_64.png";
import BNBTokenIcon from "../../assets/Token-Icons/BNB_64.png";
import MATICTokenIcon from "../../assets/Token-Icons/MATIC_64.png";
import FTMTokenIcon from "../../assets/Token-Icons/FTM_64.png";
import information from "../../assets/info-01_128px.png";
import caution from "../../assets/warning-02_128px.png";

import { useEthers, useEtherBalance, useSendTransaction } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
import { useMediaQuery, useToast } from "@chakra-ui/react";
import { RepeatIcon, ArrowDownIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { ethers, utils } from "ethers";
import useRefresh from "../../context/useRefresh";

import ethereum from "@usedapp/core/dist/esm/src/model/chain/ethereum";

import config from "../../config";
// import myabi from "./abi.json"
import presaleContractJSON from "../../babies/abis/Presale.json";
import Babylonia_Logo from "../../assets/Babylonia_Logo.png";
import bnbJson from "../../babies/abis/ICO1M2-BNB.json";
import polygonJson from "../../babies/abis/ICO1M2-POLYGON.json";
import fantomJson from "../../babies/abis/ICO1M2-FANTOM.json";
import tokenJSON from "../../babies/abis/BABYToken.json";
import { useAppSelector, useAppDispatch } from "@hooks";
import AxiosInstance from "../../helpers/axios";
import axios from "axios";
import BigNumber from "bignumber.js";
import ConnectWalletModal from "@components/ConnectWalletModal";
import { getBNBPrice, getFTMPrice, getMATICPrice, getPrice, get_User_BNB_Balance, get_User_Fantom_Balance, get_User_Matic_Balance } from "src/context/actions/Balance_Price";
// import { webInstance } from ".";

declare const window: any;

export default function MethodTwo() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const grayscaleMode = useAppSelector((state: any) => state.grayscale.value);

  const textTitleColor = useColorModeValue("gray.800", "gray.100");
  const textColor = useColorModeValue("gray.900", "gray.200");
  const { colorMode, toggleColorMode } = useColorMode();

  const bgColor = useColorModeValue("white", "#1B1F3A");
  const bgBoxColor = useColorModeValue("#E2E2E2", "gray.600");
  const buttonColor = useColorModeValue("#F58634", "#0E1555");
  const buttonTxtColor = useColorModeValue("gray.900", "gray.200");

  let web3 = new Web3();
  if (typeof window !== "undefined") {
    web3 = new Web3(window.ethereum)
  }
  // let web3= webInstance;

  const toast = useToast();

  const { activateBrowserWallet, account, chainId } = useEthers();
  const NativeCryptoBalance = useEtherBalance(account);
  const [NativeTokenValue, setNativeCurrencyValue] = useState("0");
  const [babyValue, setBabyValue] = useState("0");
  const BabyBalance = useEtherBalance(0);
  const { sendTransaction, state } = useSendTransaction();
  const [swapTokenAllowrance, setSwapTokenAllowrance] = useState(
    web3.utils.toBN(0)
  );
  const { fastRefresh } = useRefresh();
  const [buyBtnDisabled, setBuyBtnDisabled] = useState(false);
  const [babyBalance, setBabyBalance] = useState("");
  const [swapTokenBalance, setSwapTokenBalance] = useState("0");
  const [presaleRate, setPresaleRate] = useState(0);
  const [toggleSwap, setToggleSwap] = useState(false);
  const [presaleMatic, setPresaleMatic] = useState(64);
  const [presaleBNB, setPresaleBNB] = useState(300000);
  // const [presaleFantom, setPresaleFantom] = useState("64");

  const walletAddress = useAppSelector(
    (state: any) => state.wallet.walletAddress
  );
  const selectedNetwork = useAppSelector(
    (state: any) => state.wallet.selectedNetwork
  );
  const selectedWallet = useAppSelector(
    (state: any) => state.wallet.selectedWallet
  );

  const [swapToken, setSwapToken] = useState({
    icon: BNBTokenIcon,
    label: " BNB",
    abi: bnbJson as any,
    price: 30000,
    babyIcon: BnbBabyToken,
  });

  const setNativeToken = () => {
    if (chainId == 250) {
      setSwapToken({
        icon: FTMTokenIcon,
        label: "FANTOM",
        abi: fantomJson as any,
        price: 20,
        babyIcon: fantomBabyToken,
      });
    }
    if (chainId == 137) {
      setSwapToken({
        icon: MATICTokenIcon,
        label: "MATIC",
        abi: polygonJson as any,
        price: 50,
        babyIcon: polygonBabyToken,
      });
    }
    if (chainId == 56) {
      setSwapToken({
        icon: BNBTokenIcon,
        label: "BNB",
        abi: bnbJson as any,
        price: 25000,
        babyIcon: BnbBabyToken,
      });
    }
  };
  const getTokenAddress = () => {
    const networkId = chainId;
    switch (swapToken.label.toUpperCase()) {
      case "MATIC":
        switch (networkId) {
          case 137:
            return config.contractAddress.ICO1M2[137];
        }
      case "BNB":
        switch (networkId) {
          case 56:
            return config.contractAddress.ICO1M2[56];
        }
        break;
      case "FANTOM":
        switch (networkId) {
          case 250:
            return config.contractAddress.ICO1M2[250];
        }
        break;
    }
  };

  const getBabyAddress = () => {
    return config.contractAddress.babyToken[56];
    switch (chainId) {
      case 56:
        return config.contractAddress.babyToken[56];
    }
  };
  const getICOContractAddress = () => {
    switch (chainId) {
      case 56:
        return config.contractAddress.ICO1M2[56];
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

  const getSwapTokenBalance = async (address: any) => {
    try {
      // web3.currentProvider.setMaxListeners(300);

      let swapRateBN = "";
      if (chainId === 137) {
        let userMatic = await get_User_Matic_Balance(account + "");
        let swapRate = await getMATICPrice();
        setSwapTokenBalance(userMatic.toString());
        swapRateBN = Number(swapRate * 100)
          .toFixed(3)
          .toString();
      } else if (chainId === 56) {
        let swapRate = await getBNBPrice();
        let userBnb = await get_User_BNB_Balance(account + "");
        setSwapTokenBalance(userBnb.toString());
        swapRateBN = Number(swapRate * 100)
          .toFixed(0)
          .toString();
      } else if (chainId === 250) {
        let swapRate = await getFTMPrice();
        let userFtm = await get_User_Fantom_Balance(account + "");
        setSwapTokenBalance(userFtm.toString());
        swapRateBN = Number(swapRate * 100)
          .toFixed(3)
          .toString();
      }

      setPresaleRate(parseFloat(swapRateBN));
      return web3.utils.toBN(0);
    } catch (error) {
      console.log("error", error);
    }

    // return web3.utils.toBN(10000);
  };

  const getBalance = async (address: string) => {
    try {
      const result = await tokenContract.contract.methods
        .balanceOf(address)
        .call();

      return web3.utils.toBN(result).toString();
    } catch (error) { }
  };

  useEffect(() => {
    if (NativeCryptoBalance) {
      setSwapTokenBalance(web3.utils.fromWei(NativeCryptoBalance.toString()));
    }
  }, [NativeCryptoBalance]);

  const getDepositRate = async () => {
    const result = await presaleContract.contract.methods.depositRate().call();
    return result;
  };


  // const estimateGas = async (
  //   tokenAddress = "0x0000000000000000000000000000000000001004",
  //   fromAddress = "0xE633bD135149e5C886B4cf472e938f07aEA1Cf60",
  //   toAddress = "0xa4e26bd6dcba9021dcd3a1159ba52e97cd770b8a",
  //   amount: any
  // ) => {

  //   // Get ERC20 Token contract instance
  //   let contract = new web3.eth.Contract(myabi as any, tokenAddress, {
  //     from: fromAddress
  //   });
  //   // calculate ERC20 token amount
  //   console.log("ammmmmmmmmmmmmmount =", amount)
  //   // let tokenAmount = web3.utils.toWei(amount, 'ether')
  //   let tokenAmount = amount;
  //   console.log("toWei tokenAmount= ", tokenAmount)
  //   // Will call estimate the gas a method execution will take when executed in the EVM without.
  //   let estimateGas = await web3.eth.estimateGas({
  //     "value": '0x0', // Only tokens
  //     "data": contract.methods.transfer(toAddress, tokenAmount).encodeABI(),
  //     "from": fromAddress,
  //     "to": toAddress
  //   });
  //   console.log("-------->>>>>>>>>", {
  //     tokenAmount: tokenAmount,
  //     estimateGas: estimateGas * 1.5
  //   });
  //   return estimateGas * 1.5;
  // }


  const DepositNativeToken = async (
    address: string | null | undefined,
    amount: any
  ) => {
    let gasPrice : any = await web3.eth.getGasPrice();
    const transactionParameters = {
      to: "0x84b1ef16C1461B7864a611925FbF31736f924a40", // Required except during contract publications.
      from: address, // must match user's active address.
      value: (amount * 1).toString(16), // Only required to send ether to the recipient from the initiating external account.
      gasPrice : web3.utils.toHex(gasPrice),
      gas : web3.utils.toHex(163748),
    };

    // txHash is a hex string
    // As with any RPC call, it may throw an error
    const txHash = await window.ethereum.request({
      method: "eth_sendTransaction",
      params: [transactionParameters],
    });
    // let acc: any = account;
    // const depositMode = web3.eth
    //   .sendTransaction({
    //     from: acc,
    //     to: "0x84b1ef16C1461B7864a611925FbF31736f924a40",
    //     value: amount,
    //   })
    //   .then(function (receipt) {
    //     toast({
    //       title: "Thanks for purchasing.",
    //       status: "success",
    //       duration: 9000,
    //       isClosable: true,
    //       position: "top-right",
    //     });
    //     return receipt;
    //   });
    // if (depositMode) {
    //   return depositMode;
    // }
    // return result;
  };

  useEffect(() => {
    if (account != undefined || account != null) {
      setNativeToken();
      setSwapToken({
        icon: BNBTokenIcon,
        label: "BNB",
        abi: bnbJson as any,
        price: 25000,
        babyIcon: BnbBabyToken,
      });

      getRates();
      if (NativeCryptoBalance) {
        setSwapTokenBalance(web3.utils.fromWei(NativeCryptoBalance.toString()));
      }
      loadUserDetail();
    } else {
      setBabyBalance("0");
      setSwapTokenBalance("0");
    }
  }, []);

  useEffect(() => {
    if (account != undefined || account != null) {
      setNativeToken();
      getRates();
      // loadUserDetail();
      if (NativeCryptoBalance) {
        setSwapTokenBalance(web3.utils.fromWei(NativeCryptoBalance.toString()));
      }
      setNativeCurrencyValue("0");
      setBabyValue("0")
    } else {
      setBabyBalance("0");
      setSwapTokenBalance("0");
    }
  }, [chainId]);

  const getRates = async () => {
    try {
      if (account) {
        const swaptokenbalance: any = await getSwapTokenBalance(
          account ? account : ""
        );

        const babybalance = await getBalance(account ? account : "");
        // const depositRate: any = await getDepositRate();
        let test: string = babybalance!;
        setBabyBalance(web3.utils.fromWei(test as string));
        // if (swapTokenBalance) {
        //   setSwapTokenBalance(web3.utils.fromWei(swaptokenbalance));
        // }
      }
    } catch (error) { }
  };

  const loadUserDetail = async () => {
    // const tokenAllowrance = await checkAllowanceSwapToken(account);
    // setSwapTokenAllowrance(tokenAllowrance);
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

  // const { state, send , sendTransaction} = useContractFunction(contract, "withdraw", {
  //   transactionName: "Unwrap",
  // });
  const Buy = async () => {
    const amount = `${NativeTokenValue}`;

    if (parseFloat(amount) === 0) {
      toast({
        title: "Invalid amount.",
        description: "The amount cannot be zero.",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } else { 
      const result = await DepositNativeToken(account, web3.utils.toWei(amount));
      getRates();
    }
  };

  const swapToggleFunc = async () => {
    setToggleSwap(!toggleSwap);
  };
  const removeGasFee = () => {
    if (parseFloat(swapTokenBalance) < 0.001000300031805317) {
      setSwapTokenBalance("0");
      toast({
        title: "Not sufficient funds.",
        description: "Top up your wallet first.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      setBuyBtnDisabled(true);
      return false;
    } else {
      // let removeGas = web3.utils.fromWei('0000000300031805317');
      // console.log("else swapTokenBalance", swapTokenBalance);
      // let minus = new BigNumber(swapTokenBalance).minus(removeGas);
      // setNativeCurrencyValue(minus.toString());
      let amount: any = swapTokenBalance;
      let amount1 = amount - 0.01;
      if (chainId === 137 || chainId === 250) amount1 = amount - 0.1;
      setNativeCurrencyValue(amount1.toString());
      setBuyBtnDisabled(false);
    }
  };
  return (
    <Flex justifyContent={"center"}>
      <Box
        w={["90vw", "90vw", "340px", "340px"]}
        borderRadius="10px"
        border="1px"
        bg={colorMode === "dark" ? "black" : "white"}
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
          minH={["", "", "", "462px"]}
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
            <Box ml={"60px"} mt={"30px"}>
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

          <Flex height="1"></Flex>
          <Box
            color={colorMode === "dark" ? "white" : textColor}
            id="BNB Field"
            p="3"
            height="100px"
            backgroundColor="white"
            bg={colorMode === "dark" ? "black" : bgColor}
            borderRadius="5"
            border="1px"
          >
            <Flex>
              <Box
                cursor={"pointer"}
                display={"flex"}
                paddingBottom={"10px"}
                fontWeight={"500"}
                onClick={onOpen}
              >
                <Image
                  src={swapToken.icon.src}
                  style={{
                    marginRight: "10px",
                    height: "23px",
                    width: "23px",
                  }}
                  alt="BNB Icon"
                  boxSize="35px"
                  objectFit="cover"
                  display="inline"
                  className={grayscaleMode === "gray" ? "grayscale" : ""}
                />
                <Text fontSize="lg">{swapToken.label.toUpperCase()}</Text>
              </Box>
              <Spacer />
              <Box>
                <Text paddingRight={"0"} fontSize="lg">
                  Balance :{" "}
                  {swapTokenBalance === "" || swapTokenBalance === "0"
                    ? "0"
                    : parseFloat(swapTokenBalance).toFixed(4)}
                </Text>
              </Box>
            </Flex>
            <Flex>
              <InputGroup size="md">
                <Input
                  border="1px"
                  borderColor={colorMode === "dark" ? "white" : textColor}
                  pr="4.5rem"
                  type={"number"}
                  value={NativeTokenValue}
                  onKeyPress={(e) => {
                    parseFloat(NativeTokenValue) >= 99999999.9999
                      ? e.preventDefault()
                      : null;
                  }}
                  max={typeof swapTokenBalance !== "undefined" ? parseFloat(swapTokenBalance).toString() : "0"}
                  min={0}
                  onChange={(e: any) => {
                    setNativeCurrencyValue(e.target.value);
                    setBabyValue(
                      (parseFloat(e.target.value) * presaleRate).toString()
                    );
                  }}
                />
                <InputRightElement width="4.5rem">
                  <Button
                    backgroundColor={"transparent"}
                    color={colorMode === "dark" ? "white" : textColor}
                    h="1.75rem"
                    size="sm"
                    style={{ height: "35px" }}
                    onClick={() => {
                      removeGasFee();
                      setBabyValue(
                        (
                          parseFloat(swapTokenBalance) * swapToken.price
                        ).toString()
                      );
                    }}
                  >
                    Max
                  </Button>
                </InputRightElement>
              </InputGroup>
            </Flex>
          </Box>

          <Flex height="2"></Flex>
          <Box
            color={colorMode === "dark" ? "white" : textColor}
            id="Baby Field"
            p="3"
            height="100px"
            backgroundColor="white"
            bg={colorMode === "dark" ? "black" : bgColor}
            borderRadius="10"
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
                  src={swapToken.babyIcon.src}
                  style={{
                    marginRight: "10px",
                    height: "23px",
                    width: "23px",
                  }}
                  alt="BABY Icon"
                  boxSize="35px"
                  objectFit="cover"
                  display="inline"
                  className={grayscaleMode === "gray" ? "grayscale" : ""}
                />
                <Text fontSize="lg">BABY</Text>
              </Box>
              <Spacer />
              <Box>
                <Text paddingRight="0" fontSize="lg">
                  Balance :{" "}
                  {babyBalance === "" || babyBalance === "0"
                    ? "0"
                    : parseFloat(babyBalance).toFixed(4)}
                </Text>
              </Box>
            </Flex>
            <Flex>
              <InputGroup>
                <InputGroup size="md">
                  <Input
                    border="1px"
                    borderColor={colorMode === "dark" ? "white" : textColor}
                    pr="4.5rem"
                    type={"number"}
                    value={babyValue}
                    min={0}
                    onKeyPress={(e) => {
                      parseFloat(babyValue) >= 99999999.9999
                        ? e.preventDefault()
                        : null;
                    }}
                    max={(typeof presaleRate !== "undefined") ? (presaleRate * parseFloat(swapTokenBalance)) : "0"}
                    onChange={(e: any) => {
                      setBabyValue(parseFloat(e.target.value).toString());
                      setNativeCurrencyValue(
                        (parseFloat(e.target.value) / presaleRate)
                          .toFixed(5)
                          .toString()
                      );
                    }}
                  />
                  {/* <InputRightElement width="4.5rem">
                    <Image
                      className={colorMode === "dark" ? "grayscale" : ""}
                      src={BabyTokenIcon.src}
                      style={{ marginLeft: "20px" }}
                      alt="BABY Icon"
                      boxSize="35px"
                      objectFit="cover"
                      display="inline"
                    ></Image>
                  </InputRightElement> */}
                </InputGroup>
              </InputGroup>
            </Flex>
          </Box>
          <Flex height="3"></Flex>
          <Flex
            direction={"row"}
            justifyContent={""}
            margin={"10px 5px 10px 5px"}
          >
            {toggleSwap === true ? (
              <Box
                color={grayscaleMode === "gray" ? "gray.900" : textTitleColor}
                fontSize="18px"
                display={"flex"}
              >
                <Text>Price</Text>
                <Text fontWeight="bold" mx={2}>
                  {swapToken.label.trim() === "MATIC"
                    ? parseFloat((1 / presaleRate).toFixed(4).toString())
                    : swapToken.label.trim() === "BNB"
                      ? parseFloat((1 / presaleRate).toFixed(8).toString())
                      : swapToken.label.trim() === "FANTOM"
                        ? parseFloat((1 / presaleRate).toFixed(4).toString())
                        : "0"}
                </Text>
                <Text>{swapToken.label.toUpperCase()} per BABY</Text>
                <RepeatIcon
                  marginLeft={"10px"}
                  mt="4px"
                  onClick={swapToggleFunc}
                />
              </Box>
            ) : (
              <>
                <Box
                  color={grayscaleMode === "gray" ? "gray.900" : textTitleColor}
                    fontSize="18px"
                  display={"flex"}
                >
                  <Text>Price</Text>
                  <Text fontWeight="bold" mx={1}>
                    {babyValue
                      ? isNaN(parseFloat(babyValue))
                        ? presaleRate
                        : presaleRate
                      : presaleRate}
                  </Text>
                    <Text>{" "} BABY per {swapToken.label.toUpperCase()}</Text>
                  {/* <Image
                      alt="token"
                      src={swapToken.icon.src}
                      width="24px"
                      height="24px"
                      mx="1px"
                    /> */}
                  </Box>
                  <RepeatIcon
                    marginLeft={"10px"}
                    mt="4px"
                    onClick={swapToggleFunc}
                  />
              </>
            )}
          </Flex>
          <Flex height={["", "", "", "4"]}></Flex>

          <Center mt={2} mb={["", "1", "", "3"]} >
            {account &&
              walletAddress !== "" &&
              chainId !== null &&
              selectedWallet !== "" &&
              (swapTokenAllowrance < web3.utils.toBN(100) ? (
                <Button
                  // focusBorderColor="none"
                  id="approve_button"
                  border="1px"
                  w="55%"
                  h="40px"
                  borderRadius="5"
                  color={colorMode === "dark" ? "gray.100" : "black"}
                  backgroundColor={colorMode === "dark" ? "gray.900" : "white"}
                  fontFamily="Ropa Sans"
                  fontSize={"19px"}
                  fontWeight="150"
                  onClick={Buy}
                  isDisabled={buyBtnDisabled}
                >
                  Buy
                </Button>
              ) : (
                ""
              ))}
            {chainId === null &&
              selectedWallet === "" &&
              (
                <Button
                  // focusBorderColor="none"
                  id="swap_button"
                  border="2px"
                  w="55%"
                  h="40px"
                  borderRadius="5"
                  color={colorMode === "dark" ? "white" : "black"}
                  backgroundColor={colorMode === "dark" ? "black" : "white"}
                  fontFamily="Ropa Sans"
                  fontSize={"19px"}
                  fontWeight="150"
                  onClick={() => {
                    if (account === undefined) {
                      onModalOpen();
                    }
                    // activateBrowserWallet();
                  }}
                >
                  Connect wallet
                </Button>
              )}
          </Center>
        </Box>
      </Box>
      <ConnectWalletModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        // disconnect={disconnect}
        display={{ base: "none", md: "block" }}
      />
    </Flex>
  );
}
