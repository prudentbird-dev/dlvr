import mongoose, { Document } from "mongoose";

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  riderId?: mongoose.Types.ObjectId;
  pickupLocation: {
    type: string;
    coordinates: number[];
  };
  dropoffLocation: {
    type: string;
    coordinates: number[];
  };
  status: "pending" | "assigned" | "ongoing" | "completed";
}
