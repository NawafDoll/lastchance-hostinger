import {
  Box,
  Button,
  Divider,
  Grid,
  GridItem,
  HStack,
  Heading,
  Image,
  Input,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FUNDING, PayPalButtons } from "@paypal/react-paypal-js";
import { UserContext } from "../components/ContextUser";
import { CalendarIcon } from "@chakra-ui/icons";
import PurchaseConfirm from "../components/PurchaseConfirm";
import DropIn, { IDropInProps } from "braintree-web-drop-in-react";
import useBraintreeDropin from "braintree-web-drop-in-react";
import LoadingProcess from "../components/LoadingProcess";
interface dataEvent {
  _id: string;
  eventName: string;
  image: string;
  price: number;
  date: string;
  time: number;
  placeEvent: string;
  imageSeats: string;
}
interface CustomBraintreeHooks {
  create: any; // استبدل "any" بنوع القيمة المتوقعة لـ "create"
  paypal: any; // استبدل "any" بنوع القيمة المتوقعة لـ "paypal"
}
interface dataTicket {
  _id: string;
  price: any;
  category: string;
  seat: string;
  user_id: string;
  event_id: string;
  isSold: boolean;
}
function PayPage() {
  const { userInfo } = UserContext();
  const { _id } = useParams();
  const [loading, setLoading] = useState(false);
  const [infoTicket, setInfoTicket] = useState<dataTicket>({
    _id: "",
    price: "",
    category: "",
    seat: "",
    user_id: "",
    event_id: "",
    isSold: false,
  });
  const [infoEvent, setInfoEvent] = useState<dataEvent>({
    _id: "",
    eventName: "",
    image: "",
    price: 0,
    date: "",
    time: 0,
    placeEvent: "",
    imageSeats: "",
  });
  const [values, setValues] = useState<any>({
    clientToken: null,
    success: "",
    error: "",
  });
  const [user, setUser] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();
  useEffect(() => {
    setUser(userInfo);
  }, [userInfo]);

  useEffect(() => {
    axios
      .get(`http://localhost:3336/ticket/ticketinfo/${_id}`, {
        headers: {
          authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((res) => {
        // console.log(res.data);
        const data = res.data;
        setInfoTicket(data);
      })
      .catch((err) => {
        console.log(err);

        localStorage.clear();
        toast({
          colorScheme: "pink",
          position: "top",
          title: "يجب عليك اعادة تسجيل الدخول ",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return navigate("/login");
      });
  }, [_id]);

  useEffect(() => {
    axios
      .get(`http://localhost:3336/event/id/${infoTicket.event_id}`)
      .then(async (res) => {
        const data = await res.data;
        console.log(data);
        setInfoEvent(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [infoTicket]);
  // console.log(infoEvent);
  const getToken = () => {
    return fetch(`http://localhost:3336/order/generate/token`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res: any) => {
        //
        return res.json();
      })
      .catch((err) => {
        console.log(err);
        localStorage.clear();
        toast({
          colorScheme: "pink",
          position: "top",
          title: "يجب عليك اعادة تسجيل الدخول ",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return navigate("/login");
      });
  };

  useEffect(() => {
    getToken()
      .then((res) => setValues({ ...values, clientToken: res.clientToken }))
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // console.log(values);
  // useEffect(() => {
  //   if (values.) {
  //   }
  // }, []);

  function makePayment(data: any) {
    return fetch(`http://localhost:3336/order/payment/${_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(data),
    })
      .then((res) => {
        if (
          (res.status >= 400 && res.status < 500) ||
          infoTicket.isSold === true
        ) {
          return toast({
            title: "نعتذر منك تم شراء التذكرة من قبل مستخدم اخر",
            status: "warning",
            duration: 3000,
            position: "bottom",
            colorScheme: "pink",
            isClosable: true,
          });
        } else {
          return res.json();
        }
      })
      .catch((err) => {
        setLoading(false);
        // console.log(err);
      });
  }

  const onPurchase = () => {
    if (infoTicket.isSold === true) {
      return toast({
        title: "نعتذر منك تم شراء التذكرة من قبل مستخدم اخر",
        status: "warning",
        duration: 3000,
        position: "top",
        colorScheme: "pink",
        isClosable: true,
      });
    }
    setLoading(true);
    return values.instance
      .requestPaymentMethod()
      .then((data: any) => {
        let nonce = data.nonce;
        let paymentData = {
          payment_method_nonce: nonce,
          userBuy_id: userInfo.id,
          orderID: nonce,
        };

        makePayment(paymentData)
          .then(async (res: any) => {
            console.log(res.status);
            setLoading(false);
            if (res.err) {
              console.log(res);
              setLoading(false);
              setValues({ ...values, error: res.err });
            } else if (res.success) {
              await axios.put(`http://localhost:3336/ticket/purchase/${_id}`);
              setValues({
                ...values,
                error: "",
                success: res.success,
              });

              onOpen();
              setTimeout(() => {
                onClose();
              }, 5000);
            } else {
              console.log(res);
              setLoading(false);
              return toast({
                title: "لم تتم عملية الشراء بسبب مشكلة ما",
                status: "warning",
                duration: 3000,
                position: "bottom",
                colorScheme: "pink",
                isClosable: true,
              });
            }
          })
          .catch((err) => {
            setLoading(false);
            setValues({ ...values, error: err, success: "" });
          });
      })
      .catch((err: any) => {
        setLoading(false);
        toast({
          title: "الرجاء تعبئة حقول البطاقة و التأكد من معلومات البطاقة",
          status: "warning",
          duration: 3000,
          position: "top",
          colorScheme: "pink",
          isClosable: true,
        });
        console.log(err);
      });
  };

  return (
    <Box backgroundColor={"#12132c"} color={"lavender"} minH={"90.2vh"}>
      <Heading textAlign={"right"} padding={"10px"}>
        تفاصيل الدفع
      </Heading>
      <HStack
        justifyContent={"space-evenly"}
        mt={"10px"}
        marginBottom={"10px"}
        flexWrap={"wrap"}
        alignItems={"flex-start"}
      >
        <Box
          m={"5px"}
          width={{ base: "300px", md: "500px" }}
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
              {/* <Divider border={"1px"} /> */}
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

        <VStack
          width={{ base: "300px", md: "500px" }}
          borderColor={"gray"}
          borderRadius={"3xl"}
          pr={"5px"}
          // border={"1px solid"}
          display={"flex"}
          justifyContent={"canter"}
          alignItems={"center"}
        >
          <HStack
            border={"1px solid white"}
            w={"100%"}
            padding={"10px"}
            justifyContent={"space-around"}
            alignItems={"center"}
          >
            <HStack>
              <Text
                //   w={"10%"}
                textAlign={"right"}
                color={"white"}
                fontSize={{ base: "sm", md: "2xl" }}
                // className="font"
              >
                {infoTicket.price}
              </Text>
              <Text
                //   w={"10%"}
                textAlign={"right"}
                color={"blue.400"}
                fontSize={{ base: "sm", md: "2xl" }}
                // className="font"
              >
                :السعر
              </Text>
            </HStack>
            <HStack>
              <Text
                //   w={"10%"}
                textAlign={"center"}
                color={"white"}
                fontSize={{ base: "sm", md: "2xl" }}
                // className="font"
              >
                1
              </Text>
              <Text
                //   w={"10%"}
                textAlign={"center"}
                color={"blue.400"}
                fontSize={{ base: "sm", md: "2xl" }}
                // className="font"
              >
                :التذاكر
              </Text>
            </HStack>
            <HStack>
              <Text
                //   w={"10%"}
                textAlign={"center"}
                color={"white"}
                fontSize={{ base: "sm", md: "2xl" }}
                // className="font"
              >
                {infoTicket.seat}
              </Text>
              <Text
                //   w={"10%"}
                textAlign={"center"}
                color={"blue.400"}
                fontSize={{ base: "sm", md: "2xl" }}
                // className="font"
              >
                :المقعد
              </Text>
            </HStack>
            <HStack>
              <Text
                //   w={"10%"}
                textAlign={"center"}
                color={"white"}
                fontSize={{ base: "sm", md: "2xl" }}
                // className="font"
              >
                {infoTicket.category}
              </Text>
              <Text
                //   w={"10%"}
                textAlign={"center"}
                color={"blue.400"}
                fontSize={{ base: "sm", md: "2xl" }}
                // className="font"
              >
                :الفئة
              </Text>
            </HStack>
          </HStack>
          <Box>
            {!values.clientToken && <Text>Loading...</Text>}
            {values.clientToken && (
              <Box textAlign={"center"}>
                <DropIn
                  options={{
                    authorization: values.clientToken,

                    // paypal: {
                    //   flow: "vault",
                    // },
                  }}
                  onInstance={(instance) =>
                    setValues({ ...values, instance: instance })
                  }
                />

                <Button
                  mt={"5px"}
                  width={"50%"}
                  colorScheme="blue"
                  onClick={() => onPurchase()}
                  textAlign={"center"}
                >
                  شراء
                </Button>
              </Box>
            )}
          </Box>
        </VStack>
      </HStack>
      <HStack
        justifyContent={"space-around"}
        alignContent={"center"}
        w={"100%"}
      ></HStack>
      <PurchaseConfirm boo={isOpen} onClose={onClose} />
      {loading ? <LoadingProcess boo={true} /> : null}
    </Box>
  );
}

export default PayPage;

function requestPaymentMethod() {
  throw new Error("Function not implemented.");
}
// const createOrder = (data: any) => {
//   // Order is created on the server and the order id is returned
//   return fetch(`http://localhost:3336/order/createOrder/${_id}`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       authorization: "Bearer " + localStorage.getItem("token"),
//     },
//     // use the "body" param to optionally pass additional order information
//     // like product skus and quantities
//     body: JSON.stringify({
//       product: {
//         price: infoTicket.price,
//       },
//     }),
//   })
//     .then((response) => {
//       if (response.status === 400 && response.status < 500) {
//         return toast({
//           title: "نعتذر منك تم شراء التذكرة من قبل مستخدم اخر",
//           status: "warning",
//           position: "bottom",
//           colorScheme: "pink",
//           isClosable: true,
//         });
//       }
//       return response.json();
//     })
//     .then((order: any) => order.id)
//     .catch((err) => {
//       console.log(err);
//       toast({
//         title: "حدث الصفحة او قم بأعادة تسجيل الدخول",
//         status: "warning",
//         position: "bottom-left",
//         colorScheme: "pink",
//         isClosable: true,
//       });
//     });
// };
// const onApprove = async (data: any) => {
//   // Order is captured on the server and the response is returned to the browser
//   try {
//     const response = await fetch(
//       `http://localhost:3336/order/captuerOrder/${_id}`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           authorization: "Bearer " + localStorage.getItem("token"),
//         },
//         body: JSON.stringify({
//           orderID: data.orderID,
//           price: infoTicket.price,
//           ticket_id: infoTicket._id,
//           userBuy_id: userInfo.id,
//           userSell_id: infoTicket.user_id,
//           category: infoTicket.category,
//           seat: infoTicket.seat,
//         }),
//       }
//     );
//     if (response.status >= 400 && response.status < 500) {
//       window.close();
//       // return alert("للأسف تم شراء التذكرة من قبل مستخ");
//       toast({
//         title: "نعتذر منك تم شراء التذكرة من قبل مستخدم اخر",
//         status: "warning",
//         position: "bottom",
//         colorScheme: "pink",
//         isClosable: true,
//       });
//     }
//     await axios.put(`http://localhost:3336/ticket/purchase/${_id}`);

//     onOpen();
//     setTimeout(() => {
//       onClose();
//     }, 5000);

//     return await response.json();
//   } catch (err) {
//     toast({
//       title: "حدث الصفحة او قم بأعادة تسجيل الدخول",
//       status: "warning",
//       position: "bottom-left",
//       colorScheme: "pink",
//       isClosable: true,
//     });
//   }
// };
// const onError = (error: any) => {
//   // عرض الخطأ الذي حدث
//   console.log(error);
//   window.close();
// };
