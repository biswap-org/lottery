import React, { useState, useEffect } from "react";

import {
  Box,
  Flex,
  Image,
  Text,
  useDisclosure,
  useColorMode,
  useColorModeValue,
  SimpleGrid,
  Spacer,
} from "@chakra-ui/react";
import BigNumber from "bignumber.js";

import Babylonia_Logo from "../../assets/Babylonia_Logo.png";
import bnbJson from "../../babies/abis/ICO1M2-BNB.json";
import config from "../../config";

import polygonJson from "../../babies/abis/ICO1M2-POLYGON.json";
import fantomJson from "../../babies/abis/ICO1M2-FANTOM.json";
import { useEthers } from "@usedapp/core";

import { useAppSelector, useAppDispatch } from "@hooks";
import axios from "axios";
import Web3 from "web3";
declare const window: any;
const CrowdsaleStatus = () => {
  let web3 = new Web3();
  if (typeof window !== "undefined") {
    web3 = new Web3(window.ethereum);
  }

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { chainId, activateBrowserWallet, account } = useEthers();
  const grayscaleMode = useAppSelector((state: any) => state.grayscale.value);

  const textTitleColor = useColorModeValue("black", "gray.100");
  const textColor = useColorModeValue("black", "gray.200");
  const { colorMode, toggleColorMode } = useColorMode();

  const bgBoxColor = useColorModeValue("#E2E2E2", "FFFFFF");

  const [BnbPresaleBalance, setBnbPresaleBalance] = useState("");
  const [PolygonPresaleBalance, setPolygonPresaleBalance] = useState("");
  const [FantomPresaleBalance, setFantomPresaleBalance] = useState("");

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const crowdSaleDate = new Date("2022-08-15T00:00:00.000+01:00");
  crowdSaleDate.toLocaleString('en-US', { timeZone: 'Europe/Berlin' });

  const tick = () => {
    const totalSecondsLeft = +new Date(+crowdSaleDate - +new Date()) / 1000;
    const seconds = Math.floor(totalSecondsLeft) % 60;
    const minutes = Math.floor(totalSecondsLeft / 60) % 60;
    const hours = Math.floor(totalSecondsLeft / (60 * 60)) % 24;
    const days = Math.floor(totalSecondsLeft / (60 * 60 * 24));

    setTimeLeft({
      days,
      hours,
      minutes,
      seconds,
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      tick();
    }, 200);

    return () => {
      clearInterval(interval);
    };
  });

  const [maxSuply, setMaxSupply] = useState(88888888000000000000000000);

  let maxSup: any = "88888888000000000000000000";
  let convert = Web3.utils.fromWei(maxSup, "ether");
  useEffect(() => {
    getBnbBalance();
    getPolygonBalance();
    getFantomBalance();
  }, []);

  const [swapToken, setSwapToken] = useState({
    label: " BNB",
    abi: bnbJson as any,
    price: 30000,
  });

  const setNativeToken = () => {
    if (chainId == 250) {
      setSwapToken({
        label: "FANTOM",
        abi: fantomJson as any,
        price: 20,
      });
    } else
      if (chainId == 137) {
        setSwapToken({
          label: "MATIC",
          abi: polygonJson as any,
          price: 50,
        });
      } else
        if (chainId == 56) {
          setSwapToken({
            label: "BNB",
            abi: bnbJson as any,
            price: 25000,
          });
        }
  };

  const getTokenAddress = () => {
    if (chainId === 137) {
      return config.contractAddress.ICO1M2[137];
    } else
      if (chainId === 250) {
        return config.contractAddress.ICO1M2[250];
      } else
        return config.contractAddress.ICO1M2[56];
  }


  const ITokenContract = new web3.eth.Contract(
    swapToken.abi as any,
    getTokenAddress()
  );
  const tokenContract = {
    address: getTokenAddress(),
    abi: swapToken.abi,
    contract: ITokenContract,
    decimals: 18,
  };

  const getBnbBalance = async () => {
    axios
      .get(
        "https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=0xA4E26Bd6DCBa9021DCd3A1159BA52e97CD770b8a&address=0xa64535bDC9d1Ce6FA8b287e81214b51087549FC0&tag=latest&apikey=27HQEZQ7FUXC46A7W1KK4Y21QMP21IRK4S"
      )
      .then(function (response) {
        setBnbPresaleBalance(response.data.result);
      });
  };
  const getPolygonBalance = async () => {
    axios
      .get(
        "https://api.polygonscan.com/api?module=account&action=tokenbalance&contractaddress=0xA4E26Bd6DCBa9021DCd3A1159BA52e97CD770b8a&address=0xa64535bDC9d1Ce6FA8b287e81214b51087549FC0&tag=latest&apikey=DBID9B9I4BZITZ1SDE54V5U2JQJR2S3C5W"
      )
      .then(function (response) {
        setPolygonPresaleBalance(response.data.result);
      });
  };
  const getFantomBalance = async () => {
    axios
      .get(
        "https://api.ftmscan.com/api?module=account&action=tokenbalance&contractaddress=0xA4E26Bd6DCBa9021DCd3A1159BA52e97CD770b8a&address=0xa64535bDC9d1Ce6FA8b287e81214b51087549FC0&tag=latest&apikey=8U5KQNSDU6HE44XMV7SGD9UP6IKA7I7887"
      )
      .then(function (response) {
        setFantomPresaleBalance(response.data.result);
      });
  };
  const TolocalString = (val: any) => {
    let value = new BigNumber(convert).minus(Web3.utils.fromWei(val, "ether"));
    let totalString = value.toLocaleString();
    return parseFloat(totalString).toFixed(2);
  };
  const TotalSale = () => {
    let bnb = new BigNumber(convert).minus(
      Web3.utils.fromWei(BnbPresaleBalance, "ether")
    );
    let polygon = new BigNumber(convert).minus(
      Web3.utils.fromWei(PolygonPresaleBalance, "ether")
    );
    let fantom = new BigNumber(convert).minus(
      Web3.utils.fromWei(FantomPresaleBalance, "ether")
    );
    let totalString = bnb.plus(polygon).plus(fantom).toLocaleString();
    return parseFloat(totalString).toFixed(2);
  };
  const calculatePercentage = (val: any) => {
    let SoldBalance = new BigNumber(convert).minus(
      Web3.utils.fromWei(val, "ether")
    );
    let value = new BigNumber(SoldBalance).dividedBy(convert);
    let ValMultiplyBY100 = new BigNumber(value).multipliedBy(100);
    return parseFloat(ValMultiplyBY100.toString()).toFixed(2) + "%";
  };

  const TotalSalePercenTage = () => {
    let bnb = new BigNumber(convert).minus(
      Web3.utils.fromWei(BnbPresaleBalance, "ether")
    );
    let polygon = new BigNumber(convert).minus(
      Web3.utils.fromWei(PolygonPresaleBalance, "ether")
    );
    let fantom = new BigNumber(convert).minus(
      Web3.utils.fromWei(FantomPresaleBalance, "ether")
    );
    let TotalSale = bnb.plus(polygon).plus(fantom).toLocaleString();

    let totalSaleDivBy100 = new BigNumber(TotalSale).dividedBy(convert);
    let totalPercentageMultiplyBy100 = new BigNumber(
      totalSaleDivBy100
    ).multipliedBy(100);

    return parseFloat(totalPercentageMultiplyBy100.toString()).toFixed(2) + "%";
  };

  return (
    <Box
      className={grayscaleMode === "gray" ? "grayscale" : ""}
      p={"15px"}
      border="1px"
      borderRadius="10px"
      borderColor={colorMode === "dark" ? "black" : "textTitleColor"}
      bg={colorMode === "dark" ? "#5C5C5C" : bgBoxColor}
      minH={"462px"}
    >
      <Flex>
        <Box
          color={colorMode === "dark" ? "gray.100" : textTitleColor}
          fontSize="18px"
          pt={"8px"}
        >
          <Image
            src={Babylonia_Logo.src}
            className={grayscaleMode === "gray" ? "grayscale" : ""}
            alt="babylonia logo"
            width={"120px"}
            height={"45px"}
          />
        </Box>

        <Spacer />
      </Flex>
      <Text fontSize="24px">CROWDSALE #1 STATUS</Text>

      <Flex height="1"></Flex>
      <Box
        sx={{
          boxShadow: " 0px 4px 4px rgba(0, 0, 0, 0.25)",
        }}
        color={colorMode === "dark" ? "white" : textColor}
        id="BNB Field"
        height={"55px"}
        backgroundColor="white"
        bg={colorMode === "dark" ? "black" : "#F0B90B"}
        borderRadius="5"
        border="1px"
        display={"flex"}
      >
        <Flex width="35vw">
          <Text mt={3} mx="2" fontSize="18px">
            BNB CHAIN
          </Text>
        </Flex>
        <Flex width={"40vw"}>
          <Box
            height={"36px"}
            my={2}
            pt={1}
            px={0.5}
            borderColor="#8E8E8E"
            border={"1px"}
            bg="white"
            borderRadius={"5px"}
            width={"95px"}
          >
            <Text
              textAlign={"center"}
              color={colorMode === "dark" ? "black" : textColor}
              fontSize={"18px"}
            >
              {BnbPresaleBalance ? TolocalString(BnbPresaleBalance) : ""}
            </Text>
          </Box>
        </Flex>
        <Flex width={"30vw"}>
          <Box
            height={"36px"}
            my={2}
            px={0.5}
            borderColor="#8E8E8E"
            border={"1px"}
            bg="white"
            borderRadius={"5px"}
            width={"72px"}
          >
            <Text
              textAlign={"center"}
              color={colorMode === "dark" ? "black" : textColor}
              fontSize={"24px"}
            >
              {BnbPresaleBalance ? calculatePercentage(BnbPresaleBalance) : ""}
            </Text>
          </Box>
        </Flex>
      </Box>

      <Flex height="3.5"></Flex>
      <Box
        sx={{
          boxShadow: " 0px 4px 4px rgba(0, 0, 0, 0.25)",
        }}
        color={colorMode === "dark" ? "white" : textColor}
        id="BNB Field"
        height={"55px"}
        backgroundColor="white"
        bg={colorMode === "dark" ? "black" : "#B49EF2"}
        borderRadius="5"
        border="1px"
        display={"flex"}
      >
        <Flex width="35vw">
          <Text mt={3} mx="2" fontSize="18px">
            POLYGON
          </Text>
        </Flex>
        <Flex width={"40vw"}>
          <Box
            height={"36px"}
            my={2}
            pt={1}
            px={0.5}
            borderColor="#8E8E8E"
            border={"1px"}
            bg="white"
            borderRadius={"5px"}
            width={"95px"}
          >
            <Text
              textAlign={"center"}
              color={colorMode === "dark" ? "black" : textColor}
              fontSize={"18px"}
            >
              {PolygonPresaleBalance
                ? TolocalString(PolygonPresaleBalance)
                : ""}
            </Text>
          </Box>
        </Flex>
        <Flex width={"30vw"}>
          <Box
            height={"36px"}
            my={2}
            px={0.5}
            borderColor="#8E8E8E"
            border={"1px"}
            bg="white"
            borderRadius={"5px"}
            width={"72px"}
          >
            <Text
              textAlign={"center"}
              color={colorMode === "dark" ? "black" : textColor}
              fontSize={"24px"}
            >
              {PolygonPresaleBalance
                ? calculatePercentage(PolygonPresaleBalance)
                : ""}
            </Text>
          </Box>
        </Flex>
      </Box>
      <Flex height={"3.5"}></Flex>
      <Box
        sx={{
          boxShadow: " 0px 4px 4px rgba(0, 0, 0, 0.25)",
        }}
        color={colorMode === "dark" ? "white" : textColor}
        id="BNB Field"
        height={"55px"}
        backgroundColor="white"
        bg={colorMode === "dark" ? "black" : "#13B5EC"}
        borderRadius="5"
        border="1px"
        display={"flex"}
      >
        <Flex width="35vw">
          <Text mt={3} mx="2" fontSize="18px">
            FANTOM
          </Text>
        </Flex>
        <Flex width={"40vw"}>
          <Box
            height={"36px"}
            my={2}
            pt={1}
            px={0.5}
            borderColor="#8E8E8E"
            border={"1px"}
            bg="white"
            borderRadius={"5px"}
            width={"95px"}
          >
            <Text
              textAlign={"center"}
              color={colorMode === "dark" ? "black" : textColor}
              fontSize={"18px"}
            >
              {FantomPresaleBalance ? TolocalString(FantomPresaleBalance) : ""}
            </Text>
          </Box>
        </Flex>
        <Flex width={"30vw"}>
          <Box
            height={"36px"}
            my={2}
            px={0.5}
            borderColor="#8E8E8E"
            border={"1px"}
            bg="white"
            borderRadius={"5px"}
            width={"72px"}
          >
            <Text
              textAlign={"center"}
              color={colorMode === "dark" ? "black" : textColor}
              fontSize={"24px"}
            >
              {FantomPresaleBalance
                ? calculatePercentage(FantomPresaleBalance)
                : ""}
            </Text>
          </Box>
        </Flex>
      </Box>
      <Flex height={"3.5"}></Flex>
      <Box
        sx={{
          boxShadow: " 0px 4px 4px rgba(0, 0, 0, 0.25)",
        }}
        color={colorMode === "dark" ? "white" : "white"}
        id="BNB Field"
        height={"55px"}
        backgroundColor="white"
        bg={colorMode === "dark" ? "black" : "#000000"}
        borderRadius="5"
        display={"flex"}
      >
        <Flex width="35vw">
          <Text mt={3} mx="2" fontSize="18px">
            TOTAL
          </Text>
        </Flex>
        <Flex width={"40vw"}>
          <Box
            height={"36px"}
            my={2}
            pt={1}
            px={0.5}
            borderColor="#8E8E8E"
            border={"1px"}
            bg="white"
            color={"black"}
            borderRadius={"5px"}
            overflowY="scroll"
            width={"95px"}
          >
            <Text
              textAlign={"center"}
              color={colorMode === "dark" ? "black" : textColor}
              fontSize={"18px"}
            >
              {TotalSale() ? TotalSale() : ""}
            </Text>
          </Box>
        </Flex>
        <Flex width={"30vw"}>
          <Box
            height={"36px"}
            my={2}
            color={"black"}
            px={0.5}
            borderColor="#8E8E8E"
            border={"1px"}
            bg="white"
            borderRadius={"5px"}
            width={"72px"}
          >
            <Text textAlign={"center"} fontSize={"24px"}>
              {TotalSalePercenTage() ? TotalSalePercenTage() : ""}
            </Text>
          </Box>
        </Flex>
      </Box>
      <Flex height={"3.5"}></Flex>
      <Box
        sx={{
          boxShadow: " 0px 4px 4px rgba(0, 0, 0, 0.25)",
        }}
        color={colorMode === "dark" ? "white" : textColor}
        id="BNB Field"
        p="2.5"
        bg={colorMode === "dark" ? "black" : "#C5C5C5"}
        borderRadius="5"
        border="1px"
        display={"flex"}
      >
        <SimpleGrid columns={3} spacing={1}>
          <Box>
            <Flex>
              <Text fontSize={"12px"} mt={3} mr="2">
                Days{" "}
              </Text>
              <Text
                fontSize={"24px"}
                backgroundColor="white"
                width={"36px"}
                height={"36px"}
                px={1}
                borderRadius="5px"
                border={"1px"}
                borderColor={"#8E8E8E"}
                color={colorMode === "dark" ? "black" : textColor}
              >
                {timeLeft?.days}
              </Text>
            </Flex>
          </Box>
          <Box>
            <Flex>
              <Text fontSize={"12px"} mt={3} mr={2}>
                HOURS{" "}
              </Text>
              <Text
                fontSize={"24px"}
                backgroundColor="white"
                width={"36px"}
                height={"36px"}
                px={1}
                borderRadius="5px"
                border={"1px"}
                borderColor={"#8E8E8E"}
                color={colorMode === "dark" ? "black" : textColor}
              >
                {timeLeft?.hours}
              </Text>
            </Flex>
          </Box>
          <Box>
            <Flex justifyContent={"space-between"}>
              <Text fontSize={"12px"} mt={3} mr={2}>
                MINUTES{" "}
              </Text>
              <Text
                fontSize={"24px"}
                backgroundColor="white"
                width={"36px"}
                height={"36px"}
                px={1}
                borderRadius="5px"
                border={"1px"}
                borderColor={"#8E8E8E"}
                color={colorMode === "dark" ? "black" : textColor}
              >
                {timeLeft?.minutes}
              </Text>
            </Flex>
          </Box>
        </SimpleGrid>
      </Box>
    </Box>
  );
};

export default CrowdsaleStatus;
