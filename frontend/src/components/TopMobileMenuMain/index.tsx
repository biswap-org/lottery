import {
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Stack,
  useDisclosure,
} from "@chakra-ui/react";
import BabyMenuTextItem from "../BabyMenuTextItem";
import InvestIcon from "../../assets/icon_invest_001_128x128.png";
import DashboardIcon from "../../assets/icons8-dashboard-60.png";
import AccountModal from "../AccountModal";
import { HiMenu as MenuIcon } from "react-icons/hi";
import { GrClose as CloseIcon } from "react-icons/gr";

import { useRef, useEffect, useState } from "react";
import BuyIcon from "../../assets/Icon_Buy_001_128x128.png";
import NetworksIcon from "../../assets/networks/online-security.png";
import { useAppDispatch, useAppSelector } from "@hooks";
import Link from "next/link";
import Image from "next/image";
import useGrayScaleMode from "@hooks/useGrayScaleMode";

const TopMobileMenuMain = (props: any) => {
  const btnRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const toggle = () => setIsToggleOpen(!isToggleOpen);
  const { mode } = useAppSelector((state) => state.theme);
  const dispatch = useAppDispatch();
  const [grayscaleMode, setGrayscaleMode] = useGrayScaleMode();

  const hover = {
    bg: "gray.300",
    color: "gray.700",
    borderRadius: "10px",
    px: "8px",
    mx: "5px",
    w: "96%",
  };

  return (
    <Menu>
      <Box
        display={{ base: "block", md: "block", xl: "none" }}
        onClick={toggle}
        pr="15px"
        h="50px"
      >
        <Button h="50px" borderRadius="15px" ref={btnRef} onClick={onOpen}>
          {isOpen ? <CloseIcon size="40px" /> : <MenuIcon size="40px" />}
        </Button>


        <MenuButton
          w="40px"
          h="40px"
          // icon={SettingsIcon.src}
          // borderRadius="10px"
          aria-label="Connect Button"
          fontWeight="normal"
        >
          <Box  {...props} cursor={'pointer'} w="40px" h="40px">
            <Image alt="Settings Button" src={NetworksIcon.src} width="40px" height="40px">
            </Image>
          </Box>
        </MenuButton>
        <MenuList
          zIndex={400}
          borderRadius={"10px"}
          fontFamily={"Ropa Sans"}
          fontSize={18}
          _hover={{
            transitionDuration: "100ms",
          }}
        >
          <MenuItem
            _hover={hover}
            onClick={() => {
              // onOpen();
              // comingsoon();
              setGrayscaleMode(
                grayscaleMode === "color" ? "gray" : "color"
              );
              if (grayscaleMode === "gray") {
                document.documentElement.style.setProperty(
                  "img",
                  `filter: grayscale(1)`
                );
              }

            }}
          >

          </MenuItem>
          <MenuDivider borderColor="gray.400" />
          <MenuItem
            _hover={hover}
            onClick={() => {
            }}
          >
          </MenuItem>
        </MenuList>
      </Box >
    </Menu>

  );
};

export default TopMobileMenuMain;
