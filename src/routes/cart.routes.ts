import express, { NextFunction, Request, Response } from "express";
import * as service from "../service/cart.service";
import * as repository from "../repository/cart.repository";
import { ValidateRequest } from "../utils/validator";
import { CartRequestInput, CartRequestSchema } from "../dto/cartRequest.do";

const router = express.Router();
const repo = repository.CartRepository;  // Dependency injection.
// Code my own Verification check. This authMiddleware just validates all.
const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const isValidUser = true;
  if (!isValidUser) {
    res.status(403).json({ error: "authorization error" });
  }
  next();
};

router.post("/cart", authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
    console.log('cart.routes.ts - 1 req.body', req.body)
    try {
      const error = ValidateRequest<CartRequestInput>(
        req.body, 
        CartRequestSchema
      );
      console.log('cart.routes.ts - 2 error', error)
      if (error) {
        res.status(404).json({ error }); // "Not Found"
      }

      const response = await service.CreateCart(
        req.body as CartRequestInput,
        repo
      );
      console.log('cart.routes.ts - 7 response', response)
      res.status(200).json(response);
    } catch (error) {
      res.status(404).json({ error }); // "Not Found"
    }
  }
);

router.get("/cart", async (req: Request, res: Response, next: NextFunction) => {
  // L15 21 mm.
  const response = await service.GetCart(
    req.body.customerId, // Comes from our auth user parsed from JWT. I need to code this.
    repo
  );
  res.status(200).json(response);
});

router.patch("/cart/:lineItemId", async (req: Request, res: Response, next: NextFunction) => {
    const lineItemId = req.params.lineItemId;
    const response = await service.EditCart(
      {
        id: +lineItemId,  // "+" shorthand way to convert string to number
        qty: req.body.qty,
      },
      repo
    );
    res.status(200).json(response);
  }
);

router.delete("/cart/:lineItemId", async (req: Request, res: Response, next: NextFunction) => {
    const lineItemId = req.params.lineItemId;
    console.log('lineItemId ', lineItemId);
    const response = await service.DeleteCart(
      +lineItemId, 
      repo
    );
  }
);

export default router;
