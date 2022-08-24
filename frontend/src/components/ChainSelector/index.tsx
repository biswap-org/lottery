import {
  Box,
  Button,
  Center,
  Flex,
  Text,
  VStack,
  SimpleGrid,
  HStack,
  Input,
  useToast,
  Wrap,
  WrapItem,
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  ModalContent,
  ModalBody,
  useColorMode,
} from "@chakra-ui/react";
// import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Header from "../Header";
import Footer from "../Footer";
import ImageLogo from "../ImageLogo";
import BSCNetLogo from "@assets/networks/BSC_128x128.png";
import MoonbeamNetLogo from "@assets/networks/001/icon_Moonbeam_001_128x128.png";
import CeloNetLogo from "@assets/networks/001/icon_Celo_001_128x128.png";
import ThundercoreNetLogo from "@assets/networks/001/icon_thundercore_001_128x128.png";
import AvalancheNetLogo from "@assets/networks/001/icon_Avalanche_001_128x128.png";
import HecoNetLogo from "@assets/networks/001/icon_Heco_001_128x128.png";
import PolygonNetLogo from "@assets/networks/001/icon_polygonnetwork_001_128x128.png";
import ArbitrumNetLogo from "@assets/networks/001/icon_Arbitrum_001_128x128.png";
import KlaytnNetLogo from "@assets/networks/001/icon_Klaytn_001_128x128.png";
import FantomNetLogo from "@assets/networks/001/icon_fantom_001_128x128.png";
import CronosNetLogo from "@assets/networks/001/icon_Cronos_001_128x128.png";
import HarmonyNetLogo from "@assets/networks/001/icon_Harmoni_001_128x128.png";
import TelosNetLogo from "@assets/networks/001/icon_telos_001_128x128.png";
import OasisNetLogo from "@assets/networks/001/icon_oasis_001_128x128.png";

import AuroraNetLogo from "@assets/networks/001/icon_Aurora_001_128x128.png";
// import DfiNetLogo from "@assets/networks/001/icon_dfi_001_128x128.png";
// import ElrondNetLogo from "@assets/networks/001/icon_Elrond_001_128x128.png";
import GnoNetLogo from "@assets/networks/001/icon_gno_001_128x128.png";
import MoonriverNetLogo from "@assets/networks/001/icon_moonriver_001_128x128.png";
import OKTNetLogo from "@assets/networks/001/icon_OKT_001_128x128.png";
import OntologyNetLogo from "@assets/networks/001/icon_ontology_001_128x128.png";
import ThetaNetLogo from "@assets/networks/001/icon_theta_001_128x128.png";

import { useForm } from "react-hook-form";
import AlertPop from "../AlertPop";
import Menu from "../Menu";
import { default as chains } from "@config/chains.json";
import Link from "next/link";

import { useAppDispatch } from "@hooks";


declare global {
  interface Window {
    ethereum: any;
    web3: any;
  }
} 

