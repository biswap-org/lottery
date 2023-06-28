import { Box, Flex, Spacer, Stack, Text, useColorModeValue, VStack } from "@chakra-ui/react";
import TokenList from "../TokenList";
import ConnectButton from "../ConnectButton";

export default function Body(props: any) {
  const bgColor = useColorModeValue("gray.400", "gray.700");
  return (
    <Flex
      w="100vw"
      h={["full", "80vh", "85vh", "full"]}
      pt={["88px", "65px", "80px", "80px"]}
      bg="gray.200"
    >
      <Box bg={bgColor}>
        <Box
          h="100vh"
          w="100vw"
          display="block"
          pos="fixed"
          top="30px"
          left="0px"
          bg={bgColor}
          zIndex="-1"
        ></Box>
        <VStack>
          <Stack>
            <ConnectButton
              key="MobileViewConnectButton"
              mt="15px"
              display={{ base: "block", md: "block", xl: "none" }}
            />
          </Stack>
          <TokenList></TokenList>
        </VStack>
      </Box>
    </Flex>
  );
}
