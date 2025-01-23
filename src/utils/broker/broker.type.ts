import { MessageType, OrderEvent, TOPIC_TYPE } from "../../types";

export interface PublishType {
  headers: Record<string, any>;  // key is string, type can be any
  topic: TOPIC_TYPE;  // "OrderEvents" | "CatalogEvents";
  event: OrderEvent;
  message: Record<string, any>;
}// Record : object type with specific key-value constraints

// export type MessageHandler = (input: MessageType) => {};
export type MessageHandler = (input: MessageType) => void;  // void is same as {}

export type MessageBrokerType = {
  // producer
  connectProducer: <T>() => Promise<T>;
  disconnectProducer: () => Promise<void>;  // void return type means the function does not return any meaningful value; it simply indicates completion.
  publish: (data: PublishType) => Promise<boolean>;

  // consumer
  connectConsumer: <T>() => Promise<T>;
  disconnectConsumer: () => Promise<void>;  // void return type means the function does not return any meaningful value; it simply indicates completion.
  subscribe: (
    // messageHandler: Function,
    // topic: string
    messageHandler: MessageHandler,
    topic: TOPIC_TYPE
  ) => Promise<void>;
};

// ----- subscription.type.ts
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