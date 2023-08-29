import React from "react";
import {
  Box,
  Text,
  VStack,
  Image,
  HStack,
  Divider,
  Select,
} from "@chakra-ui/react";
import "./home.css";

function HomeHead({ eventName, handlerChange, events }: any) {
  return (
    // <Box>
    <Box
      bg={`rgba(60, 10, 88, 0.6)`}
      w={"100%"}
      h={"52vh"}
      display={"flex"}
      justifyContent={"space-between"}
    >
      <span style={{ background: "white" }}></span>
      <VStack
        className="headBox"
        textAlign={"center"}
        w={"70%"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Text
          textAlign={"center"}
          color={"white"}
          className="btn-shine"
          p={"3px"}
          fontSize={"2.6vw"}
        >
          عيش التجربة بأفضل ألاسعار
        </Text>
        <Select
          marginLeft={"5px"}
          className="shadwo"
          outline={"none"}
          border={"none"}
          _hover={{
            outline: "none",
            border: "none",
          }}
          outlineColor={"transparent"}
          onChange={handlerChange}
          w={"190px"}
          backgroundColor={"white"}
          placeholder="الفعاليات"
        >
          {eventName.map((event: any) => {
            return (
              <option key={event._id} value={event.nameEvent}>
                {event.nameEvent}
              </option>
            );
          })}
          <option value="all">الكل</option>
        </Select>
      </VStack>
      <Divider
        orientation="vertical"
        borderColor={"white"}
        borderStyle={"solid"}
      />
      <VStack
        w={"30%"}
        justifyContent={"start"}
        alignItems={"center"}
        overflow={"hidden"}
        className="eventBox "
        mb={"10px"}
        textAlign={"left"}
      >
        {events.map((e: any) => {
          return (
            <HStack
              bg={"blackAlpha.400"}
              p={"5px"}
              key={e._id}
              mt={"5px"}
              className="move"
              textAlign={"left"}
            >
              <Image src={e.image} w={"60%"} h={"120px"} />
              <Text
                color={"white"}
                textAlign={"left"}
                w={"100px"}
                fontSize={"2xs"}
                overflow={"hidden"}
                maxH={"50px"}
                whiteSpace={"break-spaces"}
                textUnderlineOffset={"auto"}
              >
                {e.nameEvent}
              </Text>
            </HStack>
          );
        })}
      </VStack>
    </Box>
  );
}

export default HomeHead;
