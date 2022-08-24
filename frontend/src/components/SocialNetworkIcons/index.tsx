import React from "react";
import { Image, Box, Flex, Link, useColorMode } from "@chakra-ui/react";
import TwitterIcon from "../../assets/Twitter-1.png";
import TelegramIcon from "../../assets/Telegram-1.png";
// import RedditIcon from "../../assets/Reddit.png";
import EmailIcon from "../../assets/Email-1.png";
import InstagramIcon from "../../assets/icon_instagram_128x128.png";
import DiscordIcon from "../../assets/icon_discord_64px.png";
import NextLink from "next/link";
import { useAppSelector, useAppDispatch } from "@hooks";
function SocialNetworkIcons() {
  const grayscaleMode = useAppSelector((state: any) => state.grayscale.value);
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      w={["252px", "252px", "252px"]}
      h="64px"
      borderRadius="5px"
      backgroundColor={colorMode == "dark" ? "black" : "white"}
      p="4px"
      border={"1px"}
      borderColor={colorMode == "dark" ? "white" : "black"}
    >
      <Box
        backgroundColor={colorMode == "dark" ? "#5C5C5C" : "#E2E2E2"}
        h="54px"
        w={["242px", "242px", "242px"]}
        border={"1px"}

        borderColor={colorMode == "dark" ? "#5C5C5C" : "black"}
        borderRadius="5px"
        py={"6px"}
        px={"1px"}
      >
        <Flex>
          <NextLink href="https://discord.gg/XJzdsJZayH" passHref>
            <Link isExternal>
              <Image
                className={grayscaleMode === "gray" ? "grayscale" : ""}
                mx="6px"
                w="40px"
                h="40px"
                src={DiscordIcon.src}
                alt="Discord Icon"
                transitionTimingFunction="ease-in-out"
                _hover={{
                  transform: "scale(1.1)",
                  transitionDuration: "300ms",
                }}
              ></Image>
            </Link>
          </NextLink>
          <NextLink href="https://twitter.com/AppBabylonia" passHref>
            <Link isExternal>
              <Image
                className={grayscaleMode === "gray" ? "grayscale" : ""}
                mx="6px"
                w="40px"
                h="40px"
                src={TwitterIcon.src}
                alt="Twitter Icon"
                transitionTimingFunction="ease-in-out"
                _hover={{
                  transform: "scale(1.1)",
                  transitionDuration: "300ms",
                }}
              ></Image>
            </Link>
          </NextLink>
          <NextLink href="https://t.me/babyloniageneralchat" passHref>
            <Link isExternal>
              <Image
                className={grayscaleMode === "gray" ? "grayscale" : ""}
                mx="6px"
                w="40px"
                h="40px"
                src={TelegramIcon.src}
                alt="Telegram Icon"
                _hover={{
                  transform: "scale(1.1)",
                  transitionDuration: "300ms",
                }}
              ></Image>
            </Link>
          </NextLink>
          <NextLink href="https://www.instagram.com/appbabylonia/" passHref>
            <Link isExternal>
              <Image
                className={grayscaleMode === "gray" ? "grayscale" : ""}
                mx="6px"
                w="40px"
                h="40px"
                src={InstagramIcon.src}
                alt="Instagram Icon"
                _hover={{
                  transform: "scale(1.1)",
                  transitionDuration: "300ms",
                }}
              ></Image>
            </Link>
          </NextLink>
          <NextLink href="/EmailPage" passHref>
            <Link>
              <Image
                className={grayscaleMode === "gray" ? "grayscale" : ""}
                mx="6px"
                w="40px"
                h="40px"
                src={EmailIcon.src}
                alt="Email Icon"
                _hover={{
                  transform: "scale(1.1)",
                  transitionDuration: "300ms",
                }}
              ></Image>
            </Link>
          </NextLink>
        </Flex>
      </Box>
    </Box>
  );
}

export default SocialNetworkIcons;
