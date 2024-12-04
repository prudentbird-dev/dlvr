import mongoose, { Schema } from "mongoose";
import { IOrder } from "../types/order.type";
import toJSON from "./plugins/toJSON.plugin";

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the order
 *         userId:
 *           type: string
 *           description: ID of the user who created the order
 *         riderId:
 *           type: string
 *           description: ID of the assigned rider
 *         pickupLocation:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               enum: [Point]
 *               description: The GeoJSON type of the pickup location
 *             coordinates:
 *               type: array
 *               items:
 *                 type: number
 *               description: Longitude and latitude of the pickup location
 *               minItems: 2
 *               maxItems: 2
 *         dropoffLocation:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               enum: [Point]
 *               description: The GeoJSON type of the dropoff location
 *             coordinates:
 *               type: array
 *               items:
 *                 type: number
 *               description: Longitude and latitude of the dropoff location
 *               minItems: 2
 *               maxItems: 2
 *         status:
 *           type: string
 *           enum: [pending, assigned, ongoing, completed]
 *           description: The current status of the order
 *           default: pending
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the order was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the order was last updated
 *       security:
 *         - bearerAuth: []
 *     Rider:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the rider
 *         userId:
 *           type: string
 *           description: ID of the user associated with the rider profile
 *         location:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               enum: [Point]
 *               description: The GeoJSON type of the rider's current location
 *             coordinates:
 *               type: array
 *               items:
 *                 type: number
 *               description: Longitude and latitude of the rider's current location
 *               minItems: 2
 *               maxItems: 2
 *         isAvailable:
 *           type: boolean
 *           description: Availability status of the rider
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the rider profile was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the rider profile was last updated
 *       security:
 *         - bearerAuth: []
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
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
