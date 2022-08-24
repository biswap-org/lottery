// AccountModal.tsx
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  useClipboard,
  useToast,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
// const toast = useToast();
import { CopyIcon } from "@chakra-ui/icons";
import { useEthers } from "@usedapp/core";
import Identicon from "../Identicon";
import { walletActions } from "@store/walletSlice";
import { useAppSelector, useAppDispatch } from "@hooks";
import useGrayScaleMode from "@hooks/useGrayScaleMode";

export default function AccountModal(props: any) {
  const { isOpen, onClose } = props;
  const { chainId, account, deactivate } = useEthers();
  const dispatch = useAppDispatch();
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.300", "gray.900");
  const color = useColorModeValue("gray.900", "gray.100");
  const [grayscaleMode, setGrayscaleMode] = useGrayScaleMode();

  const walletAddress = useAppSelector(
    (state: any) => state.wallet.walletAddress
  );

  const toast = useToast();
  const { hasCopied, onCopy } = useClipboard(account ? account : "");
  const disconnectWallet = () => {
    deactivate();
    onClose();
    props.onModalClose();
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

  return (
    <Modal
      isCentered
      blockScrollOnMount={false}
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
    >
      <ModalOverlay
        bg="blackAlpha.500"
        backdropFilter="blur(10px) hue-rotate(90deg)"
      />
      <ModalContent
        bg={bg}
        color={color}
        border="1px"
        borderStyle="solid"
        borderColor="gray.700"
        borderRadius="3xl"
        overflowX="auto"
        whiteSpace="nowrap"
        fontFamily={'Ropa Sans'}
      >
        <ModalHeader
          px={4} fontSize="lg" fontWeight="medium">
          Account
        </ModalHeader>
        <ModalCloseButton
          fontSize="sm"
          _hover={{
            color: { color },
          }}
        />
        <ModalBody pt={0} px={4}>
          <Box
            borderRadius="10"
            border="2px"
            borderStyle="solid"
            borderColor="gray.700"
            px={2}
            pt={2}
            pb={2}
            mb={2}
          >
            <Flex justifyContent="space-between" alignItems="center" mb={3}>
              <Text
                fontSize="sm">
                Connected with wallet
              </Text>
              <Button
                variant="outline"
                size="sm"
                borderColor="green.800"
                borderRadius="3xl"
                color="green.500"
                fontSize="16px"
                fontWeight="normal"
                px={2}
                onClick={() => { disconnectWallet(); }}
                height="26px"
                _hover={{
                  background: "none",
                  borderColor: "green.300",
                  textDecoration: "underline",
                }}
              >
                Disconnect
              </Button>
            </Flex>
            <Flex alignItems="center" mt={2} mb={4} lineHeight={1}>
              <Identicon />
              <Text
                fontSize="xl"
                fontWeight="semibold"
                ml="2"
                lineHeight="1.1"
              >
                {walletAddress &&
                  `${walletAddress.slice(0, 6)}...${walletAddress.slice(
                    walletAddress.length - 4,
                    walletAddress.length
                  )}`}
              </Text>
            </Flex>
            <Flex alignContent="center" m={3}>
              <Button
                variant="link"
                color={color}
                fontWeight="normal"
                fontSize="sm"
                _hover={{
                  textDecoration: "none",
                }}
                onClick={() => {
                  onCopy();
                  toast({
                    title: "Copy To Clipboard.",
                    description: "Your wallet address copied to clipboard!",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                  });
                }}
              >
                <CopyIcon mr={1} />
                Copy Address
              </Button>
            </Flex>
          </Box>
        </ModalBody>

        <ModalFooter
          justifyContent="end"
          borderBottomLeftRadius="3xl"
          borderBottomRightRadius="3xl"
          p={0}
        >
          <Text
            textAlign="left"
            fontWeight="medium"
            fontSize="md"
          ></Text>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
