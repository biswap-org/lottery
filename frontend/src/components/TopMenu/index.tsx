import { Center, Flex, Heading, Spacer, Stack } from "@chakra-ui/react";
import BabyMenuItem from "@c/BabyMenuItem";
import { useRouter } from "next/router";

const TopMenu = (props: any) => {
  const router = useRouter();

  const handleSwap=()=>{
    router.push('/Swap');
  }
  
  return (
    <Stack
      display={{ base: "none", sm: "none", md: "none", xl: "block" }}
      direction={["column", "row"]}
    >
      <Flex>
        {/* <BabyMenuItem key="menu11" to="/" label="DASHBOARD"></BabyMenuItem>
        <BabyMenuItem key="menu21" to="/Invest" label="STAKING" comingsoon={true}></BabyMenuItem> */}
        <Heading  fontFamily='Ropa Sans' as='h3' color='white' >Lottery</Heading>
        {/* <BabyMenuItem key="menu41" to="/Bridge" label="BRIDGE" comingsoon={true}></BabyMenuItem>
        <BabyMenuItem
          // display={{ base: "none", md: "block", xl: "block" }}
          key="menu51"
          to="/ChainSelector"
          label="CHAIN SELECTOR"
        ></BabyMenuItem>
        <Spacer w="80px"></Spacer>
        <BabyMenuItem
          key="menu61"
          to="/Crowdsale1"
          label="CROWDSALE #1"
        ></BabyMenuItem> */}
      </Flex>
    </Stack>
  );
};

export default TopMenu;
