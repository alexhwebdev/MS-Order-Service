import { CartRepositoryType } from "../types/repository.type";
import { DB } from "../db/db.connection";
import { 
  Cart, 
  // CartLineItem, 
  // cartLineItems, 
  carts } from "../db/schema";
// import { NotFoundError } from "../utils";
// import { eq } from "drizzle-orm";

// // declare repository type
// export type CartRepositoryType = {
//   createCart: (customerId: number, lineItem: CartLineItem) => Promise<number>;
//   findCart: (id: number) => Promise<Cart>;
//   updateCart: (id: number, qty: number) => Promise<CartLineItem>;
//   deleteCart: (id: number) => Promise<Boolean>;
//   clearCartData: (id: number) => Promise<Boolean>;
// };

const createCart = async (input: any): Promise<{}> => {
// const createCart = async (
//   customerId: number,
//   { itemName, price, productId, qty, variant }: CartLineItem
// ): Promise<number> => {
  // Connect to DB
  const result = await DB.insert(carts) // carts from "db/schema"
    .values({
      // customerId: customerId,
      customerId: 123,
    })
    .returning(
      {cartId: carts.id}
    ) // Once data is created, return
    // .onConflictDoUpdate({
    //   target: carts.customerId,
    //   set: { updatedAt: new Date() },
    // });
  console.log('cart.repository - createCart result', result)

  // // Create Cart
  // const [{ id }] = result;
  // // Perform DB operations
  // if (id > 0) {
  //   await DB.insert(cartLineItems).values({
  //     cartId: id,
  //     productId: productId,
  //     itemName: itemName,
  //     price: price,
  //     qty: qty,
  //     variant: variant,
  //   });
  // }
  // return id;
  return Promise.resolve({message: "fake response", input})
};

const findCart = async (input: any): Promise<{}> => {
// const findCart = async (id: number): Promise<Cart> => {
  // const cart = await DB.query.carts.findFirst({
  //   where: (carts, { eq }) => eq(carts.customerId, id),
  //   with: {
  //     lineItems: true,
  //   },
  // });
  // if (!cart) {
  //   throw new NotFoundError("cart not found");
  // }
  // return cart;
  return Promise.resolve({})
};

const updateCart = async (input: any): Promise<{}> => {
// const updateCart = async (
//   id: number, qty: number
// ): Promise<CartLineItem> => {
//   const [cartLineItem] = await DB.update(cartLineItems)
//     .set({
//       qty: qty,
//     })
//     .where(eq(cartLineItems.id, id))
//     .returning();
//   return cartLineItem;
  return Promise.resolve({})
};

const deleteCart = async (input: any): Promise<{}> => {
// const deleteCart = async (
//   id: number
// ): Promise<boolean> => {
  // console.log("Proposed ID", id);
  // await DB
  //   .delete(cartLineItems)
  //   .where(eq(cartLineItems.id, id))
  //   .returning();
  // return true;
  return Promise.resolve({})
};

const clearCartData = async (input: any): Promise<{}> => {
// const clearCartData = async (
//   id: number
// ): Promise<boolean> => {
  // await DB
  //   .delete(carts)
  //   .where(eq(carts.id, id))
  //   .returning();
  // return true;
  return Promise.resolve({})
};

export const CartRepository: CartRepositoryType = {
  create: createCart,
  find: findCart,
  update: updateCart,
  delete: deleteCart,
  // clearCartData,
};






// const createCart = async (input: any): Promise<{}> => {
//   const result = await DB.insert(carts)
//     .values({
//       // customerId: customerId,
//       customerId: 1,
//     })
//     .returning({ cartId: carts.id})
//     // .returning()
//     // .onConflictDoUpdate({
//     //   target: carts.customerId,
//     //   set: { updatedAt: new Date() },
//     // });

//     console.log('result ', result)

//   return Promise.resolve({
//     message: "fake response from createCart",
//     input
//   })
// }
// const findCart = async (input: any): Promise<{}> => {
//   return Promise.resolve({})
// }
// const updateCart = async (input: any): Promise<{}> => {
//   return Promise.resolve({})
// }
// const deleteCart = async (input: any): Promise<{}> => {
//   return Promise.resolve({})
// }