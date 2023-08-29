import { ViewIcon, ViewOffIcon, WarningTwoIcon } from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function EditPaa() {
  const navigate = useNavigate();
  const params = useParams();
  console.log(params.id);
  const [err, seterr] = useState("");
  const [pass, setPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const editPass = () => {
    axios
      .post(
        `http://localhost:3336/user/editpass/${params.id}/${params.token}`,
        { password: pass }
      )
      .then((res) => {
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
        seterr(err.response.data.message);
      });
  };
  return (
    <Flex
      width={"500px"}
      align={"center"}
      justify={"center"}
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
          <Text color={"red"} fontSize={"2xl"} fontWeight={"bold"}>
            {err} {err !== "" ? <WarningTwoIcon /> : ""}
          </Text>
        </Stack>
        <Box
          shadow={"dark-lg"}
          position={"relative"}
          zIndex={20000000}
          bottom={"50px"}
          rounded={"lg"}
          p={8}
        >
          <Stack
            spacing={4}
            color={"white"}
            backgroundColor={"transparent"}
          >
            <FormControl isRequired id="password">
              <FormLabel textAlign={"right"}>كلمة المرور الجديدة</FormLabel>
              <InputGroup>
                <Input
                  placeholder="XXXXXX"
                  type={showPassword ? "text" : "password"}
                  value={pass}
                  name={"password"}
                  onChange={(e) => setPass(e.target.value)}
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
              <Button
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={editPass}
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

export default EditPaa;
