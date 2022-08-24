import { Box, Menu, MenuButton, MenuDivider, MenuItem, MenuList, useColorMode, useColorModeValue, useDisclosure, useToast } from "@chakra-ui/react";
import Image from "next/image";
import SettingsIcon from "@assets/buttons/setting-gear.png";
import { useRouter } from "next/router";
import { useAppSelector } from "@hooks";
import useGrayScaleMode from "@hooks/useGrayScaleMode";
import { MdDarkMode } from "react-icons/md";
import { IoMdColorPalette } from "react-icons/io";
import SwitchToggle from "@components/Toggle";

export const SettingsButton = (props: any) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const textColor = useColorModeValue("gray.900", "gray.200");
  const textBNBColor = useColorModeValue("gray.900", "gray.300");
  const BtnBorderColor = useColorModeValue("teal.600", "gray.500");

  const bgColor = useColorModeValue("teal.500", "teal.800");
  const bgBtnColor = useColorModeValue("gray.100", "gray.800");
  const router = useRouter();
  const { colorMode, toggleColorMode } = useColorMode();

  const [grayscaleMode, setGrayscaleMode] = useGrayScaleMode();
  const { mode } = useAppSelector((state) => state.theme);

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

  const hover = {
    bg: "gray.300",
    color: "gray.700",
    borderRadius: "10px",
    px: "8px",
    mx: "5px",
    w: "96%",
  };

  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        w="40px"
        h="40px"
        aria-label="Setting Button"
        fontWeight="normal"
      >
        <Box {...props} cursor={'pointer'} w="40px" h="40px">
          <Image
            className={grayscaleMode === "gray" ? "grayscale" : ""}
            alt="Settings Button" src={SettingsIcon} width="40px" height="40px">
          </Image>
        </Box>
      </MenuButton>
      <MenuList
        zIndex={1400}
        borderRadius={"10px"}
        fontFamily={"Ropa Sans"}
        fontSize={18}
      >
        <MenuItem _hover={hover}>
          <SwitchToggle
            checked={grayscaleMode === "gray"}
            setChecked={(value: boolean) => setGrayscaleMode(value ? "gray" : "color")}
            label={"Grayscale Mode"}
            icon={<IoMdColorPalette size="30px" />}
          />
        </MenuItem>
        <MenuDivider borderColor="gray.400" />
        <MenuItem _hover={hover}>
          <SwitchToggle
            checked={colorMode === "dark"}
            setChecked={toggleColorMode}
            label={"Dark Mode"}
            icon={<MdDarkMode size="30px" />}
          />
        </MenuItem>
      </MenuList>
    </Menu>
  )
};
