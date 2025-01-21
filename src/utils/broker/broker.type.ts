import { MessageType, OrderEvent, TOPIC_TYPE } from "../../types";

export interface PublishType {
  headers: Record<string, any>;
  topic: TOPIC_TYPE;
  event: OrderEvent;
  message: Record<string, any>;
}

export type MessageHandler = (input: MessageType) => void;

export type MessageBrokerType = {
  // producer
  connectProducer: <T>() => Promise<T>;
  disconnectProducer: () => Promise<void>;
  publish: (data: PublishType) => Promise<boolean>;

  // consumer
  connectConsumer: <T>() => Promise<T>;
  disconnectConsumer: () => Promise<void>;
  subscribe: (
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