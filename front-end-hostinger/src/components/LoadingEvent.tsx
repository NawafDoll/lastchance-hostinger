import { Skeleton, Stack } from "@chakra-ui/react";
import React from "react";

function LoadingEvent() {
  return (
    <Stack
      display={"flex"}
      width={"100%"}
      flexDirection={"row"}
      justifyContent={"space-around"}
      flexWrap={"wrap"}
      mt={"10px"}
    >
      <Skeleton mt={"7px"} height="280px" w={"350px"} borderRadius={"3xl"} />
      <Skeleton height="280px" w={"350px"} borderRadius={"3xl"} />
      <Skeleton height="280px" w={"350px"} borderRadius={"3xl"} />
    </Stack>
  );
}

export default LoadingEvent;
