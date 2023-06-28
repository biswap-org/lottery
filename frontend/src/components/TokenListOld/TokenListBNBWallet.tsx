import { Box, Center, Flex, Image, Skeleton, Stack, Text, Wrap, useColorMode, VStack, WrapItem, useColorModeValue, Button, HStack, } from '@chakra-ui/react'
import Babylonia_Logo from "../../assets/Babylonia_Logo.png";
import { useAppSelector, useAppDispatch } from "@hooks";
import { useRouter } from "next/router";
import TokenListReading from './TokenListReading';
import { useEffect, useState } from 'react';

const TokenListBNBWallet = (props: any) => {
  const grayscaleMode = useAppSelector((state: any) => state.grayscale.value);
  const { colorMode, toggleColorMode } = useColorMode();
  const textColor = useColorModeValue("gray.900", "#C5C5C5");
  const bgBuyBtnColor = useColorModeValue("gray.100", "gray.800");
  const bgBuyBtnTextColor = useColorModeValue("gray.900", "gray.200");
  const addCommas = (num: any) => {
    // num = num.toString();
    // var pattern = /(-?\d+)(\d{3})/;
    // while (pattern.test(num)) num = num.replace(pattern, "$1,$2");
    // return num;
    // return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    //num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    var parts = num.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  };
  const router = useRouter();
  const tokenList = useAppSelector((state: any) => state.wallet.tokenList);

  // when tokenList is empty, show skeleton instead of tokenList 
  if (true && tokenList.length === 0) {
    return (
      <TokenListReading ></TokenListReading>
    );
  }

  // when tokenList is not empty, show tokenList   
  // tokenList is an array of objects
  // each object has a symbol, price, contract, balance, usd_balance, bnb_balance, icon, type, decimals (decimals is a number between 1 and 18)
  // type is "bnb" or "eth"
  // icon is a object with a url and width and height
  // contract is a object with a address and name
  // balance is a number
  // usd_balance is a number
  // bnb_balance is a number
  // price is a number
  // symbol is a string
  // decimals is a number
  // tokenList is an array of objects

  if (!tokenList) {
    return <></>
  } else {
    return (
      <Stack w="100vw"
        justifyContent="center" alignItems="center">
        <Box
          {...props}
          // overflowX="auto"
          w={["94vw", "94vw", "340px", "340px"]}
          borderRadius="10px"
          maxW="100vw"
          whiteSpace="nowrap"
          bg={colorMode === "dark" ? "black" : "white"}
          border={"1px"}
          borderColor={colorMode === "dark" ? "white" : "black"}
          p="10px"
          // ml="10px"
          // maxH={"70vh"}
          mt={["0vh", "7vh", "10vh"]}
        // colorScheme="teal"
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
                  border={"1px"}
                  boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25)"}
                  my="6px"

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
                      <VStack pt="3px" align="left">
                        <Text fontSize="16px" color={textColor}>
                          {tokenItem.symbol.toString()}
                        </Text>
                        <WrapItem>
                          <Text fontSize="14px" color={
                            colorMode === "dark" ? "#C5C5C5" : "gray.500"
                          }>
                            {"$" + addCommas(tokenItem.price).toString()}
                          </Text>
                        </WrapItem>
                      </VStack>
                    </Box>
                    <Box w="300px" h="0px"></Box>
                    <Box w="300px" h="55px" alignItems="right">
                      {tokenItem.symbol === "BABY" && (
                        <HStack
                          pt="0px"
                          align="left"
                          // pr="15px"
                          justifyContent="right"
                        >
                          <Button
                            // variantColor={bgBuyBtnColor}
                            bg={bgBuyBtnColor}
                            color={bgBuyBtnTextColor}
                            // variant="ghost"
                            mr="15px"
                            mt="12px"
                            size={'sm'}
                            alignItems="center"
                            justifyContent={"center"}
                            onClick={() => {
                              router.push("/Crowdsale1");
                              // BuyToken(PoolTokenList[idx]);
                            }}
                          >
                            Buy
                          </Button>
                          <VStack
                            pt="0px"
                            align="left"
                            pr="15px"
                            justifyContent="right"
                          >
                            <Text>
                              {tokenItem.balance !== 0
                                ? addCommas(
                                  tokenItem.balance.toFixed(8) * 1
                                ).toString() +
                                " " +
                                tokenItem.symbol.toString()
                                : "0.00" + tokenItem.symbol.toString()}
                            </Text>
                            <Text align="right" mr="35px"
                              color={
                                colorMode === "dark" ? "#C5C5C5" : "gray.500"
                              }>
                              {tokenItem.usd_balance
                                ? "$" +
                                addCommas(tokenItem.usd_balance.toFixed(8) * 1)
                                  .toString()
                                  .trim()
                                : "0.00"}
                            </Text>
                          </VStack>
                        </HStack>
                      )}
                      {tokenItem.symbol !== "BABY" && (
                        <VStack
                          pt="0px"
                          align="left"
                          pr="15px"
                          justifyContent="right"
                        >
                          <Text fontSize="16px" color={textColor} align="right">
                            {console.log("tokenItem  ===== > ", tokenItem)}
                            {tokenItem.balance !== 0
                              ? addCommas(
                                tokenItem.balance.toFixed(8) * 1
                              ).toString() +
                              " " +
                              tokenItem.symbol.toString()
                              : "0.00 " + tokenItem.symbol.toString()}
                          </Text>
                          <Text align="right" mr="35px"
                            color={
                              colorMode === "dark" ? "#C5C5C5" : "gray.500"
                            }>
                            {tokenItem.usd_balance
                              ? "$" +
                              addCommas(tokenItem.usd_balance.toFixed(8) * 1)
                                .toString()
                                .trim()
                              : "0.00"}
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
  }
}

export default TokenListBNBWallet