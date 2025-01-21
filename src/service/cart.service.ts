// import { innerProduct } from "drizzle-orm";
// import { CartLineItem } from "../db/schema";
import { CartEditRequestInput, CartRequestInput } from "../dto/cartRequest.do";
import { CartRepositoryType } from "../types/repository.type";
// import { CartRepositoryType } from "../repository/cart.repository";
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
  console.log('Service CreateCart 5 product', product)
  logger.info(product);

  if (product.stock < input.qty) {
    throw new NotFoundError("product is out of stock");
  }
  return product
  // const data = await repo.create(input)
  // console.log('Service CreateCart data', data)
  // return { data };

  // return await repo.createCart(input.customerId, {
  //   productId: product.id,
  //   price: product.price.toString(),
  //   qty: input.qty,
  //   itemName: product.name,
  //   variant: product.variant,
  // } as CartLineItem);
};

export const GetCart = async (
  input: any,
  // id: number, 
  repo: CartRepositoryType
) => {
  // const data = await repo.findCart(id);
  // if (!data) {
  //   throw new NotFoundError("cart not found");
  // }
  // return data;

  const data = await repo.find(input)
  return { data };
};

export const EditCart = async (
  input: CartEditRequestInput,
  repo: CartRepositoryType
) => {
  // const data = await repo.updateCart(input.id, input.qty);
  // return data;
  
  const data = await repo.update(input)
  return { data };
};

export const DeleteCart = async (
  input: any,
  // id: number, 
  repo: CartRepositoryType
) => {
  // const data = await repo.deleteCart(id);
  // return data;
  
  const data = await repo.delete(input)
  return { data };
};
