import { NextPage } from "next";
import { Box, Grid, GridItem, HStack, Text, useDisclosure, VStack } from "@chakra-ui/react";

import Header from "@components/Docs/Header";
import BodyOfPage from "@components/Docs/BodyOfPage";
import TOCDrawer from "@components/Docs/TOCDrawer";
import TOC from "@components/Docs/TOC";
import TocOfBody from "../TocOfBody";


const Layout: NextPage = (props: any) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const bodyRef = useRef();
  return (
    <Box maxWidth="100%" width="100%" >

      <VStack h="100vh" spacing={0}>
        <HStack w="100%" h={["100px", "100px", "8vh", "8vh"]} sx={{ gap: "0px" }} bg="blueviolet" spacing={0}>
          <Header isOpen={isOpen} onOpen={onOpen} onClose={onClose}></Header>
        </HStack>
        <HStack w="100%" h={["full", "full", "92vh", "92vh"]} spacing={0}>
          <TOC w="20vw" />
          <BodyOfPage w={["", "", "80vw", "80vw"]} h={["90vh", "90vh", "92vh", "92vh"]} mt="200px" />
        </HStack>
      </VStack>
      {/*
      <Grid
        templateAreas={`"header header header"
      "nav main toc"
      `}
        gridTemplateRows={'0px 1fr'}
        gridTemplateColumns={['0vw 1fr', '0vw 1fr', '10vw 1fr 20vw', '10vw 1fr 20vw']}
        gap={0}
        h="80%"
      >

        <GridItem w="20vw" area={'nav'} >
        </GridItem>
        <GridItem area={'main'} bg="blackAlpha.100">
        </GridItem>
        <GridItem area={'toc'} h="80%" bg="yellow" >
        </GridItem>
      </Grid> */}

      <TOCDrawer isOpen={isOpen} onOpen={onOpen} onClose={onClose} />

    </Box>
  );
};

export default Layout;
