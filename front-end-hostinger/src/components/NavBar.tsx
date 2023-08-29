import React, { useEffect } from "react";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import "./app.css";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./ContextUser";

function NavBar(props: any) {
  const { userInfo } = UserContext();
  const navigate = useNavigate();
  const [admin, setAdmin] = React.useState(false);
  const { isOpen, onToggle } = useDisclosure();
  const logout = () => {
    localStorage.clear();
    navigate("/login");
    // window.location.reload();
  };
  // React.useEffect(() => {
  //   axios
  //     .get("https://online-shop-mbej-p9jt.onrender.com/user", {
  //       headers: {
  //         authorization: "Bearer " + localStorage.getItem("token"),
  //       },
  //     })
  //     .then((res) => {
  //       setAdmin(res.data.isAdmin);
  //     });
  // });

  return (
    <Box
      className="nav"
      // backgroundColor={""}
      shadow={"dark-lg"}
      position={"relative"}
      zIndex={20000000}
    >
      <Flex
        //
        bg={useColorModeValue("blackAlpha.700", "gray.800")}
        color={useColorModeValue("gray.100", "white")}
        minH={"60px"}
        // py={{ base: 2 }}
        // px={{ base: 1 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("black", "gray.100")}
        align={"center"}
        justify={"space-around"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
            _hover={{ background: "pink.300" }}
          />
        </Flex>
        <Flex justifyContent={"center"} marginRight={"50"}>
          <Text
            display={"flex"}
            justifyContent={"center"}
            textAlign={"center"}
            fontFamily={"heading"}
            color={useColorModeValue("gray.100", "white")}
          >
            Logo
          </Text>
        </Flex>

        <Flex
          width={"500px"}
          justify={"space-between"}
          display={{ base: "none", md: "flex" }}
          mr={"2px"}
        >
          <Text className="btn-22">التواصل</Text>
          <Text className="btn-22">من نحن</Text>
          {!localStorage.getItem("token") ? (
            <Link to={"/login"}>
              <Text className="btn-22">صفحتي</Text>
            </Link>
          ) : (
            <Link to={`/pageuser/${userInfo.id}`}>
              <Text className="btn-22">صفحتي</Text>
            </Link>
          )}

          <Link to={"/"}>
            <Text className="btn-22">الرئيسية</Text>
          </Link>
        </Flex>
        {!localStorage.getItem("token") && (
          <Stack
            flex={{ base: 1, md: 0 }}
            justify={"flex-end"}
            direction={"row"}
            spacing={2}
          >
            <Link to={"/login"}>
              <Button
                fontSize={"sm"}
                fontWeight={600}
                color={"white"}
                bg={"pink.400"}
                _hover={{
                  bg: "pink.300",
                }}
              >
                تسجيل الدخول
              </Button>
            </Link>
            <Link to={"/signup"}>
              <Button
                fontSize={"sm"}
                fontWeight={600}
                color={"white"}
                bg={"pink.400"}
                _hover={{
                  bg: "pink.300",
                }}
              >
                التسجيل
              </Button>
            </Link>
          </Stack>
        )}
        {localStorage.getItem("token") && (
          <Stack
            flex={{ base: 1, md: 0 }}
            justify={"flex-end"}
            direction={"row"}
            spacing={2}
          >
            <Link to={"/login"}>
              <Button
                fontSize={"sm"}
                fontWeight={600}
                color={"white"}
                bg={"pink.400"}
                _hover={{
                  bg: "pink.300",
                }}
                onClick={logout}
              >
                خروج
              </Button>
            </Link>
          </Stack>
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <Box
        // position={"relative"}
        // zIndex={34343242343242423223233232}
        // zIndex={3434324234324242322323}
        // bg={useColorModeValue("white", "gray.800")}
        // bg={"black"}
        // p={0}
        // display={{ md: "none" }}
        // m={0}
        >
          <Link to={"/"}>
            <Text
              textAlign={"right"}
              cursor={"pointer"}
              // p={1.5}
              pr={"5px"}
              pt={"5px"}
              pb={"5px"}
              fontWeight={"bold"}
              _hover={{ backgroundColor: "gray.200" }}
            >
              الرئيسية
            </Text>
          </Link>
          <hr></hr>
          {!localStorage.getItem("token") ? (
            <Link to={`/login`}>
              <Text
                pr={"5px"}
                pt={"5px"}
                pb={"5px"}
                textAlign={"right"}
                cursor={"pointer"}
                fontWeight={"bold"}
                _hover={{ backgroundColor: "gray.200" }}
              >
                صفحتي
              </Text>
            </Link>
          ) : (
            <Link to={`/pageuser/${userInfo.id}`}>
              <Text
                pr={"5px"}
                pt={"5px"}
                pb={"5px"}
                textAlign={"right"}
                cursor={"pointer"}
                // p={1.5}
                fontWeight={"bold"}
                _hover={{ backgroundColor: "gray.200" }}
              >
                صفحتي
              </Text>
            </Link>
          )}

          <hr></hr>
          <Text
            pr={"5px"}
            pt={"5px"}
            pb={"5px"}
            cursor={"pointer"}
            textAlign={"right"}
            fontWeight={"bold"}
            _hover={{ backgroundColor: "gray.200" }}
          >
            تواصل معنا
          </Text>
          <hr></hr>
        </Box>
      </Collapse>
    </Box>
  );
}

export default React.memo(NavBar);
