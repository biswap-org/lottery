import React, { useState, useEffect, useRef, FormEventHandler } from "react";
import {
  Select,
  Input,
  Button,
  Flex,
  Text,
  HStack,
  VStack,
  Textarea,
  useColorModeValue,
  FormControl,
  CloseButton,
} from "@chakra-ui/react";
import { useEthers } from "@usedapp/core";
import { Alert, AlertIcon, AlertTitle } from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import AlertPop from "../AlertPop";

import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha";

const alertMessage = {
  success: "Message was sent!",
  error: "Something went wrong",
};

const subjectOptions = {
  Partnering: "Partnering",
  Investment: "Investment",
  Complaint: "Complaint",
  Suggestion: "Suggestion",
  "Report Problem / Bug": "Report Problem / Bug",
  "Hiring / Jobs": "Hiring / Jobs",
  Others: "Others",
};

const GOOGLE_RECAPTCHA_SITE_KEY = (process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_SITE_KEY) as string;
const ContactForm = () => {
  const [verified, setVerified] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [selectedOption, setSelectedOption] = useState({
    value: subjectOptions.Partnering,
    label: subjectOptions.Partnering,
  });
  const timerId = useRef<NodeJS.Timeout | null>(null);
  const reRef = useRef<ReCAPTCHA>(null);

  const bgColor = useColorModeValue("gray.400", "gray.800");
  const bgInputBGColor = useColorModeValue("gray.100", "gray.800");
  const InputTextColor = useColorModeValue("gray.800", "gray.300");
  const bgInputPlaceHolderColor = useColorModeValue("gray.400", "gray.800");

  const { activateBrowserWallet, account } = useEthers();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [data, setData] = useState();
  const [subjectOther, setSubjectOther] = useState("");
  const toast = useToast();

  const reset = () => {
    setShowSuccess(false);
    setShowError(false);
  };

  const sendEmail: FormEventHandler = async (e) => {
    e.preventDefault();
    const token = await reRef.current?.executeAsync();
    setIsSending(true);

    if (timerId.current) {
      clearTimeout(timerId.current);
    }

    reset();

    const { name, email, subject, customSubject, message } = (e.target as any).elements ?? {};
    const currentSubject = selectedOption.value === subjectOptions.Others ? customSubject : subject;
    try {
      await fetch("/api/sendmail", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: email.value,
          subject: `${currentSubject.value} from ${name.value}`,
          message: message.value,
          token
        }),
      }).then(
        (response) => {
          // return response.json();
          if (response.status === 200) {
            setShowSuccess(true);
            reRef.current?.reset();
            timerId.current = setTimeout(() => {
              setIsSent(true);
              setShowSuccess(false);
            }, 5000);
          }

          if (response.status < 400) {
            setShowSuccess(true);
          } else {
            setShowError(true);
          }
        }
      );

    } catch (error) {
      setShowError(true);
    }
    setIsSending(false);
    timerId.current = setTimeout(() => {
      reset();
    }, 5000);
  };


  return (
    <Flex
      mt={["0px", "10px", "100px", "100px"]}
      pt={["10px", "10px", "10px", "10px"]}
      w={["95vw", "95vw", "50vw", "50vw", "35vw"]}
      // align="flex-start"
      bg={bgColor}
      borderRadius="15px"
      pb={["20px", "20px", "20px", "20px"]}
      mb={["20px", "20px", "20px", "20px"]}
      h={["full", "full", "full", "full"]}
      // alignItems="center"
      // justifyContent="center"
    >
      <VStack>
        <Text> Fill this form and submit your message :</Text>
        <FormControl
          as="form"
          onSubmit={sendEmail}
          isRequired
        >
          <Flex
            w={["95vw", "95vw", "50vw", "50vw", "35vw"]}
            justifyContent="center"
          >
            <VStack
              w={["90vw", "90vw", "47vw", "45vw", "32vw"]}
              bg="gray.600"
              // m="0"
              p={["2", "3", "3"]}
              borderRadius="15px"
              justifyContent="center"
            >
              <Input
                color="black"
                bg={bgInputBGColor}
                textColor={InputTextColor}
                type="text"
                fontFamily={'Ropa Sans'}
                placeholder="Name"
                {...register("name", {
                  required: "Enter your name",
                  minLength: 3,
                  maxLength: 80,
                })}
              />
              {errors.name && <AlertPop title={errors.name.message} />}

              <Input
                color="black"
                bg={bgInputBGColor}
                textColor={InputTextColor}
                fontFamily={'Ropa Sans'}
                type="email"
                placeholder="Email"
                {...register("email", {
                  required: "Enter your email",
                  minLength: 3,
                  maxLength: 100,
                })}
              />
              {errors.email && <AlertPop title={errors.email.message} />}

              <Select
                color="black"
                bg={bgInputBGColor}
                textColor={InputTextColor}
                placeholder="Select a subject"
                fontFamily={'Ropa Sans'}
                {...register("subject", {
                  required: "Select a subject",
                  minLength: 3,
                  maxLength: 100,
                })}
                onChange={(e) => {
                  setSubjectOther(e.target.value);
                }}
              >
                <option value="Partnering">Partnering</option>
                <option value="Investment">Investment</option>
                <option value="Complaint">Complaint</option>
                <option value="Suggestion">Suggestion</option>
                <option value="Report Problem / Bug">
                  Report Problem / Bug
                </option>
                <option value="Hiring / Jobs">Hiring / Jobs</option>
                <option value="Others">Others</option>
              </Select>
              {errors.Subject && subjectOther !== "Others" && (
                <AlertPop title={errors.Subject.message} />
              )}

              {subjectOther === "Others" && (
                <Input
                  color="black"
                  bg={bgInputBGColor}
                  textColor={InputTextColor}
                  type="text"
                  placeholder="Other Subject"
                  {...register("customSubject", {
                    required: "Enter a subject",
                    minLength: 3,
                    maxLength: 100,
                  })}
                />
              )}
              {errors.OtherSubject && subjectOther === "Others" && (
                <AlertPop title={errors.OtherSubject.message} />
              )}

              <Textarea
                color="black"
                bg={bgInputBGColor}
                textColor={InputTextColor}
                h="20px"
                fontFamily={'Ropa Sans'}
                placeholder="Message"
                {...register("message", {
                  required: "Enter your Message",
                  minLength: { value: 8, message: "Too short" },
                })}
              />
              {errors.Message && <AlertPop title={errors.Message.message} />}

              <HStack>
                <Button
                  type="submit"
                  disabled={isSent}
                  borderRadius="md"
                  bg="green.600"
                  _hover={{ bg: "cyan.200" }}
                  variant="ghost"
                >
                  Submit
                </Button>
                <Link href="" passHref>
                  <Button
                    borderRadius="md"
                    bg="teal.600"
                    _hover={{ bg: "teal.400" }}
                    variant="ghost"
                    onClick={() => {}}
                  >
                    close
                  </Button>
                </Link>
              </HStack>
              <ReCAPTCHA
                sitekey={GOOGLE_RECAPTCHA_SITE_KEY}
                size="invisible"
                ref={reRef}
              // onChange={onReCAPTCHAChange}
              />
              
            </VStack>
          </Flex>
        </FormControl>
        {(showSuccess || showError) && (
          <Alert
            position="fixed"
            bottom="0px"
            left="0px"
            status={showSuccess ? "success" : "error"}
            zIndex={300}
          >
            <AlertIcon />
            <AlertTitle mr={2}>
              {showSuccess ? alertMessage.success : alertMessage.error}
            </AlertTitle>
            <CloseButton position="absolute" right="8px" top="8px" />
          </Alert>
        )}
      </VStack>
    </Flex>
  );
}

export default ContactForm;
