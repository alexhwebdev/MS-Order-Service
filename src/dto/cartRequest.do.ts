import { Static, Type } from "@sinclair/typebox";

// This is Schema, necessary for validating incoming Request inputs. Then based on the schema, it generates some kind of static type.
export const CartRequestSchema = Type.Object({
  productId: Type.Integer(),
  customerId: Type.Integer(),
  qty: Type.Integer(),
});
// Need 1 Static type that can be used to create cart.
export type CartRequestInput = Static<typeof CartRequestSchema>;

export const CartEditRequestSchema = Type.Object({
  id: Type.Integer(),
  qty: Type.Integer(),
});
export type CartEditRequestInput = Static<typeof CartEditRequestSchema>;
