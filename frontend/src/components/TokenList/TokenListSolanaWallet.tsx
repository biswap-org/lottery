import { Box, Flex, Image, Stack, Text, useColorMode, VStack, WrapItem, useColorModeValue, Button } from '@chakra-ui/react'
import Babylonia_Logo from "../../assets/Babylonia_Logo.png";
import { useAppSelector } from "@hooks";
import { useRouter } from "next/router";
import TokenListReading from './TokenListReading';

const TokenListSolanaWallet = (props: any) => {
  const grayscaleMode = useAppSelector((state: any) => state.grayscale.value);
  const { colorMode, toggleColorMode } = useColorMode();
  const textColor = useColorModeValue("gray.900", "#C5C5C5");
  const bgBuyBtnColor = useColorModeValue("gray.100", "gray.800");
  const bgBuyBtnTextColor = useColorModeValue("gray.900", "gray.200");
  const addCommas = (num: any) => {
    var parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };
  const router = useRouter();
  const tokenList = useAppSelector((state: any) => state.wallet.tokenList);
  const solana = useAppSelector((state: any) => state.solana);

  if (tokenList.length > 0 && solana.network === "solana") {
    return (
      <Stack
        w="100vw"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          {...props}
          w={["94vw", "94vw", "340px", "340px"]}
          borderRadius="10px"
          maxW="100vw"
          whiteSpace="nowrap"
          bg={colorMode === "dark" ? "black" : "white"}
          border={"1px"}
          borderColor={colorMode === "dark" ? "white" : "black"}
          p="10px"
          mt={["0vh", "7vh", "0vh"]}
        >
          <Box
            bg={colorMode === "dark" ? "#5C5C5C" : "#E2E2E2"}
            borderRadius="5px"
            border="1px"
            paddingX="15px"
            borderColor={colorMode === "dark" ? "black" : "black"}
          >
            <Image
              src={Babylonia_Logo.src}
              className={grayscaleMode === "gray" ? "grayscale" : ""}
              alt="babylonia logo"
              marginTop={"8px"}
              w="140px"
            />
            <Text
              fontSize={"lg"}
              pl="6px"
              color={colorMode === "dark" ? "#C5C5C5" : ""}
            >
              Profile
            </Text>
            {tokenList &&
              tokenList.map((tokenItem: any, idx: any) => (
                <Stack
                  key={idx}
                  spacing="5px"
                  borderRadius="5px"
                  bg={colorMode === "dark" ? "#000000" : "#FFFFFF"}
                  mx="1px"
                  border={"1px"}
                  my="6px"
                  boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25)"}
                >
                  <Flex alignItems="center">
                    <Image
                      className={grayscaleMode === "gray" ? "grayscale" : ""}
                      // objectFit="cover"
                      w="30px"
                      h="30px"
                      p="0"
                      ml="10px"
                      // boxSize="50px"
                      // objectFit='cover'
                      src={tokenItem.icon.src}
                      alt={tokenItem.symbol}
                    />
                    <Box ml="10px">
                      <VStack pt="0px" align="left">
                        <Text fontSize="16px" color={textColor}>
                          {tokenItem.symbol}
                        </Text>
                        <WrapItem>
                          <Text
                            fontSize="14px"
                            color={
                              colorMode === "dark" ? "#C5C5C5" : "gray.500"
                            }
                          >
                            {"$" + addCommas(tokenItem.price).toString()}
                          </Text>
                        </WrapItem>
                      </VStack>
                    </Box>
                    <Box w="300px" h="0px"></Box>
                    <Box w="300px" h="55px" alignItems="right">
                      {tokenItem.symbol === "BABY" && (
                        <Button
                          bg={bgBuyBtnColor}
                          color={bgBuyBtnTextColor}
                          variant="ghost"
                          mr="15px"
                          size={'sm'}
                          mt="12px"
                          alignItems="right"
                          onClick={() => {
                            router.push("/Crowdsale1");
                          }}
                        >
                          Buy BABY
                        </Button>
                      )}
                      {tokenItem.symbol !== "BABY" && (
                        <VStack
                          pt="0px"
                          align="left"
                          pr="15px"
                          justifyContent="right"
                          mt={'0px'}
                        >
                          <Text fontSize="16px"
                            mt={'0px'}
                            color={textColor} align="right">
                            {tokenItem.balance +
                              " " +
                              tokenItem.symbol.toString()}
                          </Text>
                          <Text
                            align="right"
                            mr="35px"
                            mt={'0px'}
                            pt="0px"
                            color={
                              colorMode === "dark" ? "#C5C5C5" : "gray.500"
                            }
                          >
                            {tokenItem.usd_balance
                              ? "$" +
                              addCommas(tokenItem.usd_balance.toFixed(8) * 1)
                                .toString()
                                .trim()
                              : ""}
                          </Text>
                        </VStack>
                      )}
                    </Box>
                  </Flex>
                </Stack>
              ))}
          </Box>
        </Box>
        <Box h="110px" w="100vw"></Box>
      </Stack>
    )
  } else {
    return (<TokenListReading ></TokenListReading>)
  }
}

export default TokenListSolanaWallet;