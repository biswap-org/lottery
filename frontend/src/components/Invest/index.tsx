import React from "react";
import Header from "@components/Header";
import Footer from "@components/Footer";
import Menu from "../Menu";
// import styled from "@emotion/styled";
import {
  Box,
  Container,
  Flex,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import StakingSlide from "@assets/Slides_Staking_001_3x4_1.png";
import Image from "@components/Common/Image";
// import useGrayScaleMode from "@hooks/useGrayScaleMode";
import { useAppSelector, useAppDispatch } from "@hooks";
import { selectThemeMode } from "@store/themeSlice";

const Invest = () => {
  const dispatch = useAppDispatch();
  const grayscaleMode = useAppSelector((state: any) => state.grayscale.value);

  const bgColor = useColorModeValue("gray.200", "gray.700");
  return (
    <Container
      maxW=".xl"
      bg="black.900"
      pt="0"
      pb="3"
      pl="0"
      pr="0"
      w="100vw"
      mt={["88px", "88px", "80px"]}
      h={["100vh", "100vh", "100vh", "90vh"]}
    >
      <Box>
      <Header></Header>
      <Box h={["100vh", "100vh", "100vh", "90vh"]} bg={bgColor} pb="100px">
        <Flex align="center" bg={bgColor}>
          <Box flex="1" bg={bgColor}>
            <VStack m="4">
              <Box h="60vh">
                <Image
                  className={grayscaleMode === "gray" ? "grayscale" : ""}
                  src={StakingSlide}
                  alt="StakingSlide"
                ></Image>
              </Box>
            </VStack>
          </Box>
        </Flex>
      </Box>
      <Menu></Menu>
      <Box h="20px"></Box>
      <Footer></Footer>
      </Box>
    </Container>
  );
};

export default Invest;
