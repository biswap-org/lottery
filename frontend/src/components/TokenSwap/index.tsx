import React, { useState, useEffect } from "react";
import Web3 from "web3";
import {
  Image,
  Center,
  Button,
  Box,
  Spacer,
  Flex,
  Tabs,
  TabPanels,
  TabPanel,
  Text,
  InputGroup,
  InputRightElement,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useColorModeValue,
  useColorMode,
  Wrap,
  VStack,
} from "@chakra-ui/react";

// SettingsIcon,
import BabyTokenIcon from "../../assets/Token-Icons/icon_baby_02_64px.png";
import BnbBabyToken from "../../assets/Token-Icons/Baby-02-BNB_64.png";
import fantomBabyToken from "../../assets/Token-Icons/Baby-02-fantom_64.png";
import polygonBabyToken from "../../assets/Token-Icons/Baby-02-polygon_64.png";
import BUSDTokenIcon from "../../assets/Token-Icons/BUSD_64.png";
import USDTTokenIcon from "../../assets/Token-Icons/USDT_64.png";
import DAITokenIcon from "../../assets/Token-Icons/dai-02_64px.png";
import USDCTokenIcon from "../../assets/Token-Icons/USDC_64.png";
import information from "../../assets/info-01_128px.png";
import caution from "../../assets/warning-02_128px.png";
import Babylonia_Logo from "../../assets/Babylonia_Logo.png";
import { useEthers } from "@usedapp/core";
// import { formatEther } from "@ethersproject/units";
import { useToast } from "@chakra-ui/react";
import { RepeatIcon, ChevronDownIcon } from "@chakra-ui/icons";


// importing ABI
import busdJSON from "../../babies/abis/BUSDToken.json";
import usdtJSON from "../../babies/abis/USDTToken.json";
import usdcJSON from "../../babies/abis/USDCToken.json";
import DAIJSON from "../../babies/abis/DAIToken.json";

import { useAppSelector, useAppDispatch } from "@hooks";
import MethodTwo from "./MethodTwo";
import MethodThree from "./MethodThree";
import CrowdsaleStatus from "@components/CrowdsaleStatus";
import ConnectButton from "../ConnectButton/index";
import { default as chains } from "@config/chains.json";
import { walletActions } from "@store/walletSlice";
import ConnectWalletModal from "@components/ConnectWalletModal";
import { getPresaleContract, getTokenContract } from './helpers'
import { checkAllowanceSwapToken, getSwapTokenBalance, getBABYBalance, getDepositRate } from "./helpers/dataFetcher";
import { ApproveSwapToken, Depositusd } from "./helpers/dataSender";
import Tablist from "./components/TabList";

declare const window: any;

