import mongoose, { Schema } from "mongoose";
import { IRider } from "../types/rider.type";
import toJSON from "./plugins/toJSON.plugin";

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
