import mongoose, { Document } from "mongoose";

export interface IRider extends Document {
  userId: mongoose.Types.ObjectId;
  location: {
    type: string;
    coordinates: number[];
  };
  isAvailable: boolean;
}