declare const window: any;
const ChainSelector = () => {

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isSecondOpen,
    onOpen: onSecondOpen,
    onClose: onSecondClose,
  } = useDisclosure();
  const {
    isOpen: isFaucetOpen,
    onOpen: onFaucetOpen,
    onClose: onFaucetClose,
  } = useDisclosure();

  const [selectedChainId, setSelectedChainId] = useState("");
  const [selectedChain, setSelectedChain] = useState<any>([]);
  const [selectedChains, setSelectedChains] = useState<any[]>([]);
  const [selectedChainForForm, setSelectedChainForForm] = useState<any>(
    []
  );

  const LabelTextColor = useColorModeValue("gray.900", "#C5C5C5");
  const InputTextColor = useColorModeValue("gray.900", "white");
  const InputbgColor = useColorModeValue("white", "black");

  const { colorMode, toggleColorMode } = useColorMode();

  const bgColor = useColorModeValue("gray.300", "gray.700");
  const bgBoxColor = useColorModeValue("gray.500", "gray.600");
  const bgButtonColor = useColorModeValue("#F58634", "gray.800");
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm();

  const setFormValues = (val: any) => {
    setValue("networkName", val.name);
    setValue("rpcUrls", val.rpc);
    setValue("chainId", val.chainId);
    setValue("currencySymbol", val.nativeCurrency.symbol);
    setValue("blockExplorerUrls", val.explorers && val.explorers[0].url);
  };

  const toast = useToast();
  const onSubmit = async (data: any) => {
    console.log("ONSUBMIT = ", data);
    let params = [
      {
        chainId: `0x${Number(data.chainId).toString(16)}`,
        chainName: data.networkName,
        nativeCurrency: {
          // name: data.currencyName,
          symbol: data.currencySymbol,
          decimals: 18,
        },
        rpcUrls: data.rpcUrls,
        blockExplorerUrls: typeof data.blockExplorerUrls === "undefined" ? null : ["" + data.blockExplorerUrls && data.blockExplorerUrls],
      },
    ];
    if (window.ethereum) {
      window.ethereum
        .request({
          method: "wallet_addEthereumChain",
          params: params,
        })
    } else {
      toast({
        title: "Error",
        description: "wallet is not connected",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const addChainToNetwork = (ChainId: number) => {
    if (typeof window !== "undefined") {
      const chain = chains.find((c: any) => c.chainId === ChainId);
      console.log("CHAIN = ", chain);
      console.log("addChainToNetwork = ", "0x" + ChainId.toString(16));
      window.ethereum
        .request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x" + ChainId.toString(16),
              chainName: chain && chain.name,
              nativeCurrency: chain && chain.nativeCurrency,
              rpcUrls: chain && chain.rpc,
              blockExplorerUrls: chain && (typeof chain.explorers === "undefined") ? null : [chain && (typeof chain.explorers !== "undefined" ? chain.explorers[0].url : null)],
            },
          ],
        })
        .catch((error: any) => {
          console.log(error);
        });
    }
  };
  type IChainIcon = {
    chainId: number;
    logo: any;
  };

  const ChainIconList: IChainIcon[] = [
    // { chainId: 97, logo: BSCNetLogo },
    // { chainId: 1287, logo: MoonbeamNetLogo },
    // { chainId: 44787, logo: CeloNetLogo },
    // { chainId: 18, logo: ThundercoreNetLogo },
    // { chainId: 43113, logo: AvalancheNetLogo },
    // { chainId: 256, logo: HecoNetLogo },
    // { chainId: 80001, logo: PolygonNetLogo },
    // { chainId: 421611, logo: ArbitrumNetLogo },
    // { chainId: 1001, logo: KlaytnNetLogo },
    // { chainId: 4002, logo: FantomNetLogo },
    // { chainId: 338, logo: CronosNetLogo },
    // { chainId: 1666700000, logo: HarmonyNetLogo },
    { chainId: 56, logo: BSCNetLogo },
    { chainId: 1284, logo: MoonbeamNetLogo },
    { chainId: 42220, logo: CeloNetLogo },
    { chainId: 108, logo: ThundercoreNetLogo },
    { chainId: 43114, logo: AvalancheNetLogo },
    { chainId: 128, logo: HecoNetLogo },
    { chainId: 137, logo: PolygonNetLogo },
    { chainId: 42161, logo: ArbitrumNetLogo },
    { chainId: 8217, logo: KlaytnNetLogo },
    { chainId: 250, logo: FantomNetLogo },
    { chainId: 25, logo: CronosNetLogo },
    { chainId: 1666600001, logo: HarmonyNetLogo },
    { chainId: 1313161554, logo: AuroraNetLogo },
    { chainId: 40, logo: TelosNetLogo },
    { chainId: 42262, logo: OasisNetLogo },
    { chainId: 100, logo: GnoNetLogo },
    { chainId: 1285, logo: MoonriverNetLogo },
    { chainId: 65, logo: OKTNetLogo },
    { chainId: 58, logo: OntologyNetLogo },
    { chainId: 361, logo: ThetaNetLogo },
  ];

  const dispatch = useAppDispatch();

  return (
    <Box>
      <Box position="fixed" zIndex="-1" w="full" h="full" bg={bgColor}></Box>
      <Header></Header>
      <Box pt="100px" bg={'bgColor'} alignItems="center" >
        <Wrap
          // col="2"
          justify="center"
          spacing={[0, 0, 0, '0px']}
          
        >
          <WrapItem
            justifyContent="center"

            pb={["40px", "50px", "30px", "0px"]}
          >
            <Center>
              <VStack
                align="center"
                spacing="2"
                mt={["10", "10", "10", "0"]}
              >
                <Box
                  bg={colorMode === "dark" ? "black" : "white"}
                  p="9px"
                  borderRadius={"10px"}
                  borderColor={colorMode === "dark" ? "white" : "black"}
                  border={"1px"}
                >
                  <Box
                    paddingY={"14px"}
                    paddingX={"20px"}
                    borderRadius="10px"
                    bg={colorMode === "dark" ? "#5C5C5C" : "#E2E2E2"}
                    w={["90vw", "90vw", "460px", "460px"]}
                    minH="456px"
                    border="1px"
                  >
                    <Text
                      align="left"
                      fontFamily="'Ropa Sans'"
                      fontSize={[22, 19, 18, 22]}
                      color={colorMode === "dark" ? "#C5C5C5" : "black"}
                      paddingBottom="1px"
                      paddingTop="3px"
                    >
                      Add Network to MetaMask
                    </Text>
                    <Center>
                      <SimpleGrid columns={5} spacing={6} paddingBottom="19px" paddingTop={'29px'}>
                        {ChainIconList.map((icon: any, index: number) => (
                          <ImageLogo
                            key={index}

                            logo={icon.logo}
                            onClick={() => {
                              setSelectedChainId(
                                "0x" + icon.chainId.toString(16)
                              );
                              const thischain = chains.filter(
                                (chain) => chain.chainId === icon.chainId
                              )[0];
                              setSelectedChain(thischain);
                              const relatedChains = chains.filter(
                                (chain) => chain.chain === thischain.chain
                              );
                              setSelectedChains(relatedChains);
                              onOpen();
                              // addChainToNetwork(icon.chainId);
                            }}
                          ></ImageLogo>
                        ))}

                        <Modal
                          onClose={onClose}
                          isOpen={isOpen}
                          isCentered
                          scrollBehavior="inside"
                        >
                          <ModalOverlay
                            bg="blackAlpha.300"
                            backdropFilter="blur(10px) hue-rotate(90deg)"
                          />
                          <ModalContent>
                            <ModalHeader
                              fontFamily="'Press Start 2P'"
                              fontSize={18}
                            >
                              Select a network
                            </ModalHeader>
                            <ModalCloseButton />
                            <ModalBody w="full">
                              {selectedChains &&
                                selectedChains.map(
                                  (chain: any, index: number) => (
                                    <HStack
                                      key={index}
                                      borderColor="blue.700"
                                      borderWidth="3px"
                                      borderRadius="15px"
                                      bg="gray.400"
                                      color="gray.700"
                                      p={2}
                                      m={2}
                                      cursor="pointer"
                                    >
                                      {/* <Image src={chain.logo.src} alt="sss"></Image> */}
                                      <Text
                                        alignItems="center"
                                        justifyContent="center"
                                        fontFamily="'Press Start 2P'"
                                        fontSize={14}
                                        onClick={() => {
                                          setSelectedChain(chain);
                                          onSecondOpen();
                                        }}
                                      >
                                        {chain.name}
                                      </Text>
                                    </HStack>
                                  )
                                )}
                            </ModalBody>
                            <ModalFooter>
                              <Button
                                fontFamily="'Press Start 2P'"
                                fontSize={16}
                                onClick={onClose}
                              >
                                Close
                              </Button>
                            </ModalFooter>
                          </ModalContent>
                        </Modal>

                        <Modal
                          onClose={onSecondClose}
                          isOpen={isSecondOpen}
                          isCentered
                          scrollBehavior="inside"
                        >
                          <ModalOverlay
                            bg="blackAlpha.500"
                            // bg="red.900"
                            backdropFilter="blur(10px) hue-rotate(90deg)"
                          />
                          <ModalContent>
                            <ModalHeader
                              fontFamily="'Press Start 2P'"
                              fontSize={18}
                            >
                              Select action
                            </ModalHeader>
                            <ModalCloseButton />
                            <ModalBody w="full">
                              <VStack>
                                <Text fontFamily="Changa" fontSize={24}>
                                  {selectedChain.name}
                                </Text>
                                <Text
                                  bg="gray.400"
                                  color="gray.700"
                                  p={3}
                                  m={2}
                                  borderColor="blue.700"
                                  borderWidth="3px"
                                  borderRadius="15px"
                                  align="center"
                                  fontFamily="'Press Start 2P'"
                                  fontSize={14}
                                  w="full"
                                  onClick={() => {
                                    addChainToNetwork(selectedChain.chainId);
                                  }}
                                  cursor="pointer"

                                >
                                  Add to MetaMask
                                </Text>

                                <Text
                                  bg="gray.400"
                                  color="gray.700"
                                  p={3}
                                  m={2}
                                  borderColor="blue.700"
                                  borderWidth="3px"
                                  borderRadius="15px"
                                  align="center"
                                  fontFamily="'Press Start 2P'"
                                  fontSize={14}
                                  w="full"
                                  onClick={() => {
                                    onFaucetOpen();
                                  }}
                                  cursor="pointer"
                                >
                                  Go to Faucet
                                </Text>
                                <Text
                                  bg="gray.400"
                                  color="gray.700"
                                  p={3}
                                  m={2}
                                  borderColor="blue.700"
                                  borderWidth="3px"
                                  borderRadius="15px"
                                  align="center"
                                  fontFamily="'Press Start 2P'"
                                  fontSize={14}
                                  w="full"
                                  onClick={() => {
                                    { console.log("Ssssss", selectedChain) }
                                    setSelectedChainForForm(selectedChain);
                                    setFormValues(selectedChain);
                                    onFaucetClose();
                                    onSecondClose();
                                    onClose();
                                  }}
                                  cursor="pointer"
                                >
                                  Modify Detail
                                </Text>
                              </VStack>
                            </ModalBody>
                            <ModalFooter>
                              <Button
                                fontFamily="'Press Start 2P'"
                                fontSize={16}
                                onClick={onSecondClose}
                              >
                                return
                              </Button>
                            </ModalFooter>
                          </ModalContent>
                        </Modal>

                        <Modal
                          onClose={onFaucetClose}
                          isOpen={isFaucetOpen}
                          isCentered
                          scrollBehavior="inside"
                        >
                          <ModalOverlay
                            bg="blackAlpha.300"
                            backdropFilter="blur(10px) hue-rotate(90deg)"
                          />
                          <ModalContent>
                            <ModalHeader
                              fontFamily="'Press Start 2P'"
                              fontSize={18}
                            >
                              Select a Faucet
                            </ModalHeader>
                            <ModalCloseButton />
                            <ModalBody w="full">
                              {selectedChain.faucets &&
                                selectedChain.faucets.map(
                                  (faucet: any, index: number) => (
                                    <HStack
                                      key={index}
                                      borderColor="blue.700"
                                      borderWidth="3px"
                                      borderRadius="15px"
                                      bg="gray.400"
                                      color="gray.700"
                                      p={2}
                                      m={2}
                                    >
                                      <Link href={faucet} passHref>
                                        <a
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <Text
                                            bg=""
                                            alignItems="center"
                                            justifyContent="center"
                                            fontFamily="magna'"
                                            fontSize={12}
                                          >
                                            {index + 1} - {faucet}
                                          </Text>
                                        </a>
                                      </Link>
                                    </HStack>
                                  )
                                )}
                            </ModalBody>
                            <ModalFooter>
                              <Button
                                fontFamily="'Press Start 2P'"
                                fontSize={16}
                                onClick={onFaucetClose}
                              >
                                Close
                              </Button>
                            </ModalFooter>
                          </ModalContent>
                        </Modal>
                      </SimpleGrid>
                    </Center>
                  </Box>
                </Box>
              </VStack>
            </Center>
          </WrapItem>

          <WrapItem justifyContent="center" >
            <Center alignItems="left">
              <VStack  ml={'12px'}>
                <Box
                  bg={colorMode === "dark" ? "black" : "white"}
                  p="9px"
                  borderRadius={"10px"}
                  borderColor={colorMode === "dark" ? "white" : "black"}
                  border={"1px"}
                >
                  <Box
                    p={1}
                    borderRadius="10px"
                    bg={colorMode === "dark" ? "#5C5C5C" : "#E2E2E2"}
                    w={["90vw", "90vw", "420px", "420px"]}
                    minH="456px"


                    border="1px"
                    paddingLeft={["10px", "10px", "10px", "20px"]}

                  >
                    <Text

                      fontFamily="'Ropa Sans'"
                      fontSize={[22, 19, 18, 22]}
                      color={colorMode === "dark" ? "#C5C5C5" : "black"}
                      paddingBottom="1px"
                      paddingTop="1px"
                    >
                      Network information / Edit Manually
                    </Text>

                    <>
                      <form onSubmit={handleSubmit(onSubmit)}>
                        <Text
                          pt="1"
                          w={["90vw", "80vw", "50vw", "260px"]}
                          align="left"
                          fontSize={[22, 19, 18, 18]}

                          paddingLeft={"10px"}
                          color={LabelTextColor}
                        >
                          Network Name
                        </Text>
                        <Input
                          color={InputTextColor}
                          bg={InputbgColor}
                          border="1px"
                          borderColor={colorMode === 'dark' ? 'white' : 'black'}
                          borderRadius={"5px"}
                          boxShadow={" 0px 4px 4px rgba(0, 0, 0, 0.25)"}
                          type="text"
                          w={["90vw", "80vw", "50vw", "260px"]}
                          h={"33px"}
                          placeholder="Network Name"
                          {...register("networkName", {
                            required: "Enter network name",
                            minLength: 3,
                            maxLength: 100,
                          })}
                        ></Input>
                        {errors.networkName && (
                          <AlertPop title={errors.networkName.message} />
                        )}
                        <Text
                          pt="1"
                          w={["90vw", "80vw", "50vw", "330px"]}
                          align="left"
                          fontSize={[22, 19, 18, 18]}

                          paddingLeft={"10px"}
                          color={LabelTextColor}
                        >
                          RPC URL
                        </Text>
                        <Input
                          color={InputTextColor}
                          bg={InputbgColor}
                          type="text"
                          w={["90vw", "80vw", "50vw", "330px"]}
                          h={"33px"}
                          border="1px"
                          borderColor={colorMode === 'dark' ? 'white' : 'black'}
                          borderRadius={"5px"}
                          boxShadow={" 0px 4px 4px rgba(0, 0, 0, 0.25)"}
                          placeholder="RPC URL"
                          {...register("rpcUrls", {
                            required: "Enter RPC URL",
                            minLength: 3,
                            maxLength: 100,
                          })}
                        ></Input>
                        {errors.rpcUrls && (
                          <AlertPop title={errors.rpcUrls.message} />
                        )}
                        <Text
                          pt="1"
                          w={["90vw", "80vw", "50vw", "153px"]}
                          align="left"
                          fontSize={[22, 19, 18, 18]}
                          paddingLeft={"10px"}
                          color={LabelTextColor}
                        >
                          Chain ID
                        </Text>
                        <Input
                          color={InputTextColor}
                          bg={InputbgColor}
                          type="text"
                          w={["90vw", "80vw", "50vw", "153px"]}
                          h={"33px"}
                          border="1px"
                          borderColor={colorMode === 'dark' ? 'white' : 'black'}
                          borderRadius={"5px"}
                          boxShadow={" 0px 4px 4px rgba(0, 0, 0, 0.25)"}
                          placeholder="Chain ID"
                          {...register("chainId", {
                            required: "Enter Chain ID",
                            maxLength: 10,
                          })}
                        ></Input>
                        {errors.chainId && (
                          <AlertPop title={errors.chainId.message} />
                        )}
                        <Text
                          pt="1"
                          w={["90vw", "80vw", "50vw", "275px"]}
                          align="left"
                          fontSize={[22, 19, 18, 18]}

                          paddingLeft={"10px"}
                          color={LabelTextColor}

                        >
                          Currency Symbol (optional)
                        </Text>
                        <Input
                          color={InputTextColor}
                          bg={InputbgColor}
                          type="text"
                          w={["90vw", "80vw", "50vw", "175px"]}
                          h={"33px"}
                          border="1px"
                          borderColor={colorMode === 'dark' ? 'white' : 'black'}
                          borderRadius={"5px"}
                          boxShadow={" 0px 4px 4px rgba(0, 0, 0, 0.25)"}
                          placeholder="Currency Symbol"
                          {...register("currencySymbol")}
                        ></Input>
                        <Text
                          pt="1"
                          w={["90vw", "80vw", "50vw", "330px"]}
                          align="left"
                          fontSize={[22, 19, 18, 18]}
                          paddingLeft={"10px"}
                          color={LabelTextColor}
                        >
                          Block Explorer URL (optional)
                        </Text>
                        <Input
                          color={InputTextColor}
                          bg={InputbgColor}
                          type="text"
                          w={["90vw", "80vw", "50vw", "330px"]}
                          h={"33px"}
                          border="1px"
                          borderColor={colorMode === 'dark' ? 'white' : 'black'}
                          borderRadius={"5px"}
                          boxShadow={" 0px 4px 4px rgba(0, 0, 0, 0.25)"}
                          placeholder="Block Explorer URL"
                          {...register("blockExplorerUrls")}
                        ></Input>
                        <Flex my="2" justifyContent="center">
                          <Button
                            borderRadius="md"
                            bg={colorMode === "dark" ? "black" : "white"}
                            color={colorMode === "dark" ? "white" : "black"}
                            border="1px"
                            _hover={{ bg: "black", color: "white" }}
                            variant="ghost"
                            type="submit"
                            size={'sm'}
                            mt={['0px', '0px', '0px', '16px']}
                          >
                            Submit
                          </Button>

                        </Flex>
                      </form>
                    </>
                  </Box>
                </Box>
              </VStack>
            </Center>
          </WrapItem>
        </Wrap>

        <Box w="full" h="120px" bg={"bgColor"}></Box>
      </Box>
      <Menu />
      <Footer></Footer>
    </Box>
  );
};

export default ChainSelector;
