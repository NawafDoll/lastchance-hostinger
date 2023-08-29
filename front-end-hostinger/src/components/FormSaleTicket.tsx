import { WarningIcon, WarningTwoIcon } from "@chakra-ui/icons";
import {
  Box,
  Text,
  Input,
  Select,
  Button,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Checkbox,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import jsQR from "jsqr";
import QRCodeReader from "jsqr";
import "./home.css";
import TicketConfirmation from "./TicketConfirmation";

function FormSaleTicket(props: any) {
  const navigate = useNavigate();
  const [agree, setAgree] = useState(false);
  const { _id } = useParams<string>();
  const [err, setErr] = useState<string>("");
  const [pcode, setPcode] = useState("");
  const [seat, setSeat] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<any>();
  const [category, setCategory] = useState("");

  const [loading, setLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  //check if image content on QR
  const handleChangeFile = (e: any) => {
    const file = e.target.files[0];
    setImage(e.target.files[0]);
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const image: HTMLImageElement = new Image();
        image.src = event.target?.result as string;
        image.onload = () => {
          const canvas: HTMLCanvasElement = document.createElement("canvas");
          const context: CanvasRenderingContext2D | null =
            canvas.getContext("2d");
          canvas.width = image.width;
          canvas.height = image.height;
          context?.drawImage(image, 0, 0, image.width, image.height);
          const imageData: ImageData = context?.getImageData(
            0,
            0,
            canvas.width,
            canvas.height
          ) as ImageData;
          const code: any =
            jsQR(imageData.data, imageData.width, imageData.height)?.data ||
            null;
          setPcode(code);
          const QRcode = QRCodeReader(
            imageData.data,
            canvas.width,
            canvas.height
          );
          console.log(QRcode);
        };
      };
      reader.readAsDataURL(file);
    }
  };

  //send ticket
  const postTicket = useCallback(
    (e: any) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("seat", seat);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("event_id", String(_id));
      formData.append(`image`, image);
      setLoading(true);
      if (!agree) {
        setLoading(false);
        return setErr("انت لم توافق على الشرط");
      }
      if (pcode === null) {
        setLoading(false);
        return setErr("الرجاء التأكد من الصورة المدخلة");
      }
      if (!localStorage.getItem("token")) return navigate("/login");

      axios
        .post("http://localhost:3336/ticket", formData, {
          headers: {
            authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
        .then((res) => {
          setErr("");
          onOpen();
          setSeat("");
          setCategory("");
          setAgree(false);
          setLoading(false);
          setTimeout(() => {
            onClose();
          }, 2500);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
          setErr(err.response.data.message);
        });
    },
    [_id, agree, category, image, navigate, onClose, onOpen, pcode, price, seat]
  );

  useEffect(() => {
    let searchIndex = props.infoEvent.descEvent.findIndex(
      (descEvent: any) => descEvent.category === category
    );
    if (searchIndex === -1) {
      searchIndex = 0;
    }
    setPrice(props.infoEvent.descEvent[searchIndex].price);
  }, [category, props.infoEvent.descEvent]);

  return (
    <HStack
      backgroundColor={"transparent"}
      justifyContent={"center"}
      pb={"10px"}
      flexWrap={"wrap"}
    >
      <VStack
        border={"1px"}
        color={"white"}
        w={"600px"}
        p={"10px"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
        spacing={8}
      >
        <HStack justifyContent={"right"} alignItems={"start"} fontSize={"1xl"}>
          <Text
            textAlign={"center"}
            color={agree ? "green.400" : "red"}
            fontSize={"1.4vw"}
            className="font"
          >
            أقر بأن التذاكر التي قمت بإضافتها لن يتم استخدامها او بيعها في مكان
            أخر وسيقوم موقعنا بإرسال التذاكر مباشرة للمشتري عند دفع قيمتها دون
            الحاجة لموافقة إضافية
          </Text>
          <Checkbox
            textAlign={"right"}
            colorScheme="green"
            isChecked={agree}
            onChange={(e: any) => setAgree(e.target.checked)}
            color={"green.400"}
          ></Checkbox>
        </HStack>
        <Text textAlign={"right"} fontSize={"1.4vw"} className="font">
          في حال لم يتم بيع التذكرة ورغبت باستخدامها اي وقت يمكنك الغاء تفعيل
          التذكرة عن طريق الدخول الى صفحتي ومن ثم النقر على حذف التذكرة
        </Text>
      </VStack>
      <VStack w={"600px"} fontSize={"large"} backgroundColor={"transparent"}>
        {err ? (
          <HStack
            mt={"5px"}
            justifyContent={"space-around"}
            bg={"red.300"}
            w={"290px"}
            spacing={5}
            borderRadius={"2xl"}
            p={"3px"}
            border={"1px solid red"}
          >
            <Box>
              <WarningIcon fontSize={"2xl"} color={"red"} />
            </Box>
            <Box>
              <Text dir="rtl" fontSize={"1xl"} color={"black"}>
                {err}
              </Text>
            </Box>
          </HStack>
        ) : (
          ""
        )}

        <form onSubmit={postTicket} encType="multipart/form-data">
          <VStack align={"right"} alignItems={"end"} mt={"5px"}>
            <Select
              textAlign={"center"}
              marginLeft={"5px"}
              className="shadwo"
              outline={""}
              outlineColor={"transparent"}
              onChange={(e) => setCategory(e.target.value)}
              w={"190px"}
              backgroundColor={"white"}
              placeholder="الفئة"
              color={"black"}
            >
              {props.infoEvent.descEvent.map((event: any, index: any) => {
                return (
                  <option key={index} value={event.category}>
                    {event.category}
                  </option>
                );
              })}
            </Select>
            <HStack spacing={"0"}>
              <Input
                p={"0"}
                pr={"5px"}
                border={"none"}
                textAlign={"right"}
                type="text"
                name="price"
                readOnly
                value={price}
                onChange={(e: any) => setPrice(e.target.value)}
              />
              <Text w={"150px"}> :سعر التذكرة</Text>
            </HStack>

            <FormControl isRequired>
              <FormLabel textAlign={"right"}>المقعد</FormLabel>
              <Input
                type="text"
                textAlign={"right"}
                name="seat"
                value={seat}
                onChange={(e) => setSeat(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel textAlign={"right"}>صورة التذكرة</FormLabel>
              <Input
                type="file"
                textAlign={"right"}
                name="image"
                placeholder=""
                onChange={handleChangeFile}
              />
            </FormControl>
            <Button
              isLoading={loading}
              type="submit"
              width={"full"}
              fontSize={"md"}
              fontWeight={600}
              color={"white"}
              bg={"blue.500"}
              _hover={{
                bg: "blue.400",
              }}
            >
              أرسال
            </Button>
            <TicketConfirmation boo={isOpen} onClose={onClose} />
          </VStack>
        </form>
      </VStack>
    </HStack>
  );
}

export default FormSaleTicket;
