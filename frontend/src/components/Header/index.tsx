import {
  Box,
  Container,
  Flex,
  Grid,
  GridItem,
  Stack,
  useColorMode,
  useColorModeValue,
} from "@chakra-ui/react";
import BabyLogo from "../BabyLogo";
import ConnectButton from "../ConnectButton";
import TopMenu from "../TopMenu";
import useGrayScaleMode from "@hooks/useGrayScaleMode";
import { HelpButton } from "@components/HelpButton";
import { SettingsButton } from "@components/SettingsButton";
import { ProfileButton } from "@components/ProfileButton";
import NetworkSelectedMenu from "@components/NetworkSelectedMenu";
// import ToggleGrayscaleMode from "@helpers/ToggleGrayscaleMode";

export default function Header(props: any) {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue("gray.700", "gray.900");
  const color = useColorModeValue("gray.900", "gray.100");
  const [grayscaleMode, setGrayscaleMode] = useGrayScaleMode();

  return (
    <Flex
      {...props}
      zIndex="200"
      as="header"
      position="fixed"
      left="0"
      top="0"
      mx="0"
      px="0"
      w="100%"
    >
      <Container mt="0" mx="0" px="0" minWidth="full">
        <Grid
          templateRows="repeat(1, 1fr)"
          templateColumns="repeat(6, 1fr)"
          gap={0}
          bg={bg}
          h="full"
        >
          <GridItem colSpan={[1, 1, 1]}>
            <Flex h="full">
              <Box>
                <BabyLogo></BabyLogo>
              </Box>
            </Flex>
          </GridItem>
          <GridItem colSpan={[1, 1, 4]}>
            <Flex h="full" alignItems="center" justifyContent="center">
              <TopMenu />
            </Flex>
          </GridItem>
          <GridItem colSpan={[4, 4, 1]}>
            <Flex h="full" alignItems="center" justifyContent="right">
              {/* <Box mr="15px" w="40px" h="40px">
                <HelpButton display={{ base: "none", md: "none", xl: "block" }} />
                <Dashboard display={{ base: "block", md: "none", xl: "none" }} />
              </Box> */}

              {/* <Box display={["block", "block", "none", "none"]} mr="15px" w="40px" h="40px">
                  <Crowdsale />
              </Box> */}
              {/* <NetworkSelectedMenu /> */}
              <Stack
                // spacing={8}
                justify={["center", "space-between", "flex-end", "flex-end"]}
                direction={["column", "row", "row", "row"]}
                pt={[4, 4, 0, 0]}
                // p="2"
                mx="2"
              >
                <ConnectButton
                  key="HeaderConnectButton"
                  display={{ base: "none", md: "none", xl: "block" }}
                  direction={"row"}
                />
              </Stack>
              {/* <Box mr={["15px", "", ""]} w="40px" h="40px">
                <SettingsButton />
              </Box> */}
              {/* <Box display={["none", "none", "block", "block"]} mr={["15px", "", ""]} w="40px" h="40px" >
                <ProfileButton />
              </Box> */}
              {/* <Box display={["block", "block", "none", "none"]}>
                <TopMobileMenu />
              </Box> */}
            </Flex>
          </GridItem>
        </Grid>
      </Container>
    </Flex>
  );
}
