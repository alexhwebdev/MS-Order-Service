import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import { httpLogger, HandleErrorWithLogger } from "./utils";
// import { MessageBroker } from "./utils/broker";
// import { Consumer, Producer } from "kafkajs";
import { InitializeBroker } from "./service/broker.service";

export const ExpressApp = async () => {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(httpLogger);

  // // 1st step: connect to the producer and consumer
  // const producer = await MessageBroker.connectProducer<Producer>();
  // producer.on("producer.connect", () => {
  //   console.log("express-app.ts - STEP 1 Producer connected");
  // });

  // const consumer = await MessageBroker.connectConsumer<Consumer>();
  // consumer.on("consumer.connect", () => {
  //   console.log("express-app.ts - STEP 2.2 Consumer connected");
  // });

  // // 2nd step: subscribe to the topic or publish the message
  // await MessageBroker.subscribe((message) => {
  //   console.log("****** STEP 6 Consumer received the message");
  //   console.log("****** STEP 6 Message received : message", message);
  // }, "OrderEvents");

  await InitializeBroker()

  app.use(cartRoutes);
  app.use(orderRoutes);

  app.use("/", (req: Request, res: Response, _: NextFunction) => {  // _ : used bc we will not be using 'next' function
    res.status(200).json({ message: "order_service express-app.ts up!" });
  });

  app.use(HandleErrorWithLogger);

  return app;
};
