type Create = (input: any) => Promise<{}>;
type Find = (input: any) => Promise<{}>;
type Update = (input: any) => Promise<{}>;
type Delete = (input: any) => Promise<{}>;

export type CartRepositoryType = {
  create: Create;
  find: Find;
  update: Update;
  delete: Delete;
};



// export enum OrderEvent {
//   CREATE_ORDER = "create_order",
//   CANCEL_ORDER = "cancel_order",
// }

// export type TOPIC_TYPE = "OrderEvents" | "CatalogEvents";

// export interface MessageType {
//   headers?: Record<string, any>;
//   event: OrderEvent;
//   data: Record<string, any>;
// }
