import express, { NextFunction, Request, Response } from "express";
import * as service from "../service/cart.service";
import * as repository from "../repository/cart.repository";
import { ValidateRequest } from "../utils/validator";
import { CartRequestInput, CartRequestSchema } from "../dto/cartRequest.dto";
import { RequestAuthorizer } from "./middleware";

const router = express.Router();
const repo = repository.CartRepository;  // Dependency injection.

router.post(
  "/cart", 
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    console.log('cart.routes.ts - 1 req.user', req.user)
    console.log('cart.routes.ts - 1 req.body', req.body) // { productId: 1, qty: 1 }
    try {
      const user = req.user;
      if (!user) {
        next(new Error("User not found"));
        return;
      }
      const error = ValidateRequest<CartRequestInput>(
        req.body, 
        CartRequestSchema
      );
      console.log('cart.routes.ts - 2 error', error)
      if (error) {
        res.status(404).json({ error }); // "Not Found"
      }
      // L20 15mm
      const input: CartRequestInput = req.body;
      const response = await service.CreateCart(
        // req.body as CartRequestInput, // this is forcing req.body which is "input", to be CartRequestInput
        {
          ...input,
          customerId: user.id,
        },
        repo
      );
      console.log('cart.routes.ts - 7 response', response)
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error }); // "Not Found"
    }
  }
);

router.get("/cart", RequestAuthorizer, async (req: Request, res: Response, next: NextFunction) => {
  // L15 21 mm.
  // const response = await service.GetCart(
  //   req.body.customerId, // Comes from our auth user parsed from JWT. I need to code this.
  //   repo
  // );
  // res.status(200).json(response);

  try {
    const user = req.user;
    console.log('ORDER_SERVICE routes : Get /cart - user ', user)
    if (!user) {
      next(new Error("User not found"));
      return;
    }
    const response = await service.GetCart(user.id, repo);
    console.log('ORDER_SERVICE routes : Get /cart - response ', response)
    // return res.status(200).json(response);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

router.patch("/cart/:lineItemId", RequestAuthorizer, async (req: Request, res: Response, next: NextFunction) => {
  // const lineItemId = req.params.lineItemId;
  // const response = await service.EditCart(
  //   {
  //     id: +lineItemId,  // "+" shorthand way to convert string to number
  //     qty: req.body.qty,
  //   },
  //   repo
  // );
  // res.status(200).json(response);

  try {
    const user = req.user;
    if (!user) {
      next(new Error("User not found"));
      return;
    }
    const lineItemId = req.params.lineItemId;
    const response = await service.EditCart(
      {
        id: +lineItemId,
        qty: req.body.qty,
        customerId: user.id,
      },
      repo
    );
    // return res.status(200).json(response);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

router.delete("/cart/:lineItemId", RequestAuthorizer, async (req: Request, res: Response, next: NextFunction) => {
  // const lineItemId = req.params.lineItemId;
  // console.log('lineItemId ', lineItemId);
  // const response = await service.DeleteCart(
  //   +lineItemId, 
  //   repo
  // );
  try {
    const user = req.user;
    if (!user) {
      next(new Error("User not found"));
      return;
    }
    const lineItemId = req.params.lineItemId;
    console.log(lineItemId);
    const response = await service.DeleteCart(
      { customerId: user.id, id: +lineItemId },
      repo
    );
    // return res.status(200).json(response);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
});

export default router;
