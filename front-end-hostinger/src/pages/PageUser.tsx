import {
  Box,
  Divider,
  Heading,
  Image,
  SimpleGrid,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { UserContext } from "../components/ContextUser";
import { useNavigate, useParams } from "react-router-dom";
import LoadingTicket from "../components/LoadingTicket";
import ConfirmDeleteTicket from "../components/ConfirmDeleteTicket";

interface dataOrder {
  _id: string;
  price: string;
  seat: string;
  image: string;
  category: string;
}
interface dataTicket {
  _id: string;
  price: string;
  seat: string;
  image: string;
  category: string;
  isSold: boolean;
}
function PageUser() {
  const navigate = useNavigate();
  const toast = useToast();
  const { userInfo } = UserContext();
  const { id } = useParams();
  const [order, setOrder] = useState<dataOrder[]>([
    { _id: "", price: "", seat: "", image: "", category: "" },
  ]);

  const [ticket, setTicket] = useState<dataTicket[]>([
    { _id: "", price: "", seat: "", image: "", category: "", isSold: false },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:3336/order/${id}`, {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setLoading(false);
        setOrder(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
      });
  }, [id]);

  const fetchTicket = async () => {
    setLoading(true);
    return await axios
      .get(`http://localhost:3336/ticket/user/${id}`, {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setLoading(false);
        setTicket(res.data);
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        localStorage.clear();
        toast({
          colorScheme: "pink",
          position: "top",
          title: "يجب عليك اعادة تسجيل الدخول ",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        navigate("/login");
      });
  };

  const handleDelete = async (id: any) => {
    return await axios
      .delete(`http://localhost:3336/ticket/delete/${id}`, {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        fetchTicket();
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchTicket();
  }, []);

  return (
    <Box
      backgroundColor={"#12132c"}
      color={"currentColor"}
      minH={"90.2vh"}
      p={"10px"}
    >
      <Heading textAlign={"right"} pr={"10px"} color={"white"} pt={"4px"}>
        {userInfo.username} أهلا بك{" "}
      </Heading>
      {order.length === 0 ? (
        <Text
          color={"white"}
          textAlign={"center"}
          fontSize={"2xl"}
          mt={"10px"}
          mb={"10px"}
        >
          لم تشتري اي تذكرة بعد
        </Text>
      ) : (
        <Text
          color={"white"}
          textAlign={"center"}
          fontSize={"2xl"}
          mt={"10px"}
          mb={"10px"}
        >
          التذاكر التي تم شراؤها
        </Text>
      )}

      {loading ? (
        <LoadingTicket />
      ) : (
        order.map((e: any) => {
          return (
            <SimpleGrid
              columns={{ sm: 4, md: 2 }}
              key={e._id}
              borderRadius={"3xl"}
              padding={"10px"}
              minChildWidth={"150px"}
              bg={"whiteAlpha.300"}
              m={"10px"}
              dir="rtl"
            >
              <VStack
                h={"130px"}
                color={"white"}
                justifyContent={"space-evenly"}
              >
                <Text color={"blue.400"} fontSize={"2xl"}>
                  صورة التذكرة
                </Text>
                <Image
                  w={"80px"}
                  h={"80px"}
                  loading="lazy"
                  alt="picture"
                  src={`http://localhost:3336/${e.image}`}
                />
              </VStack>
              <VStack
                justifyContent={"space-around"}
                h={"130px"}
                color={"white"}
                textAlign={"center"}
              >
                <Text color={"blue.400"} fontSize={"2xl"}>
                  الفئة
                </Text>
                <Text>{e.category}</Text>
              </VStack>
              <VStack
                justifyContent={"space-around"}
                h={"130px"}
                color={"white"}
                textAlign={"center"}
              >
                <Text color={"blue.400"} fontSize={"2xl"}>
                  المقعد
                </Text>
                <Text>{e.seat}</Text>
              </VStack>
              <VStack
                justifyContent={"space-around"}
                h={"130px"}
                color={"white"}
                textAlign={"center"}
              >
                <Text color={"blue.400"} fontSize={"2xl"}>
                  السعر
                </Text>
                <Text>{e.price}</Text>
              </VStack>
            </SimpleGrid>
          );
        })
      )}
      <Divider />
      {ticket.length === 0 ? (
        <Text
          mt={"10px"}
          mb={"10px"}
          color={"white"}
          textAlign={"center"}
          fontSize={"2xl"}
        >
          ليس لديك تذاكر تم عرضها للبيع
        </Text>
      ) : (
        <Text
          mt={"10px"}
          mb={"10px"}
          color={"white"}
          textAlign={"center"}
          fontSize={"2xl"}
        >
          التذاكر التي تم عرضها للبيع
        </Text>
      )}

      {loading ? (
        <LoadingTicket />
      ) : (
        ticket.map((e: any) => {
          return (
            <SimpleGrid
              dir="rtl"
              columns={5}
              key={e._id}
              borderRadius={"3xl"}
              padding={"10px"}
              minChildWidth={"150px"}
              bg={"whiteAlpha.300"}
              m={"10px"}
              // ml={"10px"}
            >
              <VStack
                h={"130px"}
                color={"white"}
                justifyContent={"space-evenly"}
              >
                <Text color={"blue.400"} fontSize={"2xl"}>
                  صورة التذكرة
                </Text>
                <Image
                  loading="lazy"
                  alt="picture"
                  w={"80px"}
                  h={"80px"}
                  src={`http://localhost:3336/${e.image}`}
                />
              </VStack>
              <VStack
                justifyContent={"space-around"}
                h={"130px"}
                color={"white"}
                textAlign={"center"}
              >
                <Text color={"blue.400"} fontSize={"2xl"}>
                  الفئة
                </Text>
                <Text>{e.category}</Text>
              </VStack>
              <VStack
                justifyContent={"space-around"}
                h={"130px"}
                color={"white"}
                textAlign={"center"}
              >
                <Text color={"blue.400"} fontSize={"2xl"}>
                  المقعد
                </Text>
                <Text>{e.seat}</Text>
              </VStack>
              <VStack
                justifyContent={"space-around"}
                h={"130px"}
                color={"white"}
                textAlign={"center"}
              >
                <Text color={"blue.400"} fontSize={"2xl"}>
                  السعر
                </Text>
                <Text>{e.price}</Text>
              </VStack>
              <VStack
                justifyContent={"space-around"}
                h={"130px"}
                color={"white"}
                textAlign={"center"}
              >
                <Text color={"blue.400"} fontSize={"2xl"}>
                  حالة التذكرة
                </Text>
                {e.isSold ? (
                  <Text>تم بيع التذكرة</Text>
                ) : (
                  <VStack>
                    <Text>لم يتم بيع التذكرة</Text>
                    {/* <Button
                      colorScheme="blue"
                      onClick={() => handleDelete(e._id)}
                    >
                      حذف التذكرة
                    </Button> */}
                    <ConfirmDeleteTicket id={e._id} funDelete={handleDelete} />
                  </VStack>
                )}
              </VStack>
            </SimpleGrid>
          );
        })
      )}
    </Box>
  );
}

export default PageUser;
