import { CheckCircleIcon, WarningTwoIcon } from "@chakra-ui/icons";
import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
function ForgetPass() {
  const [err, seterr] = useState("");
  const [checkEmail, setCheckEmail] = useState("");
  const [wrong, setWrong] = useState(false);
  const [email, setEmail] = useState("");
  const reset = () => {
    axios
      .post("http://localhost:3336/user/resetpass", { email: email })
      .then((res) => {
        setWrong(false);
        setCheckEmail(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        setWrong(true);
        seterr(err.response.data.message);
      });
  };
  return (
    <Flex
      // minH={"100vh"}
      // backgroundColor={"#12132c"}
      width={"500px"}
      align={"center"}
      justify={"center"}
      // bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        spacing={8}
        mx={"auto"}
        maxW={"lg"}
        py={12}
        px={6}
        backgroundColor={"transparent"}
      >
        <Stack align={"center"} position={"relative"} bottom={"60px"}>
          <Heading fontSize={"4xl"} color={"white"}>
            تغيير كلمة المرور
          </Heading>
          {wrong ? (
            <Text color={"red"} fontSize={"2xl"} fontWeight={"bold"}>
              {err} {err !== "" ? <WarningTwoIcon /> : ""}
            </Text>
          ) : (
            <Text color={"green"} fontSize={"2xl"} fontWeight={"bold"}>
              {checkEmail} {checkEmail !== "" ? <CheckCircleIcon /> : ""}
            </Text>
          )}
        </Stack>
        <Box
          shadow={"dark-lg"}
          position={"relative"}
          zIndex={20000000}
          bottom={"50px"}
          rounded={"lg"}
          p={8}
        >
          <Stack spacing={4} color={"white"} backgroundColor={"transparent"}>
            <FormControl isRequired id="email">
              <FormLabel textAlign={"right"}>الايميل</FormLabel>
              <Input
                placeholder="XX@hotmail.com"
                type="email"
                value={email}
                name={"email"}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <Stack spacing={10}>
              <Button
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={reset}
              >
                ارسال
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

export default ForgetPass;
