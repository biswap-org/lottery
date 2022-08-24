import MetaMaskLogo from "@assets/connectwallet/MetaMask_white_128px.png";
import PhantomLogo from "@assets/connectwallet/phantom-wallet_128px.png";
import TrustWalletLogo from "@assets/connectwallet/TrustWallet_128px.png";
import WalletConnectLogo from "@assets/connectwallet/WalletConnect_128px.png";

import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import {
  Box,
  Button,
  Center,
  Image,
  Text,
  VStack,
  Grid,
  GridItem,
  useClipboard,
  useToast,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalContent,
  Modal,
  ModalOverlay,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";

import { useEthers } from "@usedapp/core";
import { walletActions } from "@store/walletSlice";
import { solanaWalletActions } from "@store/solanaSlice";
import { useAppSelector, useAppDispatch } from "@hooks";
import useGrayScaleMode from "@hooks/useGrayScaleMode";

declare const window: any;

const ConnectWalletModal = (props: any) => {
  const { activateBrowserWallet, account, chainId, deactivate } = useEthers();
  const { isOpen, onClose } = props;
  const dispatch = useAppDispatch();
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.300", "gray.900");
  const color = useColorModeValue("gray.900", "gray.100");
  const [grayscaleMode, setGrayscaleMode] = useGrayScaleMode();

  const balance = useAppSelector((state: any) => state.wallet.balance);

  const { mode } = useAppSelector((state) => state.theme);

  const toast = useToast();
  const { hasCopied, onCopy } = useClipboard(account ? account : "");
  const Disscounect = () => {
    deactivate();
    dispatch(walletActions.setSelectedWallet(String("")));
    toast({
      title: "Disconnect Wallet.",
      description: "Your wallet is dissconnected!",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
    onClose();
  };

  const comingsoon = () => {
    toast({
      position: "top-right",
      render: () => (
        <Box
          color={mode === "dark" ? "gray.200" : "gray.800"}
          p={3}
          bg={mode === "dark" ? "gray.800" : "gray.200"}
          borderRadius={12}
          fontSize={18}
          fontFamily="Ropa Sans"
        // fontWeight="bold"
        >
          Coming soon!
        </Box>
      ),
      duration: 800,
    });
  };

  const handleConnectWallet = async (walletName: string) => {
    const delay = (ms: any) => new Promise((res) => setTimeout(res, ms));
    const a = await activateBrowserWallet();
    await delay(1000);
    dispatch(solanaWalletActions.setNetworkName(""));
    dispatch(walletActions.setSelectedWallet(walletName));
    dispatch(walletActions.setTokenList([]));
    return a;
  };


  const handleConnectWallet_TrustWallet = async () => {
    const delay = (ms: any) => new Promise((res) => setTimeout(res, ms));
    const a = await activateBrowserWallet();
    await delay(1000);
    dispatch(walletActions.setSelectedWallet("TrustWallet"));
    dispatch(solanaWalletActions.setNetworkName(""));
    dispatch(walletActions.setTokenList([]));
    return a;
  };

  const handlePhantomWallet = async () => {
    try {
      let { solana } = window;
      if ("solana" in window) {
        try {
          const delay = (ms: any) => new Promise((res) => setTimeout(res, ms));
          const a = await solana.connect();
          const connection = new Connection(
            clusterApiUrl("devnet"),
            "confirmed"
          );
          dispatch(
            solanaWalletActions.setWalletAddress(a.publicKey.toBase58())
          );
          let address = await a.publicKey.toBase58();
          // dispatch(walletActions.setWalletAddress(address));
          let publicKey = new PublicKey(a.publicKey);
          connection.getBalance(publicKey).then((balance) => {
            dispatch(solanaWalletActions.setBalance(balance));
            // dispatch(walletActions.setBalance(balance));
          });

          dispatch(solanaWalletActions.setNetworkName("solana"));
          dispatch(walletActions.setSelectedWallet("Solana"));
          dispatch(walletActions.setTokenList([]));
          await delay(1000);

          return a;
        } catch (error) {
          dispatch(walletActions.setBalance(0));
          dispatch(solanaWalletActions.setNetworkName(""));
          dispatch(walletActions.setSelectedWallet(""));
        }
      }
      if (!solana) {
        dispatch(walletActions.setBalance(0));
        dispatch(walletActions.setSelectedWallet(""));
        dispatch(walletActions.setTokenList([]));

        toast({
          title: "Not connected to Solana",
          description: "Install Phantom wallet",
          status: "error",
          duration: 1000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <Modal
      isCentered
      blockScrollOnMount={false}
      isOpen={isOpen}
      onClose={onClose}
      size="md"
    >
      <ModalOverlay
        bg="blackAlpha.700"
        backdropFilter="blur(10px) hue-rotate(90deg)"
      />

      <ModalContent
        bg={colorMode === 'dark' ? 'black' : 'white'}
        color={color}
        // background="gray.900"
        border="1px"
        borderStyle="solid"
        borderColor={colorMode === 'dark' ? 'white' : 'gray.700'}
        borderRadius="3xl"
        overflowX="auto"
        whiteSpace="nowrap"
        fontFamily={"Ropa Sans"}
      >
        <Box backgroundColor={colorMode === 'dark' ? '#5C5C5C' : '#E2E2E2'} borderRadius='15px' m={3}>

          <ModalHeader
            // color="white"
            px={4}

            py={1}
            fontSize="lg"
            fontWeight="medium"
          >
            <Text
              mt="10px"
              w={400}
              fontFamily={"Ropa Sans"}
              pl="30px"
              align="left"
              fontSize="26"
            >
              {" "}
              Connect Wallet
            </Text>
          </ModalHeader>
          <ModalCloseButton
            // color="white"
            fontSize="sm"
            bg={colorMode === 'dark' ? 'black' : "white"}
            mt='15px'
            mr='12px'
            color={colorMode === 'dark' ? 'white' : 'black'}
            _hover={{
              color: { color },
            }}
          />
          <ModalBody pt={0} px={0}
          >
            <Box alignItems="center"
              m="20px"
            >
              {/* <Flex h="full"
              w={["80vw", "80vw", "50vw", "500px"]}
              bg="gray.400"
              borderTopRadius="15px"
              pb="10px"
            >
              <Box flex='1'>
              </Box>
              <Box flex='1/2'>
                <Button mt="10px" mr="10px" borderRadius="10px">
                  <GrClose ></GrClose>
                </Button>
              </Box>
            </Flex>
          */}
              <Grid
                templateColumns={[
                  "repeat(2, 1fr)",
                  "repeat(2, 1fr)",
                  "repeat(2, 1fr)",
                  "repeat(2, 1fr)",
                ]}
                justifyContent="center"
                w={["80vw", "full", "50vw", "385px"]}
                templateRows={[
                  "repeat(1, 1fr)",
                  "repeat(1, 1fr)",
                  "repeat(1, 1fr)",
                  "repeat(1, 1fr)",
                ]}
                border="1px"
                gap={[1, 1, 1, 1]}
                p={[1, 1, 1, 1]}
                // m="1"
                bg=""
                borderRadius="15px"
              // pb="20px"
              // mb="30px"
              >
                <GridItem p={[1, 1, 1, 4]} rowSpan={1} colSpan={1}>
                  <Center>
                    <Button
                      variant="ghost"
                      h={["70px", "120px", "170px", "199px"]}
                      w={["40px", "120px", "170px", "165px"]}
                      bg={colorMode === 'dark' ? 'black' : 'white'}
                      borderRadius={15}
                      onClick={(e) => {
                        handleConnectWallet("MetaMask").then((a) => {
                          onClose();
                        });
                      }}
                    >
                      <VStack>
                        <Image
                          src={MetaMaskLogo.src}
                          alt="MetaMaskLogo"
                          w={["30px", "70px", "128px", "128px"]}
                          p={2}
                          className={grayscaleMode === "gray" ? "grayscale" : ""}
                        ></Image>
                        <Text
                          fontFamily={"Ropa Sans"}
                          color={colorMode === 'dark' ? "white" : 'black'}
                          fontSize={["", "18", "22", "22"]}
                        >
                          MetaMask
                        </Text>
                      </VStack>
                    </Button>
                  </Center>
                </GridItem>
                {/* <GridItem p={[1, 1, 1, 4]} rowSpan={1} colSpan={1}>
                  <Center >
                    <Button
                      variant="ghost"
                      h={["40px", "120px", "170px", "199px"]}
                      w={["40px", "120px", "170px", "165px"]}
                      bg={colorMode === 'dark' ? 'black' : 'white'}
                      borderRadius={15}
                      onClick={(e) => {
                        handlePhantomWallet().then((a) => {
                          if (a === undefined) {
                          } else {
                            onClose();
                          }
                        });
                      }}
                    >
                      <VStack>
                        <Image
                          px={2}
                          w={["40px", "80px", "128px", "128px"]}
                          src={PhantomLogo.src}
                          alt="PhantomLogo"
                          className={grayscaleMode === "gray" ? "grayscale" : ""}
                        ></Image>
                        <Text
                          fontFamily={"Ropa Sans"}
                          color={colorMode === 'dark' ? "white" : 'black'}
                          fontSize={["", "18", "22", "22"]}
                        >
                          Phantom
                        </Text>
                      </VStack>
                    </Button>
                  </Center>
                </GridItem> */}
                {/* <GridItem p={[1, 1, 1, 4]} rowSpan={1} colSpan={1}>
                  <Center>
                    <Button
                      variant="ghost"
                      h={["70px", "120px", "170px", "199px"]}
                      w={["40px", "120px", "170px", "165px"]}
                      bg={colorMode === 'dark' ? 'black' : 'white'}
                      borderRadius={15}
                      onClick={(e) => {
                        handleConnectWallet_TrustWallet().then((a) => {
                          onClose();
                        });
                      }}
                    >
                      <VStack>
                        <Image
                          px={2}
                          w={["40px", "80px", "128px", "128px"]}
                          src={TrustWalletLogo.src}
                          alt="TrustWalletLogo"
                          className={grayscaleMode === "gray" ? "grayscale" : ""}
                        ></Image>
                        <Text
                          color={colorMode === 'dark' ? "white" : 'black'}
                          fontFamily={"Ropa Sans"}
                          fontSize={["", "18", "22", "22"]}
                        >
                          Trust Wallet
                        </Text>
                      </VStack>
                    </Button>
                  </Center>
                </GridItem> */}
                <GridItem p={[1, 1, 1, 4]} rowSpan={1} colSpan={1}>
                  <Center>
                    <Button
                      variant="ghost"
                      h={["70px", "120px", "170px", "199px"]}
                      w={["40px", "120px", "178px", "165px"]}
                      bg={colorMode === 'dark' ? 'black' : 'white'}
                      borderRadius={10}
                      onClick={(e) => {
                        comingsoon();
                      }}
                    >
                      <VStack>
                        <Image
                          px={3}
                          w={["40px", "80px", "128px", "128px"]}
                          src={WalletConnectLogo.src}
                          alt="WalletConnectLogo"
                          className={grayscaleMode === "gray" ? "grayscale" : ""}

                        ></Image>
                        <Text
                          color={colorMode === 'dark' ? "white" : 'black'}
                          fontFamily={"Ropa Sans"}
                          fontSize={["", "18", "22", "22"]}
                        >
                          Wallet Connect
                        </Text>
                      </VStack>
                    </Button>
                  </Center>
                </GridItem>
              </Grid>
            </Box>
          </ModalBody>
          <ModalFooter
            justifyContent="end"
            // background="gray.700"
            borderBottomLeftRadius="3xl"
            borderBottomRightRadius="3xl"
            p={0}
          >
            <Text
              color="white"
              textAlign="left"
              fontWeight="medium"
              fontSize="md"
            ></Text>
          </ModalFooter>
        </Box>

      </ModalContent>
    </Modal>
  );
};

export default ConnectWalletModal;
