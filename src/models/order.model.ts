import mongoose, { Schema } from "mongoose";
import { IOrder } from "../types/order.type";
import toJSON from "./plugins/toJSON.plugin";

const orderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    riderId: { type: Schema.Types.ObjectId, ref: "Rider" },
    pickupLocation: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    dropoffLocation: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["pending", "assigned", "ongoing", "completed"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

orderSchema.plugin(toJSON);
orderSchema.index({ pickupLocation: "2dsphere" });
orderSchema.index({ dropoffLocation: "2dsphere" });

export default mongoose.model<IOrder>("Order", orderSchema);
