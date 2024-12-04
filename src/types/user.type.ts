import { Document, Model } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  role: "user" | "rider" | "admin";
  location: {
    type: string;
    coordinates: number[];
  };
}

export interface IUserMethods {
  comparePassword(userPassword: string): Promise<boolean>;
}

export type IUserModel = Model<IUser, object, IUserMethods>;
