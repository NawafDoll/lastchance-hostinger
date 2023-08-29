import { CheckCircleIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";

function TicketConfirmation({ boo, open, onClose }: any) {
  const { onOpen } = useDisclosure();

  const OverlayOne = () => (
    <ModalOverlay
      bg="blackAlpha.200"
      backdropFilter="blur(10px) hue-rotate(90deg)"
    />
  );

  const OverlayTwo = () => (
    <ModalOverlay
      bg="none"
      backdropFilter="auto"
      backdropInvert="50%"
      backdropBlur="2px"
    />
  );
  const [overlay, setOverlay] = React.useState(<OverlayOne />);
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
        <ModalContent>
          <ModalHeader textAlign={"center"}>
            <CheckCircleIcon w={12} h={12} color="green" />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign={"center"}>
            <Text fontSize={"3xl"}>تم عرض تذكرتك للبيع بنجاح</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default TicketConfirmation;
