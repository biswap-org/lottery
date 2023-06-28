import React, { useState, useEffect } from "react";
import { Collapse, Divider, Grid, GridItem, Heading } from '@chakra-ui/react'
import Header from "../components/Header/index";
import Footer from "../components/Header/index";
import Web3 from "web3";
import ConnectWalletModal from "@components/ConnectWalletModal";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
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
  const [show, setShow] = React.useState(false)

  const handleToggle = () => setShow(!show)
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
    <>
      <Container maxW="100vw" bg="black.900" pl="0" pr="0">
        <Box>
          <Header />
          <Box className={
            grayscaleMode === "gray" ? "grayscale" : ""
          } backgroundColor={bgColor}>
            <Flex
              maxW="100vw"
              align="center"
              bg={bgColor}
              m="0px"
              justifyContent="center"
              alignItems="center"

            // pb={["5vh", "12vh", "12vh", "10vh"]}
            >
              <Box flex="100vw" bg={bgColor}>
                <VStack>
                  <Flex
                    pt={["5vh", "10vh", "10vh", "18vh"]}
                    pb={["5vh", "12vh", "12vh", "15vh"]}
                    w={["80vw", "97vw", "50vw", "40vw"]}
                    justifyContent="center"
                    // mt={lotteryCard ? '250px' : '-10px'}
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
                                  <Text >~0.00 BABY</Text>
                                </Flex>
                              </Box>
                              <Flex justifyContent={"right"} flexDir='column' alignItems='flex-end'>
                                <Text fontSize='sm' color='tomato' mt="0px" >
                                  Insufficient BABY balance
                                </Text>
                                <Text fontSize='sm' mt="0px" >
                                  BABY Balance: 0.000
                                </Text>
                              </Flex>
                              <Flex mt={`2`}>
                                <Box w={`47%`} borderRadius="10" backgroundColor='#EDF2F7' padding={`1`}  >
                                  <Center>Max</Center>
                                </Box>
                                <Spacer />
                                <Box w={`47%`} borderRadius="10" backgroundColor='#EDF2F7' padding={`1`}  >
                                  <Center>0</Center>
                                </Box>
                              </Flex>
                              <Flex>
                                <Box p='4' >
                                  Cost (BABY)
                                </Box>
                                <Spacer />
                                <Box p='4' >
                                  0 BABY
                                </Box>
                              </Flex>
                              <Flex>
                                <Box p='4' style={{ display: 'flex' }} >
                                  <Text fontWeight={`bold`}> 0% </Text>-Bulk discount
                                </Box>
                                <Spacer />
                                <Box p='4' >
                                  ~0  BABY
                                </Box>
                              </Flex>
                              <Divider />
                              <Flex>
                                <Box p='4' >
                                  You pay
                                </Box>
                                <Spacer />
                                <Box p='4' fontWeight={`bold`} >
                                  ~0 BABY
                                </Box>
                              </Flex>
                            </Flex>
                          </Box>
                          <Flex height="6"></Flex>
                          {account ? <Center my='10'>

                            <Button
                              // focusBorderColor="none"
                              id="swap_button"
                              border="1px"
                              w="80%"
                              h="40px"
                              py={6}
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
                                w="80%"
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
                          <Center my='10'>

                            <Button
                              // focusBorderColor="none"
                              id="swap_button"
                              border="1px"
                              w="80%"
                              h="40px"
                              py={6}
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
                              Buy Instantly
                            </Button>

                          </Center>
                          <Center my='10'>

                            <Button
                              // focusBorderColor="none"
                              id="swap_button"
                              border="1px"
                              w="80%"
                              h="40px"
                              py={6}
                              // disabled
                              variant='outline'
                              mt='-25px'
                              borderRadius="5"
                              colorScheme={colorMode === "dark" ? "white" : "black"}
                              color={colorMode === "dark" ? "white" : "black"}
                              onClick={onOpen}
                              fontFamily="Ropa Sans"
                              fontSize={"19px"}
                              fontWeight="150"

                            >
                              View/Edit Number
                            </Button>

                          </Center>
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
      <Container maxW="100vw" fontFamily="Ropa Sans" bg="black.900" pb="3" pl="0" pr="0">

        <Box>

          <Header />
          <Box fontFamily="Ropa Sans" className={
            grayscaleMode === "gray " ? "grayscale" : ""
          } backgroundColor={bgColor}>
            <Center display={`flex`} pt={20} flexDir={`column`}>
              <Heading fontFamily="Ropa Sans" as='h1' size='xl' noOfLines={1}>
                Get your tickets now!
              </Heading>
              <Text mt={3} as='h1' fontWeight={`bold`} fontSize={`2xl`} size='3xl' noOfLines={1}>
                5h 7m until the draw
              </Text>
            </Center>
            <Flex
              maxW="100vw"
              align="center"
              bg={bgColor}
              m="0px"
              justifyContent="center"
              alignItems="center"

            // pb={["5vh", "12vh", "12vh", "10vh"]}
            >
              <Box flex="100vw" bg={bgColor}>
                <VStack>
                  <Flex
                    pt={["5vh", "10vh", "10vh", "10vh"]}
                    pb={["5vh", "12vh", "12vh", "15vh"]}
                    w={["80vw", "97vw", "50vw", "50vw"]}
                    justifyContent="center"
                    mt={lotteryCard ? '250px' : '-10px'}
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
                        <>
                          <Flex>
                            <Box
                              color={
                                colorMode === "dark" ? "gray.100" : textTitleColor
                              }
                              fontSize="18px"
                            >
                            </Box>
                            <Spacer />
                          </Flex>

                          <Flex justifyContent={`space-between`}>
                            <Text fontSize="3xl" mb='4' >Next Draw</Text>
                            <Text fontSize="2xl" mb='4' >#655 | Draw: Sep 13, 2022, 5:00 AM</Text>
                          </Flex>
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
                            <Grid
                              mt={4}
                              
                              // h='200px'
                              templateRows='repeat(2, 1fr)'
                              templateColumns='repeat(5, 1fr)'
                              gap={4}
                            >
                              <GridItem colSpan={1} ><Text fontSize='2xl'>Prize Pot</Text>

                              </GridItem>
                              <GridItem colSpan={4} > <Text fontWeight={`bold`} fontSize='3xl'>
                                ~$92,151</Text>
                                <Text>20,795 BABY</Text></GridItem>
                              <GridItem colSpan={1} ><Text fontSize='2xl'>Prize Pot</Text></GridItem>
                              <GridItem colSpan={2} ><Text>You have
                                0
                                ticket this round</Text></GridItem>
                              <GridItem colSpan={2}  >
                                <Button
                                  // focusBorderColor="none"
                                  id="swap_button"
                                  border="1px"
                                  py={6}
                                  borderRadius="5"
                                  color={colorMode === "dark" ? "white" : "black"}
                                  backgroundColor={
                                    colorMode === "dark" ? "black" : "white"
                                  }
                                  fontFamily="Ropa Sans"
                                  fontSize={"19px"}
                                  fontWeight="150"

                                >
                                  Buy Instantly
                                </Button></GridItem>
                            </Grid>
                            <Box>
                              <Collapse in={show}>
                                <Text>Match the winning number in the same order to share prize. Current prizes up for grabs:</Text>
                                <Grid
                                  mt={8}
                                  
                                  // h='200px'
                                  templateColumns='repeat(4, 1fr)'
                                  gap={4}
                                >
                                  <GridItem colSpan={1} >
                                    <Text fontWeight={`bold`} fontSize=''>Match first 1</Text>
                                    <Text fontWeight={`bold`} fontSize='xl'>416 BABY</Text>
                                    <Text>~$1,845</Text>
                                  </GridItem>
                                  <GridItem colSpan={1} >
                                    <Text fontWeight={`bold`} fontSize=''>Match first 2</Text>
                                    <Text fontWeight={`bold`} fontSize='xl'>416 BABY</Text>
                                    <Text>~$1,845</Text>
                                  </GridItem>
                                  <GridItem colSpan={1} >
                                    <Text fontWeight={`bold`} fontSize=''>Match first 3</Text>
                                    <Text fontWeight={`bold`} fontSize='xl'>416 BABY</Text>
                                    <Text>~$1,845</Text>
                                  </GridItem>
                                  <GridItem colSpan={1} >
                                    <Text fontWeight={`bold`} fontSize=''>Match first 4</Text>
                                    <Text fontWeight={`bold`} fontSize='xl'>416 BABY</Text>
                                    <Text>~$1,845</Text>
                                  </GridItem>
                                  <GridItem colSpan={1} >
                                    <Text fontWeight={`bold`} fontSize=''>Match first 5</Text>
                                    <Text fontWeight={`bold`} fontSize='xl'>416 BABY</Text>
                                    <Text>~$1,845</Text>
                                  </GridItem>
                                  <GridItem colSpan={1} >
                                    <Text fontWeight={`bold`} fontSize=''>Match all 6</Text>
                                    <Text fontWeight={`bold`} fontSize='xl'>416 BABY</Text>
                                    <Text>~$1,845</Text>
                                  </GridItem>
                                  <GridItem colSpan={1} >
                                    <Text fontWeight={`bold`} color='tomato' fontSize=''>Burn</Text>
                                    <Text fontWeight={`bold`} fontSize='xl'>416 BABY</Text>
                                    <Text>~$1,845</Text>
                                  </GridItem>
                                </Grid>
                              </Collapse>
                              <Divider mt={5} />
                              <Center>
                                <Button w={100} _hover={{ background: 'transparent' }} background={`transparent`} size='sm' onClick={handleToggle} mt='1rem'>
                                   {show ? 'Hide 🔼' : 'Details 🔽'} 
                                </Button>
                              </Center>

                            </Box>
                          </Box>

                        </>
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
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent mt={`130`} borderRadius="10px">
          <Flex>
            <ModalCloseButton />

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
                    </Box>
                    <Spacer />
                  </Flex>

                  <Center>
                    <Text fontSize="3xl" mb='4' >Edit Number</Text>

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
                          Total Cost:
                        </Text>
                      </Box>
                      <Spacer />
                      <Box>
                        <Text fontWeight='bold' fontSize="lg">
                          1.18 BABY
                        </Text>
                      </Box>
                    </Flex>
                    <Flex my={5} justifyContent={"center"}>
                      <Center fontSize='sm' mt="-10px" >
                        Buy Instantly, chooses random numbers, with no duplicates among your tickets. Prices are set before each round starts, equal to $5 at that time. Purchases are final.
                      </Center>
                    </Flex>
                    <Center my='10'>

                      <Button
                        // focusBorderColor="none"
                        id="swap_button"
                        border="1px"
                        w="80%"
                        h="40px"
                        py={6}
                        // disabled
                        variant='outline'
                        mt='-25px'
                        borderRadius="5"
                        colorScheme={colorMode === "dark" ? "white" : "black"}
                        color={colorMode === "dark" ? "white" : "black"}
                        onClick={onOpen}
                        fontFamily="Ropa Sans"
                        fontSize={"19px"}
                        fontWeight="150"

                      >
                        View/Edit Number
                      </Button>

                    </Center>
                    <Flex flexDir='column'>
                      <Flex justifyContent={"right"} flexDir='column' alignItems='flex-start'>

                        <Text fontSize='' mt="0px" >
                          #0.000
                        </Text>
                      </Flex>
                      <Flex justifyContent={`space-around`} borderRadius="10" backgroundColor='#EDF2F7' padding={`3`} border='1px'
                        borderColor={
                          colorMode === "dark" ? "white" : textColor
                        } w="100%">
                        <Text fontWeight={`bold`} fontSize='2xl'>0</Text>
                        <Text fontWeight={`bold`} fontSize='2xl'>0</Text>
                        <Text fontWeight={`bold`} fontSize='2xl'>0</Text>
                        <Text fontWeight={`bold`} fontSize='2xl'>0</Text>
                        <Text fontWeight={`bold`} fontSize='2xl'>0</Text>
                      </Flex>


                    </Flex>
                  </Box>

                  <Flex height="6"></Flex>

                  <Center my='10'>

                    <Button
                      // focusBorderColor="none"
                      id="swap_button"
                      border="1px"
                      w="80%"
                      h="40px"
                      py={6}
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
                      Confirm & Buy
                    </Button>

                  </Center>
                  <Center my='10'>

                    <Button
                      // focusBorderColor="none"
                      id="swap_button"
                      w="80%"
                      h="40px"
                      py={6}
                      // disabled
                      variant='ghost'
                      mt='-25px'
                      borderRadius="5"
                      colorScheme={colorMode === "dark" ? "white" : "black"}
                      color={colorMode === "dark" ? "white" : "black"}
                      // onClick={onOpen}
                      fontFamily="Ropa Sans"
                      fontSize={"19px"}
                      fontWeight="150"
                      onClick={onClose}
                    >
                      Go Back ➡️
                    </Button>

                  </Center>

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
                  </Center>
                }
              </Box>
            </Box>
          </Flex>


        </ModalContent>
      </Modal>
    </>
  );
};

export default Lottery;