function TokenSwap(props: any) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const { chainId, account } = useEthers();

  const grayscaleMode = useAppSelector((state: any) => state.grayscale.value);

  const textTitleColor = useColorModeValue("gray.800", "gray.100");
  const textColor = useColorModeValue("gray.900", "gray.200");
  const { colorMode, toggleColorMode } = useColorMode();

  const bgColor = useColorModeValue("white", "#1B1F3A");
  const bgBoxColor = useColorModeValue("#E2E2E2", "gray.600");

  const walletAddress = useAppSelector((state: any) => state.wallet.walletAddress);
  const selectedWallet = useAppSelector((state: any) => state.wallet.selectedWallet);

  let web3 = new Web3();
  if (typeof window !== "undefined") {
    web3 = new Web3(window.ethereum)
  }

  const toast = useToast();

  const [tokenValue, setTokenValue] = useState("0");
  const [babyValue, setBabyValue] = useState("0");
  // const { sendTransaction, state } = useSendTransaction();
  const [swapTokenAllowrance, setSwapTokenAllowrance] = useState(
    web3.utils.toBN(0)
  );
  const [babyBalance, setBabyBalance] = useState("0");
  const [swapTokenBalance, setSwapTokenBalance] = useState("0");
  const [presaleRate, setPresaleRate] = useState(web3.utils.toBN(100));
  const [toggleSwap, setToggleSwap] = useState(false);


  const dispatch = useAppDispatch();

  const [swapToken, setSwapToken] = useState({
    icon: USDCTokenIcon,
    label: "USDC",
    abi: usdcJSON as any,
    babyIcon: BnbBabyToken,
  });
  const setNative = () => {
    if (chainId === 56) {
      setSwapToken({
        icon: BUSDTokenIcon,
        label: "BUSD",
        abi: busdJSON as any,
        babyIcon: BnbBabyToken,
      });
    }
    else if (chainId === 250) {
      setSwapToken({
        icon: DAITokenIcon,
        label: "DAI",
        abi: DAIJSON as any,
        babyIcon: fantomBabyToken,
      });      
    }
    else if (chainId === 137) {
      setSwapToken({
        icon: USDTTokenIcon,
        label: "USDT",
        abi: usdtJSON as any,
        babyIcon: polygonBabyToken,
      });
    } else {
      setSwapToken({
        icon: USDCTokenIcon,
        label: "USDC",
        abi: usdcJSON as any,
        babyIcon: BnbBabyToken,
      });
    }
  };

  const tokenContract = getTokenContract(chainId, web3);

  const presaleContract = getPresaleContract(chainId, web3);



  useEffect(() => {
    if (selectedWallet === "MetaMask" || selectedWallet === "TrustWallet") {
      // if (account !== undefined || walletAddress !== undefined) {
      const chain = chains.find((c: any) => c.chainId === chainId);
      setSelectedNetwork(String(chain && chain.chain), Number(chainId));
      if (chainId !== null) {
        setNative();
        getRates();
        loadUserDetail();
      } else {
        setBabyBalance("0");
        setSwapTokenBalance("0");
      }
      // }
    } else
      if (selectedWallet === "Solana") {
        if (solana.network === "solana") {
        }
      }
  }, [selectedWallet]);


  useEffect(() => {
    if (account !== undefined || walletAddress !== undefined) {
      const chain = chains.find((c: any) => c.chainId === chainId);
      setSelectedNetwork(String(chain && chain.chain), Number(chainId));
      if (chainId !== null) {
        setNative();
        getRates();
        loadUserDetail();
      } else {
        setBabyBalance("0");
        setSwapTokenBalance("0");
      }
      // }
    }
  }, [chainId]);

  useEffect(() => {
    if (account !== undefined || walletAddress !== undefined) {
      const chain = chains.find((c: any) => c.chainId === chainId);
      setSelectedNetwork(String(chain && chain.chain), Number(chainId));
      if (chainId !== null) {
        setTokenValue("0");
        getRates();
        loadUserDetail();
      } else {
        setBabyBalance("0");
        setSwapTokenBalance("0");
      }
      // }
    }
  }, [swapToken]);


  const getRates = async () => {
    if ((selectedWallet !== "") && (walletAddress !== "")) {
      const swaptokenbalance = await getSwapTokenBalance(account ? account : "", swapToken, chainId);
      setSwapTokenBalance(swaptokenbalance + "");
      const babybalance = await getBABYBalance(account ? account : "", tokenContract, web3);
      const depositRate = await getDepositRate(account ? account : "", presaleContract, web3);
      setBabyBalance(web3.utils.fromWei(babybalance));
      setPresaleRate(depositRate);
    }
  };

  const computeGasFee = () => {
    if (parseFloat(swapTokenBalance) < 0.001000300031805317) {
      setSwapTokenBalance("0");
      toast({
        title: "Not enough funds ",
        description: "Top up your wallet first.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return false;
    } else {
      // setTokenValue(swapTokenBalance);
    }
  };


  const loadUserDetail = async () => {
    const tokenAllowrance = await checkAllowanceSwapToken(account, web3, presaleContract.address, swapToken, chainId);
    setSwapTokenAllowrance(tokenAllowrance);
  };

  const approveTokens = async () => {
    await ApproveSwapToken(account, presaleContract.address, web3, swapToken, chainId).then((o: any) => {
      loadUserDetail();
      toast({
        title: "Successfully approved.",
        description: "You can buy BABY Token now.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top-right",
      });
    });
  };

  const Buy = async () => {
    let amount: any = (`${tokenValue}`);
    let walletAddress = account;
    if (amount > Number(swapTokenBalance)) {
      toast({
        title: "Not sufficient funds.",
        description: "Top up your wallet first.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    let symbol = swapToken.label.toUpperCase();

    // DEV : waleed-shafiq, Fix Remarks below. 2nd Task.
    // the issue was not in MAX function but here.
    // before on condition chainId == 137 had web3.utils.toWei(amount) which pick by defualt 18 decimals
    // but on polygon both usdt and usdc have 6 decimals which is Mwei

    let amountToSend = web3.utils.toWei(amount, "ether");

    if (chainId == 137) amountToSend = web3.utils.toWei(amount, "Mwei");
    if (chainId == 250) {
      if (symbol === "USDC") amountToSend = web3.utils.toWei(amount, "Mwei");
    }
    const result = await Depositusd(walletAddress, amountToSend, swapToken, chainId, web3, presaleContract);
    if (result) {
      toast({
        title: "Thanks for purchasing.",
        status: "success",
        duration: 9000,
        isClosable: true,
        position: "top-right",
      });
    }
    getRates();
    return;
  };

  const setSelectedNetwork = (network: string, chainId: number) => {
    dispatch(walletActions.setTokenList([]));
    dispatch(walletActions.setSelectedNetwork(network));
  }

  const swapToggleFunc = async () => {
    setToggleSwap(!toggleSwap);
  };

  const solana = useAppSelector((state: any) => state.solana);
  
  return (
    <>
      <Tabs
        className={grayscaleMode === "gray" ? "grayscale" : ""}
        variant='unstyled'
        colorScheme="green"
        // {...props}
        m="0px"
        pt={["25vh", "65px", "15vh", "15vh"]}
        pb={["49vh", "15px", "10vh", "2vh"]}
        alignItems="center"
        w={["100vw", "100vw", "65%", "91%"]}
        fontFamily={"Ropa sans"}
      >
        <Box display={["block", "block", "none", "none"]}>
          <Flex justifyContent={'center'} mb={4}>
            <ConnectButton
              mt="15px"
            />
          </Flex>
        </Box>
        <Tablist />

        <TabPanels w={["100%", "100%", "100%", "100%"]}>
          {/* #1  */}
          <TabPanel>
            <Flex
              display={["grid", "grid", "grid", "flex"]}
              gap={4}
              justifyContent={"center"}
            >
              <Box
                display={["none", "none", "block", "block"]}
                w={["340px", "340px", "340px", "340px"]}
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
                <CrowdsaleStatus />
              </Box>
              <Box
                w={["90vw", "90vw", "340px", "340px"]}
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
                  borderColor={
                    colorMode === "dark" ? "black" : "textTitleColor"
                  }
                  bg={colorMode === "dark" ? "#5C5C5C" : bgBoxColor}
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
                        height={"45px"}
                      />
                      <Text fontSize={["20px", "20px", "24px", "24px"]}>METHOD #1</Text>
                    </Box>

                    <Box ml={"65px"} mt={"30px"}>
                      <Flex gap={5}>
                        <Image
                          src={caution.src}
                          className={
                            grayscaleMode === "gray" ? "grayscale" : ""
                          }
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
                          className={
                            grayscaleMode === "gray" ? "grayscale" : ""
                          }
                          sx={{
                            cursor: "pointer",
                          }}
                          onClick={() =>
                            window.open(
                              "https://github.com/babyloniaapp/docs/blob/main/guidelines/crowdsale1M1-guide-02.md"
                            )
                          }
                          alt="information"
                          width={"40px"}
                          height={"40px"}
                        />
                      </Flex>
                    </Box>
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
                          alt="BABY Icon"
                          boxSize="35px"
                          objectFit="cover"
                          display="inline"
                          className={
                            grayscaleMode === "gray" ? "grayscale" : ""
                          }
                        />
                        <Text fontSize="lg">
                          {swapToken.label.toUpperCase()}
                          <ChevronDownIcon />
                        </Text>
                      </Box>
                      <Spacer />
                      <Box>
                        <Text paddingRight={"0"} fontSize="lg">
                          Balance :{" "}
                          {swapTokenBalance === ""
                            ? "0"
                            : parseFloat(swapTokenBalance).toFixed(4)}
                        </Text>
                      </Box>
                    </Flex>
                    <Flex>
                      <InputGroup size="md">
                        <Input
                          border="1px"
                          borderColor={
                            colorMode === "dark" ? "white" : textColor
                          }
                          pr="4.5rem"
                          type={"number"}
                          value={tokenValue}
                          max={typeof swapTokenBalance !== "undefined" ? parseFloat(swapTokenBalance) : "0"}
                          onKeyPress={(e) => {
                            parseFloat(tokenValue) >= 99999999.9999
                              ? e.preventDefault()
                              : null;
                          }}
                          min={0}
                          onChange={(e: any) => {
                            setTokenValue(e.target.value);
                            setBabyValue(
                              (
                                parseFloat(e.target.value) * parseFloat(presaleRate.toString())
                              ).toString()
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
                              if (Number(swapTokenBalance) > 0.001)
                                setTokenValue((Number(swapTokenBalance)).toString());
                              computeGasFee();
                              // console.log("88888888888 ", (swapTokenBalance), ",", presaleRate.toString())
                              setBabyValue(
                                (
                                  parseFloat(swapTokenBalance) * parseFloat(presaleRate.toString())
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
                          className={
                            grayscaleMode === "gray" ? "grayscale" : ""
                          }
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
                            borderColor={
                              colorMode === "dark" ? "white" : textColor
                            }
                            pr="4.5rem"
                            type={"number"}
                            value={babyValue}
                            min={0}
                            onKeyPress={(e) => {
                              parseFloat(babyValue) >= 99999999.9999
                                ? e.preventDefault()
                                : null;
                            }}
                            max={
                              (
                                typeof presaleRate != "undefined" &&
                                typeof swapTokenBalance !== "undefined" &&
                                !isNaN(parseFloat(presaleRate.toString()))
                              )
                                ? (parseFloat(presaleRate.toString()) * parseFloat(swapTokenBalance))
                                : "0" + ", " + swapTokenBalance
                            }
                            onChange={(e: any) => {
                              setBabyValue(
                                parseFloat(e.target.value).toString()
                              );
                              setTokenValue(
                                (parseFloat(e.target.value) / parseFloat(presaleRate.toString()))
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
                  <Flex height="2"></Flex>
                  <Flex
                    direction={"row"}
                    justifyContent={"space-between"}
                    margin={"10px 5px 10px 5px"}
                  >
                    {toggleSwap === true ? (
                      <Box
                        color={
                          grayscaleMode === "gray" ? "gray.100" : textTitleColor
                        }
                        fontSize="17px"
                        display={"flex"}
                      >
                        Price{" "}
                        {tokenValue
                          ? isNaN(parseFloat("0.01"))
                            ? "1"
                            : parseFloat("0.01").toFixed(2)
                          : " 0.01"}{" "}
                        {"  "}
                        {swapToken.label.toUpperCase()} per BABY
                        <RepeatIcon
                          marginLeft={"10px"}
                          mt="4px"
                          onClick={swapToggleFunc}
                        />
                      </Box>
                    ) : (
                      <>
                        <Box
                          color={
                            grayscaleMode === "gray"
                              ? "gray.100"
                              : textTitleColor
                          }
                          fontSize="17px"
                          display={"flex"}
                        >
                          Price{" "}
                          {babyValue
                            ? isNaN(parseFloat("100"))
                              ? "100"
                              : parseFloat("100").toFixed(2)
                            : " 100"}{" "}
                          {"  "}
                          BABY per {" "}
                          {swapToken.label.toUpperCase()}
                          <RepeatIcon
                            marginLeft={"10px"}
                            mt="4px"
                            onClick={swapToggleFunc}
                          />
                        </Box>
                      </>
                    )}
                  </Flex>
                  <Center>
                    {chainId !== null &&
                      account &&
                      selectedWallet !== "" &&
                      (swapTokenAllowrance < web3.utils.toBN(100) ?
                        (
                          <Button
                            id="approve_button"
                            border="1px"
                            w="55%"
                            h="40px"
                            mt={["", "", "25px", "25px"]}
                            mb={["", "", "25px", "16px"]}
                            borderRadius="5"
                            color={colorMode === "dark" ? "gray.400" : "black"}
                            backgroundColor={
                              colorMode === "dark" ? "gray.800" : "white"
                            }
                            fontFamily="Ropa Sans"
                            fontSize={"19px"}
                            fontWeight="150"
                            onClick={
                              () => {
                                // toast({
                                //   title: "METHOD 1",
                                //   description: "Method 1 is not available at the moment, try method 2",
                                //   status: "info",
                                //   duration: 9000,
                                //   isClosable: true,
                                // });
                                approveTokens();
                              }
                            }
                          >
                            Approve
                          </Button>

                        ) : (
                          <Button
                            id="approve_button"
                            border="1px"
                            w="55%"
                            h="40px"
                            mt={"25px"}
                            mb={"16px"}
                            borderRadius="5"
                            color={colorMode === "dark" ? "gray.400" : "black"}
                            backgroundColor={
                              colorMode === "dark" ? "gray.800" : "white"
                            }
                            fontFamily="Ropa Sans"
                            fontSize={"19px"}
                            fontWeight="150"
                            onClick={Buy}
                          >
                            Buy
                          </Button>
                        ))}
                    {!account && (
                      <Button
                        id="swap_button"
                        border="2px"
                        w="55%"
                        h="40px"
                        borderRadius="5"
                        color={colorMode === "dark" ? "white" : "black"}
                        backgroundColor={
                          colorMode === "dark" ? "black" : "white"
                        }
                        mt={"25px"}
                        mb={"16px"}
                        fontFamily="Ropa Sans"
                        fontSize={"19px"}
                        fontWeight="150"
                        onClick={onModalOpen}
                      >
                        Connect wallet
                      </Button>
                    )}
                  </Center>
                </Box>
              </Box>
            </Flex>
          </TabPanel>
          {/* #2  */}

          <TabPanel>

            <Box
              bg={"bgColor"}
              display={["flex", "flex", "flex", "flex"]}
              justifyContent={"center"}
            // alignItems="center"
            >
              <Wrap
              // sx={{ display: "flex !important", justifyContent: "center" }}
              // justify={"center"}
              // spacing={["19px", "19px", "19px", "9px"]}
              >
                <VStack
                // sx={{
                //   display: "flex !important",
                //   justifyContent: "center !important",
                // }}
                >
                  <Box
                    display={["none", "none", "block", "block"]}
                    w={["85vw", "85vw", "340px", "340px"]}
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
                    <CrowdsaleStatus />
                  </Box>
                </VStack>
                <VStack>
                  <MethodTwo />
                </VStack>
                <VStack>
                  <MethodThree />
                </VStack>
              </Wrap>
            </Box>

          </TabPanel>
        </TabPanels>
      </Tabs>

      <Modal onClose={onClose} size={"sm"} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent borderRadius={"12px"} maxWidth="230px" border="1px">
          <Box
            bg={colorMode === "dark" ? "#5C5C5C" : "gray"}
            py={4}
            borderRadius="10px"
            m={2}
            border="1px"
            maxW={"250px"}
          >
            <ModalHeader
              fontFamily={"Ropa sans"}
              color={colorMode === "light" ? "black" : "white"}
              fontSize="2xl"
              fontWeight=""
            >
              Select a token
            </ModalHeader>
            <ModalCloseButton
              mt={2}
              mr={2}
              bg="white"
              color={colorMode === "light" ? "black" : "white"}
              backgroundColor={colorMode === "light" ? "white" : "black"}
            />
            <ModalBody margin={"0px"} paddingRight="15px">
              {chainId === 56 && (
                <Box
                  cursor={"pointer"}
                  display={"flex"}
                  padding={"10px"}
                  borderRadius="5px"
                  marginY={"7px"}
                  color={colorMode === "light" ? "black" : "white"}
                  fontWeight={"500"}
                  backgroundColor={colorMode === "light" ? "white" : "black"}
                  onClick={() => {
                    setSwapToken({
                      icon: BUSDTokenIcon,
                      label: "BUSD",
                      abi: busdJSON,
                      babyIcon: BnbBabyToken,
                    });
                    onClose();
                  }}
                >
                  <Image
                    src={BUSDTokenIcon.src}
                    style={{
                      marginRight: "10px",
                      height: "25px",
                      width: "25px",
                    }}
                    alt="BABY Icon"
                    boxSize="35px"
                    objectFit="cover"
                    className={grayscaleMode === "gray" ? "grayscale" : ""}
                    display="inline"
                  />
                  <label style={{ cursor: "pointer", backgroundColor: colorMode === "light" ? "white" : "black" }}>BUSD</label>
                </Box>
              )}
              {chainId === 250 ? (
                <Box
                  cursor={"pointer"}
                  borderRadius="5px"
                  display={"flex"}
                  padding={"10px"}
                  marginY={"7px"}
                  fontWeight={"500"}
                  backgroundColor={colorMode === "light" ? "white" : "black"}
                  onClick={() => {
                    setSwapToken({
                      icon: DAITokenIcon,
                      label: "DAI",
                      abi: DAIJSON,
                      babyIcon: fantomBabyToken,
                    });
                    onClose();
                  }}
                  color={colorMode === "light" ? "black" : "white"}
                >
                  <Image
                    src={DAITokenIcon.src}
                    style={{
                      marginRight: "10px",
                      height: "25px",
                      width: "25px",
                    }}
                    alt="BABY Icon"
                    boxSize="35px"
                    className={grayscaleMode === "gray" ? "grayscale" : ""}
                    objectFit="cover"
                    display="inline"
                  />
                  <label style={{ cursor: "pointer", backgroundColor: colorMode === "light" ? "white" : "black" }}>DAI</label>
                </Box>
              ) : (
                <Box
                  cursor={"pointer"}
                  borderRadius="5px"
                  display={"flex"}
                  padding={"10px"}
                  marginY={"7px"}
                  fontWeight={"500"}
                  backgroundColor={colorMode === "light" ? "white" : "black"}
                  onClick={() => {
                    setSwapToken({
                      icon: USDTTokenIcon,
                      label: "USDT",
                      abi: usdtJSON,
                      babyIcon: polygonBabyToken,
                    });
                    onClose();
                  }}
                  color={colorMode === "light" ? "black" : "white"}
                >
                  <Image
                    src={USDTTokenIcon.src}
                    style={{
                      marginRight: "10px",
                      height: "25px",
                      width: "25px",
                    }}
                    alt="BABY Icon"
                    boxSize="35px"
                    className={grayscaleMode === "gray" ? "grayscale" : ""}
                    objectFit="cover"
                    display="inline"
                  />
                  <label style={{ cursor: "pointer", backgroundColor: colorMode === "light" ? "white" : "black" }}>USDT</label>
                </Box>
              )}
              <Box
                cursor={"pointer"}
                color={colorMode === "light" ? "black" : "white"}
                display={"flex"}
                borderRadius="5px"
                padding={"10px"}
                marginY={"7px"}
                fontWeight={"500"}
                backgroundColor={colorMode === "light" ? "white" : "black"}
                onClick={() => {
                  setSwapToken({
                    icon: USDCTokenIcon,
                    label: "USDC",
                    abi: usdcJSON,
                    babyIcon: BnbBabyToken,
                  });
                  onClose();
                }}
              >
                <Image
                  src={USDCTokenIcon.src}
                  style={{ marginRight: "10px", height: "25px", width: "25px" }}
                  alt="BABY Icon"
                  boxSize="35px"
                  className={grayscaleMode === "gray" ? "grayscale" : ""}
                  objectFit="cover"
                  display="inline"
                />
                <label style={{ cursor: "pointer", backgroundColor: colorMode === "light" ? "white" : "black" }}>USDC</label>
              </Box>
            </ModalBody>
          </Box>
        </ModalContent>
      </Modal>
      <ConnectWalletModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        // disconnect={disconnect}
        display={{ base: "none", md: "block" }}
      />
    </>
  );
}

export default TokenSwap;
