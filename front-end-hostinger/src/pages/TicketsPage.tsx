import { CalendarIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  HStack,
  Heading,
  Image,
  SimpleGrid,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../components/home.css";
import LoadingTicket from "../components/LoadingTicket";
interface dataEvent {
  _id: string;
  eventName: string;
  image: string;
  price: number;
  date: string;
  time: number;
  placeEvent: string;
  imageSeats: string;
}

function TicketsPage() {
  const { _id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [infoEvent, setInfoEvent] = useState<dataEvent>({
    _id: "",
    eventName: "",
    image: "",
    price: 0,
    date: "",
    time: 0,
    placeEvent: "",
    imageSeats: "",
  });

  const [infoTicket, setInfoTicket] = useState([
    { _id: "", price: "", seat: "", category: "" },
  ]);

  useEffect(() => {
    axios
      .get(`http://localhost:3336/event/id/${_id}`)
      .then((res) => {
        setInfoEvent(res.data);
      })
      .catch((err) => console.log(err));
  }, [_id]);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setLoading(true);
      axios
        .get(`http://localhost:3336/ticket/${_id}`, {
          headers: {
            "Content-Type": "application/json",
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          setLoading(false);
          console.log(res.data);
          setInfoTicket(res.data);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    } else {
      setLoading(true);
      axios
        .get(`http://localhost:3336/ticket/allticket/${_id}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          setLoading(false);
          console.log(res.data);
          setInfoTicket(res.data);
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
        });
    }
  }, [_id]);

  const toPayPage = (id: any) => {
    if (!localStorage.getItem("token") || id === "") {
      toast({
        colorScheme: "pink",
        position: "top",
        title: "يجب عليك اعادة تسجيل الدخول ",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      localStorage.clear();
      return navigate("/login");
    } else {
      navigate(`/paypage/${id}`);
    }
  };

  return (
    <Box
      backgroundColor={"#12132c"}
      color={"lavender"}
      minH={"90.2vh"}
      pb={"5px"}
    >
      <Heading textAlign={"right"} padding={"10px"}>
        تفاصيل الفعالية
      </Heading>
      <HStack
        justifyContent={"space-evenly"}
        mt={"10px"}
        marginBottom={"10px"}
        flexWrap={"wrap"}
        alignItems={"flex-start"}
      >
        <Box
          width={{ base: "300px", md: "500px" }}
          borderColor={"gray"}
          borderRadius={"3xl"}
          m={"5px"}
        >
          <Image
            loading="lazy"
            alt="picture"
            src={infoEvent.imageSeats}
            borderRadius={"3xl"}
            w={"full"}
            h={"300px"}
          />
        </Box>
        <Box
          m={"5px"}
          width={{ base: "300px", md: "500px" }}
          border={"1px"}
          borderColor={"gray"}
          borderTopLeftRadius={"3xl"}
          borderTopRightRadius={"3xl"}
        >
          <VStack>
            <Image
              loading="lazy"
              alt="picture"
              src={infoEvent.image}
              w={"full"}
              h={"300px"}
              borderTopLeftRadius={"3xl"}
              borderTopRightRadius={"3xl"}
            />
            <Text
              width={"full"}
              pr={"10px"}
              fontSize={"2xl"}
              textAlign={"right"}
            >
              {infoEvent.eventName}
            </Text>
            <HStack alignSelf={"flex-end"} pr={"5px"} p={"5px"}>
              <HStack borderRight={"1px"} pr={"10px"} borderColor={"gray"}>
                <Text fontSize={"2xl"} color={"gray"} textAlign={"right"}>
                  {infoEvent.date}
                </Text>
                <CalendarIcon color={"blue"} fontSize={"larger"} />
              </HStack>
              {/* <Divider border={"1px"} /> */}
              <HStack>
                <Text fontSize={"2xl"} color={"gray"} textAlign={"right"}>
                  {infoEvent.placeEvent}
                </Text>
                <i
                  className="fas fa-map-marker-alt"
                  style={{ color: "green", fontSize: "larger" }}
                ></i>
              </HStack>
            </HStack>
          </VStack>
        </Box>
      </HStack>
      {infoTicket.length === 0 ? (
        <Text textAlign={"center"} padding={"10px"} fontSize={"3xl"}>
          لا توجد تذاكر حاليا
        </Text>
      ) : (
        <Text textAlign={"right"} padding={"10px"} fontSize={"3xl"}>
          جميع التذاكر المتوفرة
        </Text>
      )}
      {infoTicket.length > 0 && loading ? (
        <Box textAlign={"center"}>
          <LoadingTicket />
        </Box>
      ) : (
        infoTicket.map((ticket) => {
          return (
            <SimpleGrid
              columns={5}
              key={ticket._id}
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
                justifyContent={"space-around"}
              >
                <Text color={"blue.400"} fontSize={"2xl"}>
                  السعر
                </Text>
                <Text>{ticket.price}</Text>
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
                <Text>{ticket.category}</Text>
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
                <Text>{ticket.seat}</Text>
              </VStack>
              <VStack
                justifyContent={"space-around"}
                h={"130px"}
                color={"white"}
                textAlign={"center"}
              >
                <Text color={"blue.400"} fontSize={"2xl"}>
                  شراء
                </Text>
                <Button
                  onClick={() => toPayPage(ticket._id)}
                  bg={"blue.400"}
                  color={"white"}
                  textAlign={"center"}
                  _hover={{
                    bg: "blue.500",
                  }}
                  className="font"
                  p={"5px"}
                  w={"90px"}
                >
                  شراء
                </Button>
              </VStack>
            </SimpleGrid>
          );
        })
      )}
    </Box>
  );
}

export default TicketsPage;

// <Box key={ticket._id}>
//                     <Divider />
//                     <HStack
//                       justifyContent={"space-around"}
//                       pt={"10px"}
//                       pb={"10px"}
//                       color={"lavender"}
//                     >
//                       <Button
//                         onClick={() => toPayPage(ticket._id)}
//                         bg={"blue.400"}
//                         color={"white"}
//                         textAlign={"center"}
//                         _hover={{
//                           bg: "blue.500",
//                         }}
//                         className="font"
//                         p={"1%"}
//                       >
//                         شراء
//                       </Button>
//                       <Text
//                         w={"10%"}
//                         fontSize={"large"}
//                         className="font"
//                         textAlign={"right"}
//                       >
//                         {ticket.price}
//                       </Text>
//                       <Text
//                         w={"10%"}
//                         fontSize={"large"}
//                         className="font"
//                         textAlign={"right"}
//                       >
//                         1
//                       </Text>
//                       <Text
//                         w={"10%"}
//                         fontSize={"large"}
//                         className="font"
//                         textAlign={"right"}
//                       >
//                         {ticket.seat}
//                       </Text>
//                       <Text
//                         w={"10%"}
//                         fontSize={"large"}
//                         className="font"
//                         textAlign={"right"}
//                       >
//                         {ticket.category}
//                       </Text>
//                     </HStack>
//                   </Box>
