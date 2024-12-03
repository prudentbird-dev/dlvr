import Order from "../models/order.model";
import { IOrder } from "../types/order.type";

export const orderService = {
  async createOrder(orderData: Partial<IOrder>): Promise<IOrder> {
    const order = new Order(orderData);
    await order.save();
    return order;
  },

  async getOrders(): Promise<IOrder[]> {
    return Order.find({});
  },

  async getOrderById(id: string): Promise<IOrder | null> {
    return Order.findById(id);
  },

  async updateOrder(
    id: string,
    updateData: Partial<IOrder>,
  ): Promise<IOrder | null> {
    return Order.findByIdAndUpdate(id, updateData, { new: true });
  },

  async deleteOrder(id: string): Promise<IOrder | null> {
    return Order.findByIdAndDelete(id);
  },

  async getOrdersByUserId(userId: string): Promise<IOrder[]> {
    return Order.find({ userId });
  },

  async getOrdersByRiderId(riderId: string): Promise<IOrder[]> {
    return Order.find({ riderId });
  },
};
