import { Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  role: "user" | "rider" | "admin";
  location: {
    type: string;
    coordinates: number[];
  };
  comparePassword(password: string): Promise<boolean>;
}
