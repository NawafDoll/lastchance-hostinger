import { CalendarIcon } from "@chakra-ui/icons";
import { Box, HStack, Heading, Image, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormSaleTicket from "../components/FormSaleTicket";
interface dataEvent {
  _id: string;
  eventName: string;
  image: string;
  price: string;
  date: string;
  time: number;
  placeEvent: string;
  imageSeats: string;
  descEvent: any;
}
function SaleTicket() {
  const { _id } = useParams();
  const [infoEvent, setInfoEvent] = useState<dataEvent>({
    _id: "",
    eventName: "",
    image: "",
    price: "",
    date: "",
    time: 0,
    placeEvent: "",
    imageSeats: "",
    descEvent: [{ price: "", category: "" }],
  });

  useEffect(() => {
    axios
      .get(`http://localhost:3336/event/id/${_id}`)
      .then((res) => {
        setInfoEvent(res.data);
      })
      .catch((err) => console.log(err));
  }, [_id]);

  return (
    <Box backgroundColor={"#12132c"} color={"lavender"}>
      <Heading textAlign={"right"} padding={"10px"}>
        تفاصيل الفعالية
      </Heading>
      <HStack
        justifyContent={"space-evenly"}
        m={"10px"}
        flexWrap={"wrap"}
        alignItems={"flex-start"}
      >
        <Box
          width={"500px"}
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
          width={"500px"}
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
      <Text textAlign={"right"} padding={"10px"} fontSize={"3xl"}>
        تفاصيل التذكرة
      </Text>
      <FormSaleTicket infoEvent={infoEvent} />
    </Box>
  );
}

export default SaleTicket;
