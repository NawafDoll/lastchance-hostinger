import { Request, Response } from "express";
import axios from "axios";
import { order } from "../module/OrdersModule";
import * as paypal from "../Paypal-api";
import { ticket } from "../module/TicketModule";
import nodemailer from "nodemailer";
import { user } from "../module/UsersModule";
import path from "path";
import braintree from "braintree";
import "dotenv/config";

export const createOrder = async (req: Request, res: Response) => {
  try {
    const ticket_id = req.params.ticket_id;
    const priceTicket: any = await ticket.find({ _id: ticket_id });
    if (priceTicket[0].isSold === true) {
      return res
        .status(400)
        .json({ message: "هذه التذكرة تم بيعها ولم تعد متوفرة" });
    }
    const order = await paypal.createOrder(priceTicket);
    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};

export const captureOrder = async (req: Request, res: Response) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "nawaf.taalat.gpt@gmail.com",
        pass: process.env.PASS_EMAIL,
      },
    });
    const { orderID } = req.body;
    const ticket_id = req.params.ticket_id;
    const imageTicket: any = await ticket.findOne({ _id: ticket_id });
    if (imageTicket.isSold === true) {
      return res
        .status(400)
        .json({ message: "هذه التذكرة تم بيعها ولم تعد متوفرة" });
    }
    const captureData = await paypal.capturePayment(orderID);
    const newOrder = await order.create({
      orderID: req.body.orderID,
      userBuy_id: req.body.userBuy_id,
      userSell_id: imageTicket.user_id,
      ticket_id: imageTicket._id,
      price: imageTicket.price,
      seat: imageTicket.seat,
      image: imageTicket.image,
      category: imageTicket.category,
      isSold: true,
    });

    const findUser: any = await user.findOne({
      _id: imageTicket.user_id,
    });

    const mailOptions = {
      from: "Last Chance",
      to: findUser.email,
      subject: "صورة التذكرة",
      html: `
      <P>مرحبا</p>
      <img src="cid:ticketImage" alt="تذكرة الدعم الفني" >
      `,
      attachments: [
        {
          filename: `${imageTicket.image}`, // اسم الملف المرفق
          path: path.join(__dirname, `../../${imageTicket.image}`), // مسار الملف المرفق
          cid: "ticketImage", // معرف الصورة في نص HTML
        },
      ],
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);
      } else {
        return res.status(200).json({
          message: "أفحص بريدك الالكتروني",
          newOrder: newOrder,
          capture: captureData,
        });
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const userBuy_id = req.params.userBuy_id;
    const orders = await order.find({ userBuy_id: userBuy_id });
    if (orders) return res.status(200).json(orders);
  } catch (err) {
    console.log(err);
    return res.status(500).json("Server Error");
  }
};

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.MERCHANT_ID as string,
  publicKey: process.env.PUBLIC_KEY as string,
  privateKey: process.env.PRIVATE_KEY as string,
});

export const generateToken = async (req: Request, res: Response) => {
  gateway.clientToken
    .generate({})
    .then((response: any) => {
      res.status(200).send(response);
    })
    .catch((err: any) => {
      res.status(500).send(err);
    });
};

export const processPayment = async (req: Request, res: Response) => {
  const nonceFromTheClient = req.body.payment_method_nonce;
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "nawaf.taalat.gpt@gmail.com",
      pass: process.env.PASS_EMAIL,
    },
  });
  const ticket_id = req.params.ticket_id;
  const findTicket: any = await ticket.findOne({ _id: ticket_id });
  if (findTicket.isSold === true) {
    return res
      .status(400)
      .json({ message: "هذه التذكرة تم بيعها ولم تعد متوفرة" });
  }
  await order.create({
    orderID: req.body.orderID,
    userBuy_id: req.body.userBuy_id,
    userSell_id: findTicket.user_id,
    ticket_id: findTicket._id,
    price: findTicket.price,
    seat: findTicket.seat,
    image: findTicket.image,
    category: findTicket.category,
    isSold: true,
  });
  gateway.transaction
    .sale({
      amount: findTicket.price,
      paymentMethodNonce: nonceFromTheClient,
      // deviceData: deviceDataFromTheClient,
      options: {
        submitForSettlement: true,
      },
    })
    .then(async (response) => {
      const findUser: any = await user.findOne({
        _id: req.body.userBuy_id,
      });

      const mailOptions = {
        from: "Last Chance",
        to: findUser.email,
        subject: "صورة التذكرة",
        html: `
      <P>مرحبا</p>
      <img src="cid:ticketImage" alt="تذكرة الفعالية" width="200px" hieght="200px">
      `,
        attachments: [
          {
            filename: `${findTicket.image}`, // اسم الملف المرفق
            path: path.join(__dirname, `../../${findTicket.image}`), // مسار الملف المرفق
            cid: "ticketImage", // معرف الصورة في نص HTML
          },
        ],
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(err);
        } else {
          return res.status(200).send(response);
        }
      });
    })
    .catch((err) => res.status(500).send(err));
};
