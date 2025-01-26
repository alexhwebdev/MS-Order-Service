// import { CartRepositoryType } from "../types/repository.type";
import { DB } from "../db/db.connection";
import { 
  // Cart, 
  CartLineItem, cartLineItems, carts } from "../db/schema";
import { CartWithLineItems } from "../dto/cartRequest.dto";
import { NotFoundError } from "../utils";
import { eq } from "drizzle-orm";

// declare repository type
export type CartRepositoryType = {
  createCart: (customerId: number, lineItem: CartLineItem) => Promise<number>;
  findCart: (id: number) => Promise<CartWithLineItems>;
  updateCart: (id: number, qty: number) => Promise<CartLineItem>;
  deleteCart: (id: number) => Promise<Boolean>;
  clearCartData: (id: number) => Promise<Boolean>;
  findCartByProductId: (
    customerId: number,
    productId: number
  ) => Promise<CartLineItem>;
};

const createCart = async (
  customerId: number,
  { productId, itemName, variant, qty, price }: CartLineItem
): Promise<number> => {
  // Create Cart
  const result = await DB.insert(carts) // carts from "db/schema"
    .values({ customerId: customerId })
    .returning(
      // { cartId: carts.id }
    ) // Once cart is created, return everything.
    .onConflictDoUpdate({   // L15 10 mm. If custormerId is same, just update updatedAt since a cart cannot have 2 same customerIds
      target: carts.customerId,
      set: { updatedAt: new Date() },
    });
  console.log('cart.repository - createCart result', result)

  const [{ id }] = result;
  // Connect to DB. Perform DB operations
  if (id > 0) {   // If item present
    await DB.insert(cartLineItems).values({
      cartId: id,
      productId: productId,
      itemName: itemName,
      variant: variant,
      qty: qty,
      price: price,
    });
  }
  return id;
};

// L15 11 mm
const findCart = async (id: number): Promise<CartWithLineItems> => {
  const cart = await DB.query.carts.findFirst({
    where: (carts, { eq }) => eq(carts.customerId, id),
    with: {
      lineItems: true,
    },
  });
  if (!cart) {
    throw new NotFoundError("cart not found");
  }
  return cart;
};

const updateCart = async (id: number, qty: number): Promise<CartLineItem> => {
  const [cartLineItem] = await DB.update(cartLineItems)
    .set({
      qty: qty,
    })
    .where(eq(cartLineItems.id, id))
    .returning();
  return cartLineItem;
};

// const deleteCart = async (input: any): Promise<{}> => {
//   return Promise.resolve({})
// };
const deleteCart = async (id: number): Promise<boolean> => {
  console.log("Proposed ID", id);
  await DB
    .delete(cartLineItems)
    .where(eq(cartLineItems.id, id))
    .returning();
  return true;
};

const clearCartData = async (id: number): Promise<boolean> => {
  await DB
    .delete(carts)
    .where(eq(carts.id, id))
    .returning();
  return true;
};

const findCartByProductId = async (
  customerId: number,
  productId: number
): Promise<CartLineItem> => {
  const cart = await DB.query.carts.findFirst({
    where: (carts, { eq }) => eq(carts.customerId, customerId),
    with: {
      lineItems: true,
    },
  });
  const lineItem = cart?.lineItems.find(
    (item) => item.productId === productId
  );
  return lineItem as CartLineItem;
};

export const CartRepository: CartRepositoryType = {
  createCart,
  findCart,
  updateCart,
  deleteCart,
  clearCartData,
  findCartByProductId
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