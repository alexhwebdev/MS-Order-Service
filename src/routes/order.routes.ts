import express, { NextFunction, Request, Response } from "express";
import { MessageBroker } from "../utils";
import { OrderEvent } from "../types";

const router = express.Router();

router.post(
  "/order",
  async (req: Request, res: Response, next: NextFunction) => {
    // res.status(200).json({ message: "Post Order"});
    // order create logic

    // 3rd step: publish the message
    console.log("order-routes.ts - STEP 3 Publish message");
    console.log("order-routes.ts - STEP 3 req.headers.authorization", req.headers.authorization);
    await MessageBroker.publish({
      topic: "OrderEvents",
      headers: { token: req.headers.authorization },
      event: OrderEvent.CREATE_ORDER,  // from : export enum OrderEvent { CREATE_ORDER = "create_order", CANCEL_ORDER = "cancel_order", }
      message: {
        orderId: 1,
        items: [
          {
            productId: 1,
            quantity: 1,
          },
          {
            productId: 2,
            quantity: 2,
          },
        ],
      },
    });
    res.status(200).json({ message: "create order" });
  }
);

router.get(
  "/order",
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: "Get All Orders"});
    // return res.status(200).json({ message: "create order" });
  }
);

router.get(
  "/order/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).json({ message: "Get Single Order"});
    // return res.status(200).json({ message: "create order" });
  }
);

router.delete(
  // "/order",
  "/order/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    // return res.status(200).json({ message: "create order" });
  }
);

export default router;
