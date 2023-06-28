import { Box, Center, Flex, Image, Skeleton, Stack, Text, Wrap, useColorMode, VStack, WrapItem, useColorModeValue, Button, } from '@chakra-ui/react'
import React from 'react'

const DisconnectedWalet = (props: any) => {
  const textColor = useColorModeValue("gray.900", "#C5C5C5");
  const bgColor = useColorModeValue("gray.300", "gray.600");
  return (
    <Center w="100vw">
      <Flex
        {...props}
        pb="25px"
        px="1px"
        borderRadius="10"
        w={["100vw", "90vw", "30vw"]}
        h={["50vh", "60vh", "60vh"]}
        justifyContent="center"
        align="center"
        bg={bgColor}
        mt={["0vh", "7vh", "5vh"]}
      >
        <Wrap spacing="20px" justify="center">
          <Text color={textColor}>Disconnected!</Text>
          <Text color={textColor}>You can connect to your wallet</Text>
        </Wrap>
      </Flex>
    </Center>)
}

export default DisconnectedWalet