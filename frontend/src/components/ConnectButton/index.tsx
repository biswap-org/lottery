import {
  Button,
  Box,
  Text,
  useToast,
  HStack,
  Flex,
  useDisclosure,
  Link,
  useClipboard,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { useEthers, useEtherBalance } from "@usedapp/core";

import { formatEther } from "@ethersproject/units";
import { GrConnect } from "react-icons/gr";
import { useEffect, useState } from "react";
import { BigNumberish } from "@ethersproject/bignumber";
import AccountModal from "../AccountModal";

import { walletActions } from "../../store/walletSlice";
import { useAppSelector, useAppDispatch } from "../../hooks";
import ConnectWalletModal from "@components/ConnectWalletModal";

export default function ConnectButton(props: any) {
  const toast = useToast();
  const { activateBrowserWallet, account, chainId, deactivate } = useEthers();
  const etherBalance = useEtherBalance(account);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isModalOpen,
    onOpen: onModalOpen,
    onClose: onModalClose,
  } = useDisclosure();

  const walletAddress = useAppSelector(
    (state: any) => state.wallet.walletAddress
  );

  const selectedNetwork = useAppSelector((state: any) => state.wallet.selectedNetwork);
  const selectedWallet = useAppSelector((state: any) => state.wallet.selectedWallet);

  const modalConnectWallet = useDisclosure();
  const textColor = useColorModeValue("gray.900", "gray.200");
  const textBNBColor = useColorModeValue("gray.900", "gray.300");
  const BtnBorderColor = useColorModeValue("teal.600", "gray.500");

  const bgColor = useColorModeValue("teal.500", "teal.800");
  const bgBtnColor = useColorModeValue("gray.100", "gray.800");
  const [menuToggle, setMenuToggle] = useState(false);

  const disconnectWallet = () => {
    deactivate();
    onModalClose();
    dispatch(walletActions.setWalletAddress(String("")));
    dispatch(walletActions.setSelectedWallet(String("")));
    dispatch(walletActions.setTokenList([]));
    dispatch(walletActions.setSelectedNetwork(String("")));

    toast({
      title: "Disconnect Wallet.",
      description: "Your wallet is dissconnected!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });

  };
  const solana = useAppSelector((state: any) => state.solana);

  let chainCurrencyName = "BNB";
  if ([56, 97].includes(chainId as number)) chainCurrencyName = "Binance";
  if ([137, 80001].includes(chainId as number)) chainCurrencyName = "Polygon";
  if ([250, 4002].includes(chainId as number)) chainCurrencyName = "Fantom";
  if ([1, 4].includes(chainId as number)) chainCurrencyName = "Ethereum";
  if ([43113, 43114].includes(chainId as number)) chainCurrencyName = "Avalanche";
  if (solana.network === "solana") chainCurrencyName = "Solana";

  const showInExplorerLink = () => {
    let showInExplorerUrl = "";
    if ([56, 97].includes(chainId as number)) {
      showInExplorerUrl =
        chainId === 97
          ? `https://testnet.bscscan.com/address/${walletAddress}`
          : `https://bscscan.com/address/${walletAddress}`;
    }
    if ([137, 80001].includes(chainId as number)) {
      showInExplorerUrl =
        chainId === 137
          ? `https://polygonscan.com/address/${walletAddress}`
          : `https://mumbai.polygonscan.com/address/${walletAddress}`;
    }
    if ([250, 4002].includes(chainId as number)) {
      showInExplorerUrl =
        chainId === 250
          ? `https://ftmscan.com/address/${walletAddress}`
          : `https://testnet.ftmscan.com/address/${walletAddress}`;
    }
    if ([43113, 43114].includes(chainId as number)) {
      showInExplorerUrl =
        chainId === 43114
          ? `https://snowtrace.io/address/${walletAddress}`
          : `https://testnet.snowtrace.io/address/${walletAddress}`;
    }
    if (solana.network === 'solana') {
      showInExplorerUrl = `https://explorer.solana.com/address/${solana.walletAddress}?cluster=devnet`
    }
    // router.push(showInExplorerLink);
    return showInExplorerUrl;
  };

  const grayscaleMode = useAppSelector((state: any) => state.grayscale.value);

  const dispatch = useAppDispatch();

  const { mode } = useAppSelector((state) => state.theme);

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

  useEffect(() => {
    if (typeof account !== "undefined" && account !== "") {
      dispatch(walletActions.setWalletAddress(String(account)));
    }
  }, [account]);

  useEffect(() => {
    if (typeof etherBalance !== "undefined" && typeof account !== "undefined" && account !== "") {
      dispatch(
        walletActions.setBalance(
          parseFloat(formatEther(etherBalance)) as BigNumberish
        )
      );
    }
  }, [etherBalance]);

  const [log, setLog] = useState<string[]>([]);
  const tokenAddress = '0xA4E26Bd6DCBa9021DCd3A1159BA52e97CD770b8a';
  const tokenSymbol = 'BABY';
  const tokenDecimals = 18;
  const tokenImage = 'https://pool.babylonia.app/babylogo.png';

  const addToken = (params: any) => {
    if (account) {
      window.ethereum
        .request({ method: "wallet_watchAsset", params })
        .then(() => setLog([...log, "Success, Token added!"]))
        .catch((error: Error) => setLog([...log, `Error: ${error.message}`]));
      toast({
        title: "Add Token",
        description: "Token added!",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Connect to Wallet",
        description: "Connect to wallet!",
        status: "warning",
        duration: 1000,
        isClosable: true,
      });
    }
  }

  const addTokenToWallet = (param: any) => {
    const p: any = param;
    const params = addToken(p);
  };

  const hover = {
    bg: "gray.300",
    color: "gray.700",
    borderRadius: "10px",
    px: "8px",
    mx: "5px",
    w: "96%",
  };
  return (typeof account !== "undefined") && (selectedWallet === "MetaMask" || selectedWallet === "TrustWallet") ? (
    <HStack {...props}>
      <Flex
        // display="flex"
        // direction="row"
        direction={props.direction}
        alignItems="center"
        // bg="gray.300"
        borderRadius="xl"
        py="0"
        bg={bgBtnColor}
        border="2px"
        borderColor={BtnBorderColor}
      >
        <Box px="2" display={props.display}>
          <Text color={textBNBColor} fontSize="xd" variant="ghost">
            {/* {balance && parseFloat(balance).toFixed(3)} */}
            <span>&nbsp;{chainCurrencyName} </span>
          </Text>
        </Box>
        <Menu>
          <MenuButton
            as="button"
            aria-label="Connect Button"
            fontWeight="normal"
          >
            <Box
              bg={grayscaleMode === "gray" ? "gray.600" : bgColor}
              border="2px solid transparent"
              borderRadius="10px"
              m="1px"
              px={3}
              height="38px"
              display="flex"
              alignItems="center"
            >
              <Text color="white" fontSize="md" fontWeight="medium" mr="2">
                {walletAddress &&
                  `${walletAddress.slice(0, 6)}...${walletAddress.slice(
                    walletAddress.length - 4,
                    walletAddress.length
                  )}`}
              </Text>
            </Box>
          </MenuButton>
          <MenuList
            zIndex={50000}
            borderRadius={10}
            fontFamily={"Ropa Sans"}
            fontSize={18}
            borderWidth={1}
            borderColor={mode === "dark" ? "gray.200" : "gray.800"}
          >
            <MenuItem
              _hover={hover}
              onClick={() => {
                onOpen();
              }}
            >
              Wallet
            </MenuItem>
            {/* <MenuItem _hover={hover}
              onClick={() => {
                comingsoon()
              }}
            >
              Profile
            </MenuItem> */}
            {/* <MenuItem
              _hover={hover}
              onClick={() => {
                comingsoon();
              }}
            >
              My NFT
            </MenuItem> */}
            {/* <NextLink href={showInExplorerLink()} passHref >
              <Link isExternal>
                <MenuItem _hover={hover}>
                  Recent Transaction
                </MenuItem>
              </Link>
            </NextLink> */}
            <MenuDivider borderColor="gray.400" />
            <MenuItem
              _hover={hover}
              onClick={() => {
                addTokenToWallet({
                  type: 'ERC20', // Initially only supports ERC20, but eventually more!
                  options: {
                    address: tokenAddress, // The address that the token is at.
                    symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                    decimals: tokenDecimals, // The number of decimals in the token
                    image: tokenImage, // A string url of the token logo
                  },
                });
              }}
            >
              Add BABY Token to MetaMask
            </MenuItem>
            <MenuDivider borderColor="gray.400" />
            <MenuItem
              _hover={hover}
              onClick={() => {
                disconnectWallet();
              }}
            >
              Disconnect
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      <AccountModal
        isOpen={isOpen}
        onClose={onClose}
        display={{ base: "none", md: "block" }}
      />

    </HStack>
  ) : (
    <>
      <Button
        {...props}
        leftIcon={<GrConnect color={bgColor} />}
        bg={grayscaleMode === "gray" ? "gray.600" : bgColor}
        color={textColor}
        variant="solid"
        className="shadow-lg"
        fontFamily={'Ropa Sans'}
        onClick={() => {
          onModalOpen();
        }}
      >
        Connect Wallet
      </Button>
      <ConnectWalletModal
        isOpen={isModalOpen}
        onClose={onModalClose}
        display={{ base: "none", md: "block" }}
      />
    </>
  );
}
