import { Box } from "@chakra-ui/react";
import Image from "next/image";
import React from "react";
import { useAppSelector, useAppDispatch } from "@hooks";
const ImageLogo = (props: any) => {
  const grayscaleMode = useAppSelector((state: any) => state.grayscale.value);

  return (
    <Box
      as={"button"}
      w={["44px", "44px", "70px", "64px"]}
      h={["44px", "44px", "70px", "64px"]}
      _hover={{
        transform: "scale(1.1)",
        transitionDuration: "300ms",
        zIndex: "200",
      }}
      // align="center"
      justifyContent="center"
      alignItems="center"
    >
      <Image
        // width="70%"
        // height="70%"
        className={grayscaleMode === "gray" ? "grayscale" : ""}
        src={props.logo}
        onClick={(e) => {
          props.onClick();
        }}
        alt={props.title}
      ></Image>
    </Box>
  );
};

export default ImageLogo;
