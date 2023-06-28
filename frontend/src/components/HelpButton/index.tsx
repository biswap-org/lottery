import { Box, useToast } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import HelpIcon from "@assets/buttons/question.png";
import { useAppSelector } from "@hooks";

export const HelpButton = (props: any) => {
  const toast = useToast();
  const { mode } = useAppSelector((state) => state.theme);
  const grayscaleMode = useAppSelector((state: any) => state.grayscale.value);

  const comingsoon = () => {
    toast({
      position: "top-right",
      render: () => (
        <Box
          color={mode === "dark" ? "gray.200" : "gray.800"}
          p={3}
          bg={mode === "dark" ? "gray.800" : "gray.200"}
          borderRadius={"10px"}
          fontSize={18}
          fontFamily="Ropa Sans"
        // fontWeight="bold"
        >
          Coming soon!
        </Box>
      ),
      duration: 800,
    });
  };

  return (
    <Box {...props} cursor={'pointer'}
      w={"40px"} h="40px"
    >
      <Link href="https://docs.babylonia.app/babylonia.app/easyguide" passHref>
        <a target="_blank">
          <Image
            src={HelpIcon}
            className={grayscaleMode === "gray" ? "grayscale" : ""}
            // width={"40px"} height={"40px"}
            alt="Dashboard or Help Button" >
          </Image>
        </a>
      </Link>
    </Box>
  )
};
