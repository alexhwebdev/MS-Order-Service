import express, { NextFunction, Request, Response } from "express";
// import { MessageBroker } from "../utils";
import { 
  // OrderEvent, 
  OrderStatus 
} from "../types";
import { RequestAuthorizer } from "./middleware";
import * as service from "../service/order.service";
import { OrderRepository } from "../repository/order.repository";
import { CartRepository } from "../repository/cart.repository";


const repo = OrderRepository;
const cartRepo = CartRepository;
const router = express.Router();

router.post(
  "/order",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    // order create logic
    const user = req.user;
    console.log('ORDER_SERVICE routes : Post /order - user ', user)
    if (!user) {
      next(new Error("User not found"));
      return;
    }
    const response = await service.CreateOrder(
      user.id, repo, cartRepo
    );
    console.log('ORDER_SERVICE routes : Post /order - response ', response)
    // return res.status(200).json(response);
    res.status(200).json(response);

    // 3rd step: publish the message
    // console.log("order-routes.ts - STEP 3 Publish message");
    // console.log("order-routes.ts - STEP 3 req.headers.authorization", req.headers.authorization);
    // await MessageBroker.publish({
    //   topic: "
    // s",
    //   headers: { token: req.headers.authorization },
    //   event: 
    // .CREATE_ORDER,  // from : export enum 
    //  { CREATE_ORDER = "create_order", CANCEL_ORDER = "cancel_order", }
    //   message: {
    //     orderId: 1,
    //     items: [
    //       { productId: 1, quantity: 1 },
    //       { productId: 2, quantity: 2 },
    //     ],
    //   },
    // });
    // res.status(200).json({ message: "create order" });
  }
);

router.get(
  "/orders",
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      next(new Error("User not found"));
      return;
    }
    const response = await service.GetOrders(user.id, repo);
    // return res.status(200).json(response);
    res.status(200).json(response);
  }
);

router.get(
  "/orders/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      next(new Error("User not found"));
      return;
    }
    const response = await service.GetOrder(user.id, repo);
    // return res.status(200).json(response);
    res.status(200).json(response);
  }
);

// Both are TODO: Implement
// only going to call from microservice
router.patch(
  "/orders/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    // security check for microservice calls only
    const orderId = parseInt(req.params.id);
    const status = req.body.status as OrderStatus;
    const response = await service.UpdateOrder(orderId, status, repo);
    // return res.status(200).json(response);
    res.status(200).json(response);
  }
);

// only going to call from microservice
router.delete(
  "/orders/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) {
      next(new Error("User not found"));
      return;
    }
    const orderId = parseInt(req.params.id);
    const response = await service.DeleteOrder(orderId, repo);
    // return res.status(200).json(response);
    res.status(200).json(response);
  }
);

export default router;

