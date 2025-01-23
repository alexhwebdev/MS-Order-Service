// import { innerProduct } from "drizzle-orm";
import { CartLineItem } from "../db/schema";
import { CartEditRequestInput, CartRequestInput } from "../dto/cartRequest.do";
// import { CartRepositoryType } from "../types/repository.type";
import { CartRepositoryType } from "../repository/cart.repository";
import { logger, NotFoundError } from "../utils";
import { GetProductDetails } from "../utils/broker";

export const CreateCart = async (
  input: CartRequestInput,
  repo: CartRepositoryType
) => {
  console.log('Service CreateCart 3 input', input)
  // Make a call to our catalog microservice, get Product details
  // Synchronize call
  const product = await GetProductDetails(input.productId);
  console.log('Service CreateCart 6 product', product)
  logger.info(product);

  if (product.stock < input.qty) {
    throw new NotFoundError("product is out of stock");
  }
  return await repo.createCart(input.customerId, {
    productId: product.id,
    price: product.price.toString(),
    qty: input.qty,
    itemName: product.name,
    variant: product.variant,
  } as CartLineItem);
};

export const GetCart = async (
  id: number, 
  repo: CartRepositoryType
) => {
  const data = await repo.findCart(id);
  if (!data) {
    throw new NotFoundError("cart not found");
  }
  return data;
};

export const EditCart = async (
  input: CartEditRequestInput,
  repo: CartRepositoryType
) => {
  const data = await repo.updateCart(input.id, input.qty);
  return data;
};

export const DeleteCart = async (
  id: number, 
  repo: CartRepositoryType
) => {
  const data = await repo.deleteCart(id);
  return data;
};
