
import {
    TabList,
    Tab,
    Text,
    useColorMode,
  
  } from "@chakra-ui/react";

function Tablist(props: any) {
    const { colorMode, toggleColorMode } = useColorMode();
    return(
        <>
    <TabList border={"none"} justifyContent="center">
          <Tab
            border={"2px"}
            color={colorMode === "dark" ? "#C5C5C5" : "black"}
            borderRadius={"5px"}
            fontSize={["16px", "16px", "18px", "17px"]}
            bg={colorMode === "dark" ? "black" : "white"}
            h={["50px", "50px", "40px", "40px"]}
            borderColor={colorMode === "dark" ? "white" : "black"}
            _active={{ borderColor: "black", boxShadow: "" }}
            _focus={{ boxShadow: "" }}
            fontWeight="550"
            fontFamily="Ropa sans"
            mr={"12px"}
            _selected={{ color: 'white', bg: 'blue.500' }}
            w={["45vw", "45vw", "224px", "224px"]}
            p="0px"
          >
            <Text display={["none", "none", "block", "block"]}> METHOD 1: STABLE COIN </Text>
            <Text display={["block", "block", "none", "none"]}> METHOD 1 <br /> STABLE COIN </Text>
          </Tab>
          <Tab
            border={"2px"}
            p="0px"
            color={colorMode === "dark" ? "#C5C5C5" : "black"}
            borderRadius={"5px"}
            fontSize={["16px", "16px", "18px", "17px"]}
            bg={colorMode === "dark" ? "black" : "white"}
            height={["60px", "50px", "40px", "40px"]}
            borderColor={colorMode === "dark" ? "white" : "black"}
            _active={{ borderColor: "black", boxShadow: "" }}
            _focus={{ boxShadow: "" }}
            _selected={{ color: 'white', bg: 'blue.500' }}
            fontWeight="550"
            fontFamily="Ropa sans"
            w={["45vw", "45vw", "224px", "224px"]}
          >
            <Text display={["none", "none", "block", "block"]}> METHOD 2: DIRECT TRANSFER </Text>
            <Text display={["block", "block", "none", "none"]}> METHOD 2 <br /> DIRECT TRANSFER</Text>
          </Tab>
        </TabList>

        </>
    )
}


export default Tablist 