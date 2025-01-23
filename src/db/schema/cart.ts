// THIS IS ALL DRIZZLE ORM STUFF
import { InferInsertModel, InferSelectModel, relations } from "drizzle-orm";
import { pgTable, serial, timestamp, varchar, numeric, integer } from "drizzle-orm/pg-core";

// L12: 13 mm
export const carts = pgTable("carts", {
  id: serial("id").primaryKey(), // for db record
  customerId: integer("customer_id").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
// L12: 15mm. InferSelectModel converts cart table to cart type
export type Cart = InferSelectModel<typeof carts>;
export type NewCart = InferInsertModel<typeof carts>;

// L15 from beginning
export const cartLineItems = pgTable("cart_line_items", {
  id: serial("id").primaryKey(), // for db record
  productId: integer("product_id").notNull(),
  cartId: integer("cart_id")  // cart_id is above --> id: serial("id").primaryKey(),
    .references(() => carts.id, { onDelete: "cascade" })  // When deleting this cart, delete all other variables associated with the cart.
    .notNull(),
  itemName: varchar("item_name").notNull(), // human readable
  variant: varchar("variant"), // Small // medium // big
  qty: integer("qty").notNull(),
  price: numeric("amount").notNull(), // amount in cents
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type CartLineItem = InferSelectModel<typeof cartLineItems>;

// Relation of '1 to many'
export const cartRelations = relations(carts, ({ many }) => ({
  lineItems: many(cartLineItems),
}));
// Relation : 1 cartLineItems can have 1 cart
export const lineItemsRelations = relations(cartLineItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartLineItems.cartId],
    references: [carts.id], // cart_id is above --> id: serial("id").primaryKey(),
  }),
}));
