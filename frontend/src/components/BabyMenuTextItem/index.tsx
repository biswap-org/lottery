import { Box, Button, ButtonGroup, Text, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useAppSelector } from "@hooks";

const BabyMenuTextItem = (props: any) => {
  const grayscaleMode = useAppSelector((state: any) => state.grayscale.value);
  const { mode } = useAppSelector((state) => state.theme);

  const toast = useToast();

  const comingsoonToast = () => {
    toast({
      position: "top-right",
      render: () => (
        <Box
          color={mode === "dark" ? "gray.200" : "gray.800"}
          p={3}
          bg={mode === "dark" ? "gray.800" : "gray.200"}
          borderRadius={12}
          fontSize={18}
          fontFamily="Ropa Sans"
        >
          Coming soon!
        </Box>
      ),
    });
  };
  const { isLast = true, to, icon, label = "Menu Item", comingsoon = false, ...rest } = props;

  const router = useRouter();
  return (
    <ButtonGroup
      onClick={
        () => {
          if (props.comingsoon) comingsoonToast();
          else {
            router.push(props.to)
          }
        }
      }
    >
      <Button
        h={"60px"}
        py="2"
        bg={router.pathname === to ? "gray.300" : "gray.100"}
        borderRadius="15"
      >
        <Box pr="10px" pt="5px" pl="5px">
          <Image
            className={grayscaleMode === "gray" ? "grayscale" : ""}
            src={props.icon}
            width="40px"
            height="40px"
            alt="image"
          ></Image>
        </Box>
        <Text
          fontSize="2xl"
          color={router.pathname === to ? "black" : "gray.600"}
          {...rest}
          w="full"
          align="left"
        >
          {label}
        </Text>
      </Button>
    </ButtonGroup>
  );
};
export default BabyMenuTextItem;
