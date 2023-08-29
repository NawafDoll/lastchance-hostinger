import {
  Box,
  Button,
  Divider,
  HStack,
  Image,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";

function PageAdmin() {
  const [tickets, setTickets] = useState<any[] | any>([]);
  const fetchDataTicket = async () => {
    return await axios
      .get(`http://localhost:3336/ticket/all/admin`, {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        setTickets(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    fetchDataTicket();
  }, []);

  const handleMatched = (id: any) => {
    return axios
      .put(`http://localhost:3336/ticket/ismatched/admin/${id}`)
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Box backgroundColor={"#12132c"} h={"full"}>
      {tickets.map((ticket: any) => {
        return (
          <Box key={ticket._id} textAlign={"center"}>
            <HStack
              color={"white"}
              m={"5px"}
              p={"5px"}
              justifyContent={"space-evenly"}
            >
              <VStack>
                <Image
                  loading="lazy"
                  alt="picture"
                  src={`http://localhost:3336/${ticket.image}`}
                  width={"400px"}
                  height={"300px"}
                />
                <Text>{ticket.seat}</Text>
                <Text>{ticket.category}</Text>
                <Text>{ticket.price}</Text>
              </VStack>
              <VStack key={ticket.event._id}>
                <Image
                  loading="lazy"
                  alt="picture"
                  src={ticket.event.image}
                  width={"400px"}
                  height={"300px"}
                />
                <Text>{ticket.event.placeEvent}</Text>
                <Text>{ticket.event.nameEvent}</Text>
                <Text>{ticket.event.date}</Text>
              </VStack>
            </HStack>
            <Button onClick={() => handleMatched(ticket._id)}>متطابقة</Button>
            <Divider />
          </Box>
        );
      })}
    </Box>
  );
}

export default PageAdmin;
