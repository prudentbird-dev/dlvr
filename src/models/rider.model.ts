import mongoose, { Schema } from "mongoose";
import { IRider } from "../types/rider.type";
import toJSON from "./plugins/toJSON.plugin";

/**
 * @swagger
 * components:
 *   schemas:
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
const riderSchema = new Schema<IRider>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    location: {
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
    isAvailable: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  },
);

riderSchema.plugin(toJSON);
riderSchema.index({ location: "2dsphere" });

export default mongoose.model<IRider>("Rider", riderSchema);
