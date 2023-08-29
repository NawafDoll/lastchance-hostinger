import { CheckCircleIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";

function PurchaseConfirm({ boo, open, onClose }: any) {
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
        <ModalContent>
          <ModalHeader textAlign={"center"}>
            <CheckCircleIcon w={12} h={12} color="green" />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody textAlign={"center"}>
            <Text fontSize={"3xl"}>
              تم شراء التذكرة بنجاح سيتم ارسالها على ايميلك و ستكون معروضة في
              صفحتي
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}

export default PurchaseConfirm;
