import { Skeleton, Stack } from "@chakra-ui/react";
import React from "react";

function LoadingTicket() {
  return (
    <Stack display={"flex"} width={"100%"} alignItems={"center"}>
      <Skeleton height="130px" w={"90%"} borderRadius={"3xl"} />
      <Skeleton height="130px" w={"90%"} borderRadius={"3xl"} />
      <Skeleton height="130px" w={"90%"} borderRadius={"3xl"} />
    </Stack>
  );
}

export default LoadingTicket;
