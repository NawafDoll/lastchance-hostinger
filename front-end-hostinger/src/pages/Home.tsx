import { Box, Button, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../components/home.css";
import HomeHead from "../components/HomeHead";
import { UserContext } from "../components/ContextUser";
import LoadingEvent from "../components/LoadingEvent";

interface dataEvent {
  _id: string;
  nameEvent: string;
  image: string;
  price: number;
  date: string;
  time: number;
  placeEvent: string;
}
interface dataEventName {
  _id: string;
  nameEvent: string;
}
function Home() {
  const navigate = useNavigate();
  const { userInfo } = UserContext();
  const [price, setPrice] = useState();
  const [val, setVal] = useState<string>("");
  const [eventName, setEventName] = useState<dataEventName[]>([
    { _id: "", nameEvent: "" },
  ]);
  const [events, setEvents] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:3336/event")
      .then((res) => {
        setLoading(false);
        setEventName(res.data);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [events]);

  useEffect(() => {
    axios
      .get(`http://localhost:3336/event/search?nameEvent=${val}`)
      .then((res) => {
        setEvents(res.data);
      })
      .catch((err) => console.log(err));
  }, [val]);

  useEffect(() => {
    axios
      .delete("http://localhost:3336/event")
      .catch((err) => console.log(err));
  }, []);

  //if user click back after logIn
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      window.history.pushState(null, window.location.pathname);
      window.addEventListener("popstate", handlePopstate);
    }

    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, []);

  const handlePopstate = () => {
    window.history.pushState(null, window.location.pathname);
  };

  const pageSale = (id: any) => {
    const token = localStorage.getItem("token");
    if (!token) {
      return navigate("/login");
    }
    navigate(`/saleticket/${id}`);
  };
  useEffect(() => {
    setPrice(userInfo);
  }, [userInfo]);
  // console.log(eventName);
  return (
    <Box backgroundColor={"currentcolor"} h={"full"} minH={"150vh"}>
      <HomeHead
        eventName={eventName}
        handlerChange={(e: any) => setVal(e.target.value)}
        events={events}
      />

      {userInfo.isAdmin ? (
        <VStack>
          <Button onClick={() => navigate("/pageadmin")}>فحص التذاكر</Button>
          <Button onClick={() => navigate("/addevent")}>أضافة فعالية</Button>
        </VStack>
      ) : null}

      {loading ? (
        <LoadingEvent />
      ) : (
        <Flex justifyContent={"space-around"} flexWrap={"wrap"}>
          {events.map((event: any) => {
            // console.log(event.descEvent);
            return (
              <figure key={event._id}>
                <img src={event.image} alt="Events" loading="lazy" />
                <figcaption>
                  <div className="event-info">
                    <h1>{event.nameEvent}</h1>
                    <h3>{event.date}</h3>
                    <h3>
                      تبدأ أسعار التذاكر من
                      {Math.min(...event.descEvent.map((e: any) => e.price))}
                    </h3>
                    <h3> {event.placeEvent} :الموقع </h3>
                    <HStack justify={"center"} spacing={"12"}>
                      <Link to={`/ticketspage/${event._id}`}>
                        <Button
                          fontSize={"sm"}
                          fontWeight={600}
                          color={"white"}
                          bg={"pink.600"}
                          _hover={{
                            bg: "pink.800",
                          }}
                        >
                          شراء تذكرة
                        </Button>
                      </Link>
                      <Button
                        fontSize={"sm"}
                        fontWeight={600}
                        color={"white"}
                        bg={"pink.600"}
                        _hover={{
                          bg: "pink.800",
                        }}
                        onClick={() => pageSale(event._id)}
                      >
                        بيع تذكرتك
                      </Button>
                    </HStack>
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </Flex>
      )}
    </Box>
  );
}

export default Home;
