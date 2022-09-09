import { MouseEventHandler } from "react";

import { Box, Button, Flex, IconButton, useToast } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import babyUsd from "@assets/buttons/babyUsd.png";
import { useAppSelector } from "@hooks";
// import Image from "@components/Common/Image";

export const Crowdsale = (props: any) => {
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
        <Box {...props} cursor={"pointer"} w={"40px"} h="40px">
            <Link href={"/Crowdsale1"} passHref>
                <a
                    onClick={() => {
                        // comingsoon();
                    }}
                >
                    <Image
                        src={babyUsd}
                        className={grayscaleMode === "gray" ? "grayscale" : ""}
                        // width={"40px"} height={"40px"}
                        alt="Crowdsale"
                    ></Image>
                </a>
            </Link>
        </Box>
    );
};