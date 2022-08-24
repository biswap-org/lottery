import React, { useEffect } from "react";
import Header from "../Header";
import Footer from "../Footer";
import {
  Box,
  Center,
  Container,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import TokenSwap from "../TokenSwap";
import Menu from "../Menu";
import {  useAppDispatch } from "@hooks";

const Crowdsale1 = () => {
  const dispatch = useAppDispatch();

  const bgColor = useColorModeValue("gray.300", "gray.700");
  return (
    <Container maxW="100vw" h="full" bg="black.900" pt="0" pb="3" pl="0" pr="0">
      <Box>
        <Header />
        <Box>
          <Flex
            maxW="100vw"
            h={["80%", "100%", "auto", "95vh"]}
            alignItems="center"
            bg={bgColor}
            pb={["18vh", "18vh", "15vh", "18vh"]}
          >
            <Box flex="100vw" bg={bgColor} h="full">
              <Center>
                <TokenSwap></TokenSwap>
              </Center>
            </Box>
          </Flex>
        </Box>
        <Menu />
        <Footer />
      </Box>
    </Container>
  );
};

export default Crowdsale1;
