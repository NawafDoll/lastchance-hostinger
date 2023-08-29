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
  useColorModeValue,
  Checkbox,
  useToast,
  InputRightElement,
  InputGroup,
  VStack,
  HStack,
} from "@chakra-ui/react";
import jwt, { JwtPayload } from "jwt-decode";
import { ViewIcon, ViewOffIcon, WarningIcon } from "@chakra-ui/icons";
import { WarningTwoIcon } from "@chakra-ui/icons";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { UserContext } from "../components/ContextUser";
interface UserData {
  email: string;
  password: string;
}
interface UserInfo {
  id: string;
  username: string;
  email: string;
}
function Login() {
  const navigate = useNavigate();
  const toast = useToast();
  const [err, seterr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setUserInfo } = UserContext();
  const [userData, setUserData] = useState<UserData>({
    email: "",
    password: "",
  });
  const login = async () => {
    setLoading(true);
    await axios
      .post("http://localhost:3336/user/login", {
        email: userData.email,
        password: userData.password,
      })
      .then(async (res) => {
        localStorage.setItem("token", res.data.token);
        const data = await res.data;
        setLoading(false);

        const tt: any = localStorage.getItem("token");
        if (res.status >= 200 || res.status < 300) {
          navigate("/");
          const decodeToken: any = jwt<JwtPayload>(tt);
          const { id, username, email } = decodeToken as UserInfo;
          setUserInfo({ id, username, email });
          return data;
        }
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        seterr(err.response.data.message);
      });
  };

  const handlerChange = (e: any) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  return (
    <Flex
      // minH={"100vh"}
      width={"500px"}
      align={"center"}
      justify={"center"}
      // bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"} position={"relative"} bottom={"60px"}>
          <Heading fontSize={"4xl"} color={"white"}>
            تسجيل الدخول
          </Heading>
          {err ? (
            <HStack
              justifyContent={"space-around"}
              bg={"red.300"}
              w={"270px"}
              spacing={5}
              borderRadius={"2xl"}
              p={"3px"}
              border={"1px solid red"}
            >
              <Box>
                <WarningIcon fontSize={"2xl"} color={"red"} />
              </Box>
              <Box>
                <Text dir="rtl" fontSize={"2xl"} color={"black"}>
                  {err}
                </Text>
              </Box>
            </HStack>
          ) : (
            ""
          )}

          {/* <Text
            color={"black"}
            fontSize={"2xl"}
            fontWeight={"bold"}
            bg={"red.400"}
            w={"250px"}
          >
            {err} {err !== "" ? <WarningTwoIcon color={"red"} /> : ""}
          </Text> */}
        </Stack>
        <Box
          backgroundColor={"whiteAlpha.100"}
          shadow={"dark-lg"}
          position={"relative"}
          zIndex={20000000}
          bottom={"80px"}
          rounded={"lg"}
          p={8}
        >
          <Stack
            spacing={4}
            color={"white"}
            backgroundColor={"transparent"}
            // shadow={"dark-lg"}
          >
            <FormControl isRequired id="email">
              <FormLabel textAlign={"right"}>الايميل</FormLabel>
              <Input
                placeholder="XX@hotmail.com"
                type="email"
                value={userData.email}
                name={"email"}
                onChange={handlerChange}
              />
            </FormControl>

            <FormControl isRequired id="password">
              <FormLabel textAlign={"right"}>كلمة المرور</FormLabel>
              <InputGroup>
                <Input
                  placeholder="XXXXXXXXX"
                  // type="password"
                  type={showPassword ? "text" : "password"}
                  value={userData.password}
                  name={"password"}
                  onChange={handlerChange}
                />
                <InputRightElement h={"full"}>
                  <Button
                    variant={"ghost"}
                    _hover={{
                      color: "black",
                      backgroundColor: "white",
                    }}
                    onClick={() =>
                      setShowPassword((showPassword) => !showPassword)
                    }
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
            <Stack spacing={10}>
              <Stack
                direction={{ base: "column", sm: "row" }}
                // align={"start"}
                justify={"right"}
              >
                <Link to={"/forgetpass"}>
                  <Text
                    cursor={"pointer"}
                    textAlign={"right"}
                    color={"blue.400"}
                  >
                    تغيير كلمة المرور؟
                  </Text>
                </Link>
              </Stack>
              <Button
                isLoading={loading}
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={login}
              >
                تسجيل دخول
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

export default Login;
