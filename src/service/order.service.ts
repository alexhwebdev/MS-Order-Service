import { InProcessOrder, OrderLineItemType, OrderWithLineItems } from "../dto/orderRequest.dto";
import { CartRepositoryType } from "../repository/cart.repository";
import { OrderRepositoryType } from "../repository/order.repository";
import { MessageType, OrderStatus } from "../types";
import { SendCreateOrderMessage } from "./broker.service";

export const CreateOrder = async (
  userId: number,
  orderRepo: OrderRepositoryType,
  cartRepo: CartRepositoryType
) => {
  console.log('ORDER_SERVICE service : CreateOrder - userId ', userId)
  console.log('ORDER_SERVICE service : CreateOrder - orderRepo ', orderRepo)
  console.log('ORDER_SERVICE service : CreateOrder - cartRepo ', cartRepo)
  // find cart by customer id
  const cart = await cartRepo.findCart(userId);
  console.log('ORDER_SERVICE service : CreateOrder - cart ', cart)
  if (!cart) {
    throw new Error("Cart not found");
  }
  // calculate total order amount
  let cartTotal = 0;
  let orderLineItems: OrderLineItemType[] = [];

  // create orderline items from cart items
  cart.lineItems.forEach((item) => {
    cartTotal += item.qty * Number(item.price);
    orderLineItems.push({
      productId: item.productId,
      itemName: item.itemName,
      qty: item.qty,
      price: item.price,
    } as OrderLineItemType);
  });

  const orderNumber = Math.floor(Math.random() * 1000000);

  // create order with line items
  const orderInput: OrderWithLineItems = {
    orderNumber: orderNumber,
    txnId: null,  // TODO: Payment ID to keep track of successful payment.
    status: OrderStatus.PENDING,  // Payment status to be updated by payment service.
    customerId: userId,
    amount: cartTotal.toString(),
    orderItems: orderLineItems,
  };
  console.log('ORDER_SERVICE service : CreateOrder - orderInput ', orderInput)
 
  const order = await orderRepo.createOrder(orderInput);
  console.log('ORDER_SERVICE service : CreateOrder - order ', order)
  await cartRepo.clearCartData(userId);  // clear... from CartRepositoryType
  console.log("Order created", order);

  // fire a message to subscription service [catalog service] to update stock
  // await SendCreateOrderMessage({ order: orderInput })
  await SendCreateOrderMessage(orderInput);

  // return success message
  return { message: "Order created successfully", orderNumber: orderNumber };
};

export const UpdateOrder = async (
  orderId: number,
  status: OrderStatus,
  orderRepo: OrderRepositoryType
) => {
  await orderRepo.updateOrder(orderId, status);

  // fire message to subscription service [catalog service] to update stock
  // TODO: handle Kafka calls
  if (status === OrderStatus.CANCELLED) {
    // await orderRepo.publishOrderEvent(order, "ORDER_CANCELLED");
  }
  return { message: "Order updated successfully" };
};

export const GetOrder = (
  orderId: number, 
  orderRepo: OrderRepositoryType
) => {
  const order = orderRepo.findOrder(orderId);
  if (!order) {
    throw new Error("Order not found");
  }
  return order;
};

export const GetOrders = async (
  userId: number, 
  orderRepo: OrderRepositoryType
) => {
  const orders = await orderRepo.findOrdersByCustomerId(userId);
  if (!Array.isArray(orders)) {
    throw new Error("Orders not found");
  }
  return orders;
};

export const DeleteOrder = async (
  orderId: number,
  orderRepo: OrderRepositoryType
) => {
  await orderRepo.deleteOrder(orderId);
  return true;
};

export const HandleSubscription = async (message: MessageType) => {
  console.log(
    "ORDER SERVICE : Message received by order Kafka consumer", 
    message
  );

  // if (message.event === OrderEvent.ORDER_UPDATED) {
  // call create order
};

export const CheckoutOrder = async (
  orderId: number,
  orderRepo: OrderRepositoryType
) => {
  const order = await orderRepo.findOrder(orderId);
  if (!order) {
    throw new Error("Order not found");
  }
  const checkoutOrder: InProcessOrder = {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    customerId: order.customerId,
    amount: Number(order.amount),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  }
  return checkoutOrder;
};