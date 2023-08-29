import { CheckCircleIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";

function LoadingProcess({ boo, onClose }: any) {
  const { onOpen } = useDisclosure();

  const OverlayOne = () => (
    <ModalOverlay
      bg="blackAlpha.200"
      backdropFilter="blur(10px) hue-rotate(90deg)"
    />
  );
  const [overlay, setOverlay] = useState(<OverlayOne />);
  return (
    <>
      <Modal
        isCentered
        isOpen={boo}
        onClose={onClose}
        onOverlayClick={onOpen}
        closeOnOverlayClick={onClose}
      >
        {overlay}
        <ModalContent bg={"transparent"} border={""}>
          <ModalBody textAlign={"center"}>
            <Spinner
              color="white"
              fontSize={"5xl"}
              fontWeight={"bold"}
              w={"100px"}
              h={"100px"}
            />
            <Text
              color={"white"}
              fontSize={"2xl"}
              mt={"5px"}
              fontWeight={"bold"}
            >
              {" "}
              ...جاري تنفيذ عملية الدفع
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default LoadingProcess;
