import { Box, Button, HStack, Input, Text, VStack } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";

function AddEvent() {
  const [descEvent, setDescEvent] = useState<any[]>([
    { num: 1, price: "", category: "" },
  ]);
  const [dataEvent, setDataEvent] = useState<any>({
    nameEvent: "",
    date: "",
    time: "",
    image: "",
    imageSeats: "",
    placeEvent: "",
    descEvent: descEvent,
  });
  const handlePost = async () => {
    return await axios
      .post("http://localhost:3336/event", dataEvent)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  };
  function handleInputChange(event: any) {
    const newLength = parseInt(event.target.value, 10) || 0; // ضمان أنها رقم صحيح
    const newItems: any = Array.from({ length: newLength }, (_, index) => ({
      num: index + 1,
      price: "", // قم بتعديل القيمة حسب احتياجك
      category: "", // قم بتعديل القيمة حسب احتياجك
    }));
    setDescEvent(newItems);
  }
  const handlerChangeDataEvent = (e: any) => {
    let value = e.target.value;
    setDataEvent({ ...dataEvent, [e.target.name]: value });
  };

  function handlePriceChange(index: any, value: any) {
    const updatedArray = [...descEvent]; // نسخ المصفوفة
    updatedArray[index].price = value; // تحديث القيمة في الكائن
    setDescEvent(updatedArray); // تحديث الحالة
    setDataEvent({ ...dataEvent, descEvent: descEvent });
  }

  function handleCategoryChange(index: any, value: any) {
    const updatedArray = [...descEvent]; // نسخ المصفوفة
    updatedArray[index].category = value; // تحديث القيمة في الكائن
    setDescEvent(updatedArray); // تحديث الحالة
    setDataEvent({ ...dataEvent, descEvent: descEvent });
  }
  // const handleAdd = () => {
  //   setDataEvent({ ...dataEvent, descEvent: descEvent });
  // };
  console.log(dataEvent);
  return (
    <Box backgroundColor={"#12132c"} h={"full"} padding={"10px"}>
      <VStack color={"white"}>
        <VStack>
          <Text>اسم الفعالية</Text>
          <Input
            placeholder="اسم الفعالية"
            name="nameEvent"
            value={dataEvent.nameEvent}
            onChange={handlerChangeDataEvent}
          />
        </VStack>
        <VStack>
          <label>صورة الفعالية</label>
          <Input
            placeholder="اسم الفعالية"
            name="image"
            value={dataEvent.image}
            onChange={handlerChangeDataEvent}
          />
        </VStack>
        <VStack>
          <label>تاريخ الفعالية</label>
          <Input
            placeholder="اسم الفعالية"
            name="date"
            value={dataEvent.date}
            onChange={handlerChangeDataEvent}
          />
        </VStack>
        <VStack>
          <label>وقت الفعالية</label>
          <Input
            placeholder="اسم الفعالية"
            name="time"
            value={dataEvent.time}
            onChange={handlerChangeDataEvent}
          />
        </VStack>
        <VStack>
          <label>موقع الفعالية</label>
          <Input
            placeholder="اسم الفعالية"
            name="placeEvent"
            value={dataEvent.placeEvent}
            onChange={handlerChangeDataEvent}
          />
        </VStack>
        <VStack>
          <label>صورة مقاعد الفعالية</label>
          <Input
            placeholder="اسم الفعالية"
            name="imageSeats"
            value={dataEvent.imageSeats}
            onChange={handlerChangeDataEvent}
          />
        </VStack>
        <HStack>
          <Text>فئة و سعر التذكرة</Text>
          <Input
            width={"50px"}
            type="number"
            value={descEvent.length}
            onChange={handleInputChange}
          />
        </HStack>
        {descEvent.map((e: any) => {
          return (
            <VStack key={e.num}>
              <Text>{e.num}</Text>
              <Input
                color={"white"}
                type="text"
                placeholder="سعر التذكرة"
                name="price"
                value={e.price}
                onChange={(ele) =>
                  handlePriceChange(e.num - 1, ele.target.value)
                }
              />
              <Input
                placeholder="فئة التذكرة"
                name="category"
                value={e.category}
                onChange={(ele) =>
                  handleCategoryChange(e.num - 1, ele.target.value)
                }
              />
            </VStack>
          );
        })}
        {/* <Button onClick={handleAdd} colorScheme="blue">
          {" "}
          add
        </Button> */}
        <Button onClick={handlePost} colorScheme="blue">
          اضافة
        </Button>
      </VStack>
    </Box>
  );
}

export default AddEvent;
