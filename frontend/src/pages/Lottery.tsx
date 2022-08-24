import React, { useState, useEffect } from "react";
import { Divider } from '@chakra-ui/react'
import Header from "../components/Header/index";
import Footer from "../components/Header/index";
import Web3 from "web3";
import ConnectWalletModal from "@components/ConnectWalletModal";

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
import Menu from "../components/Menu/index";
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

import config from "../config/index";

import presaleContractJSON from "../babies/abis/Presale.json";
import tokenJSON from "../babies/abis/BABYToken.json";
import busdJSON from "../babies/abis/BUSDToken.json";
import usdtJSON from "../babies/abis/USDTToken.json";
import { useAppSelector, useAppDispatch } from "@hooks";

declare const window: any;

 const Lottery = () => {

  // const dispatch = useAppDispatch();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const grayscaleMode = useAppSelector((state: any) => state.grayscale.value);

  const textTitleColor = useColorModeValue("black", "gray.100");
  const textColor = useColorModeValue("black", "gray.200");
  const { colorMode, toggleColorMode } = useColorMode();
  const [lotteryCard, setLotteryCard] = useState(false)
  const bgColor = useColorModeValue("gray.300", "gray.700");

  const bgBoxColor = useColorModeValue("#E2E2E2", "FFFFFF");
  const buttonColor = useColorModeValue("#F58634", "#0E1555");
  const buttonTxtColor = useColorModeValue("gray.900", "gray.200");
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();
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

  return (
    <Container maxW="100vw" bg="black.900" pt="7vh" pb="3" pl="0" pr="0">
      <Box>
        <Header />
        <Box h="90vh" className={
          grayscaleMode === "gray" ? "grayscale" : ""
        } mt={8} backgroundColor={bgColor}>
          <Flex
            maxW="100vw"
            align="center"
            bg={bgColor}
            m="0px"
            justifyContent="center"
            alignItems="center"
            height="100vh"
          // pb={["5vh", "12vh", "12vh", "10vh"]}
          >
            <Box flex="100vw" bg={bgColor}>
              <VStack>
                <Flex
                  pt={["5vh", "10vh", "10vh", "18vh"]}
                  pb={["5vh", "12vh", "12vh", "15vh"]}
                  w={["80vw", "97vw", "50vw", "40vw"]}
                  justifyContent="center"

                  background="black.900"
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
                      {lotteryCard ? <>
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

                        <Center>
                          <Text fontSize="3xl" mb='4' >Buy Ticket</Text>
                        </Center>
                        <Flex height="1"></Flex>

                        <Box
                          color={colorMode === "dark" ? "gray.100" : textColor}
                          id="BNB Field"
                          p="3"
                          // height="100px"
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
                              <Text fontSize="lg">
                                Buy:
                              </Text>
                            </Box>
                            <Spacer />
                            <Box>
                              <Text fontWeight='bold' p={2} fontSize="lg">
                                Tickets
                              </Text>
                            </Box>
                          </Flex>
                          <Flex flexDir='column'>
                            <Box borderRadius="10" backgroundColor='#EDF2F7' padding={`3`} border='1px'
                              borderColor={
                                colorMode === "dark" ? "white" : textColor
                              } w="100%">
                              <Input
                                variant='unstyled'
                                pr="4.5rem"
                                type={"number"}
                                max={parseFloat(swapTokenBalance)}
                                placeholder="0"
                                fontSize='2xl'
                                min={0}
                              />
                              <Flex justifyContent='right' mt='2'>
                                <Text >~0.00 CAKE</Text>
                              </Flex>
                            </Box>
                            <Flex justifyContent={"right"} flexDir='column' alignItems='flex-end'>
                              <Text fontSize='sm' color='tomato' mt="0px" >
                                Insufficient CAKE balance
                              </Text>
                              <Text fontSize='sm' mt="0px" >
                                CAKE Balance: 0.000
                              </Text>
                            </Flex>
                            <Flex>
                              <Box p='4' >
                                Cost (CAKE)
                              </Box>
                              <Spacer />
                              <Box p='4' >
                                0 CAKE
                              </Box>
                            </Flex>
                            <Flex>
                              <Box p='4' style={{ display: 'flex' }} >
                                <Text fontWeight={`bold`}> 0% </Text>-Bulk discount
                              </Box>
                              <Spacer />
                              <Box p='4' >
                                ~0  CAKE
                              </Box>
                            </Flex>
                            <Divider />
                            <Flex>
                              <Box p='4' >
                                You pay
                              </Box>
                              <Spacer />
                              <Box p='4' fontWeight={`bold`} >
                                ~0 CAKE
                              </Box>
                            </Flex>
                          </Flex>
                        </Box>
                        {/* <Box>
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
                        </Box> */}
                        {/* <Box
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
                        </Box> */}
                        <Flex height="6"></Flex>
                        {account ? <Center my='10'>

                          <Button
                            // focusBorderColor="none"
                            id="swap_button"
                            border="1px"
                            w="55%"
                            h="40px"
                            mt='-25px'
                            borderRadius="5"
                            color={colorMode === "dark" ? "white" : "black"}
                            backgroundColor={
                              colorMode === "dark" ? "black" : "white"
                            }
                            fontFamily="Ropa Sans"
                            fontSize={"19px"}
                            fontWeight="150"

                          >
                            Enable
                          </Button>

                        </Center> :
                          <Center my='10'>

                            <Button
                              // focusBorderColor="none"
                              id="swap_button"
                              border="1px"
                              w="55%"
                              h="40px"
                              mt='-25px'
                              borderRadius="5"
                              color={colorMode === "dark" ? "white" : "black"}
                              backgroundColor={
                                colorMode === "dark" ? "black" : "white"
                              }
                              fontFamily="Ropa Sans"
                              fontSize={"19px"}
                              fontWeight="150"
                              onClick={() => {
                                onModalOpen();
                              }}
                            >
                              Connect wallet
                            </Button>
                            <ConnectWalletModal
                              isOpen={isModalOpen}
                              onClose={onModalClose}
                              display={{ base: "none", md: "block" }}
                            />
                          </Center>
                        }
                        <Flex justifyContent={"center"}>
                          <Center fontSize='sm' mt="-10px" >
                            Buy Instantly, chooses random numbers, with no duplicates among your tickets. Prices are set before each round starts, equal to $5 at that time. Purchases are final.
                          </Center>
                        </Flex>
                      </>
                        :
                        <Center my='10'>

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
                            onClick={() => {
                              setLotteryCard(true);
                            }}
                          >
                            Buy Ticket
                          </Button>
                          <ConnectWalletModal
                            isOpen={isModalOpen}
                            onClose={onModalClose}
                            display={{ base: "none", md: "block" }}
                          />
                        </Center>
                      }
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

export default Lottery;