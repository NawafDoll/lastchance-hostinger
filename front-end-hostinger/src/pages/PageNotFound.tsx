import { HStack, Heading } from "@chakra-ui/react";
import React from "react";

function PageNotFound() {
  return (
    <HStack justifyContent={"center"} alignItems={"center"} height={"100vh"}>
      <Heading>404 هذه الصفحة غير موجودة</Heading>
    </HStack>
  );
}

export default PageNotFound;
