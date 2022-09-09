import { Box, useToast } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import DashboardIcon from '@assets/buttons/dashboard.png';
import { useAppSelector } from "@hooks";

export const Dashboard = (props: any) => {
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
      <Link href={"/"} passHref>
        <a>
          <Image
            src={DashboardIcon}
            className={grayscaleMode === "gray" ? "grayscale" : ""}
            alt="Dashboard" >
          </Image>
        </a>
      </Link >
    </Box>
  )
};