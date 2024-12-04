import User from "../models/user.model";
import Rider from "../models/rider.model";
import { IUser } from "../types/user.type";
import { IRider } from "../types/rider.type";
import jwt, { JwtPayload } from "jsonwebtoken";
import ApiError from "../utils/apiErrorHandler.util";
import httpStatus from "http-status";

export const userService = {
  async createUser(
    userData: Partial<IUser>,
    riderSecret?: string,
    adminSecret?: string,
    clientIp?: string,
  ): Promise<IUser | { user: IUser; rider: IRider }> {
    let role: "user" | "rider" | "admin" = "user";

    if (adminSecret && adminSecret === process.env.ADMIN_SECRET) {
      role = "admin";
    }

    if (riderSecret && riderSecret === process.env.RIDER_SECRET) {
      role = "rider";
    }

    const response = await fetch(
      `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${clientIp}&aqi=no`,
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    userData.location = {
      type: "Point",
      coordinates: [data.location.lat, data.location.lon],
    };

    const user = new User({ ...userData, role });
    await user.save();

    if (role === "rider") {
      const riderData: Partial<IRider> = {
        userId: await user.id,
        location: {
          type: "Point",
          coordinates: [data.location.lat, data.location.lon],
        },
      };

      const rider = new Rider(riderData);
      await rider.save();

      return { user, rider };
    }
    return user;
  },

  async getUsers(): Promise<IUser[]> {
    return User.find({});
  },

  async getUserById(id: string): Promise<IUser | null> {
    return User.findById(id);
  },

  async updateUser(
    id: string,
    updateData: Partial<IUser>,
  ): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, updateData, { new: true });
  },

  async deleteUser(id: string): Promise<IUser | null> {
    return User.findByIdAndDelete(id);
  },

  async authenticateUser(
    email: string,
    password: string,
  ): Promise<{ user: IUser; accessToken: string }> {
    const user = await User.findOne({ email });

    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid email or password");
    }

    const payload: JwtPayload = {
      sub: user.id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string);
    return { user, accessToken };
  },
};
