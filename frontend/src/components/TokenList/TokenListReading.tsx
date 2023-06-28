import { Box, Center, Skeleton, Stack, Text, useColorModeValue } from '@chakra-ui/react'
import React from 'react'

const TokenListReading = (props: any) => {
  const textColor = useColorModeValue("gray.900", "#C5C5C5");
  const bgColor = useColorModeValue("gray.300", "gray.600");

  return (
    <Center w="100vw">
      <Box
        {...props}
        w={["100vw", "90vw", "340px", "340px"]}
        borderRadius="10px"
        overflowX="auto"
        maxW="100vw"
        // h="100%"
        color={textColor}
        whiteSpace="nowrap"
        pb="17px"
        px="2"
        bg={bgColor}
        mt={["0vh", "7vh", "10vh"]}
      // colorScheme="teal"
      >
        <Text my="10" align="center">
          Wait ...
        </Text>

        <Stack justifyItems="center">
          <Skeleton height="48px" />
          <Skeleton height="48px" />
          <Skeleton height="48px" />
          <Skeleton height="48px" />
          <Skeleton height="48px" />
        </Stack>
      </Box>
    </Center>)
}

export default TokenListReading