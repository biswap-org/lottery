import { Box, Center, Flex, Image, Skeleton, Stack, Text, Wrap, useColorMode, VStack, WrapItem, useColorModeValue, Button, Spacer, } from '@chakra-ui/react'
import React from 'react'

const UnsupportedNetworks = (props: any) => {
  const textColor = useColorModeValue("gray.900", "#C5C5C5");
  const bgColor = useColorModeValue("gray.300", "gray.600");

  return (
    <Center w="100vw">
      <VStack
        {...props}
        color={textColor}
        overflowX="auto"
        maxW="80vw"
        whiteSpace="nowrap"
        pb="17px"
        px="2"
        borderRadius="10"
        w={["100vw", "50vw", "30vw"]}
        h="full"
        justifyContent="center"
        align="center"
        py="5vh"
        bg={bgColor}
        mt={["0vh", "7vh", "5vh"]}
      >
        <Text color={textColor}>Unsupported network or wallet! </Text>
        <Spacer></Spacer>
        <Text> {`You are using a wrong network or you don't have a wallet`} </Text>
        <Text> Supported wallet: </Text>
        <Text> MetaMask </Text>
        <Text> Trust Wallet </Text>
        <Text>  </Text>
      </VStack>
    </Center>

  )
}

export default UnsupportedNetworks