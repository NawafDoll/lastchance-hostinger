import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import {
  ViewIcon,
  ViewOffIcon,
  WarningIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";
import { useState } from "react";
import React from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
interface userData {
  username: string;
  email: string;
  phone: string;
  password: string;
  rePassword: string;
}
function Signup() {
  const navigate = useNavigate();
  const toast = useToast();
  const [err, seterr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userData, setUserData] = useState<userData>({
    username: "",
    email: "",
    phone: "",
    password: "",
    rePassword: "",
  });
  const handlerSignup = () => {
    setLoading(true);
    axios
      .post("http://localhost:3336/user/register", userData)
      .then((res) => {
        toast({
          colorScheme: "pink",
          position: "top",
          title: res.data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setLoading(false);
        if (res.status >= 200 && res.status < 300) {
          navigate("/login");
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        seterr(err.response.data.message);
        // toast({
        //   colorScheme: "pink",
        //   position: "top",
        //   title: err.response.data.message,
        //   status: "error",
        //   duration: 3000,
        //   isClosable: true,
        // });
      });
  };
  const handlerChange = (e: any) => {
    let value = e.target.value;
    setUserData({ ...userData, [e.target.name]: value });
  };
  return (
    <Flex
      //   minH={"50vh"}
      position={"relative"}
      zIndex={2000000}
      top={"192px"}
      mt={"0"}
      height={"10vh"}
      align={"center"}
      justify={"center"}
      width={"400px"}
      //   bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack
        spacing={3}
        mx={"auto"}
        py={0}
        width={"100%"}
        ml={"10px"}
        mr={"10px"}
      >
        <Stack align={"center"}>
          <Heading color={"white"} fontSize={"4xl"} textAlign={"center"}>
            ...أهلا بك
          </Heading>
          {err ? (
            <HStack
              justifyContent={"space-around"}
              bg={"red.300"}
              w={"370px"}
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
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={3}
          backgroundColor={"whiteAlpha.100"}
          // backgroundColor={"transparent"}
          color={"white"}
          shadow={"dark-lg"}
        >
          <Stack spacing={2}>
            <HStack alignContent={"right"}>
              <FormControl id="username" isRequired>
                <FormLabel textAlign={"right"}>اسم المستخدم</FormLabel>
                <Input
                  type="text"
                  name="username"
                  value={userData.username}
                  onChange={handlerChange}
                  placeholder="MERN"
                />
              </FormControl>
            </HStack>
            <FormControl id="phone" isRequired>
              <FormLabel textAlign={"right"}>رقم الجوال</FormLabel>
              <Input
                type="text"
                name="phone"
                value={userData.phone}
                onChange={handlerChange}
                placeholder="05XXXXXXXX"
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel textAlign={"right"}>الايميل</FormLabel>
              <Input
                placeholder="XX@gmail.com"
                type="email"
                name="email"
                value={userData.email}
                onChange={handlerChange}
              />
            </FormControl>
            <HStack justifyContent={"space-around"}>
              <FormControl isRequired width={"150px"}>
                <FormLabel textAlign={"right"}>اعادة كلمة المرور</FormLabel>
                <InputGroup>
                  <Input
                    width={"150px"}
                    name="rePassword"
                    value={userData.rePassword}
                    type={showPassword ? "text" : "password"}
                    onChange={handlerChange}
                    placeholder="XXXXXXXX"
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

              <FormControl isRequired width={"150px"} textAlign={"right"}>
                <FormLabel textAlign={"right"}>كلمة المرور</FormLabel>
                <InputGroup>
                  <Input
                    placeholder="XXXXXXXX"
                    width={"150px"}
                    name="password"
                    value={userData.password}
                    type={showPassword ? "text" : "password"}
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
            </HStack>
            <Stack spacing={5} pt={2}>
              <Button
                isLoading={loading}
                onClick={handlerSignup}
                // loadingText="Submitting"
                size="lg"
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
              >
                تسجيل
              </Button>
            </Stack>
            <Stack pt={2} textAlign={"center"}>
              <Link to={"/login"}>
                <Text display={"inline"} color={"blue.400"} cursor={"pointer"}>
                  تسجيل دخول
                </Text>
              </Link>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
}

export default Signup;
