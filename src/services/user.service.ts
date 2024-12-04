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
  ): Promise<{ message?: string; user: IUser; rider?: IRider }> {
    const role: "user" | "rider" | "admin" =
      adminSecret === process.env.ADMIN_SECRET
        ? "admin"
        : riderSecret === process.env.RIDER_SECRET
          ? "rider"
          : "user";

    // Fetch location data
    const location = { type: "Point", coordinates: [0, 0] };
    let message = "User created successfully.";

    try {
      if (clientIp) {
        const response = await fetch(
          `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${clientIp}&aqi=no`,
        );

        if (response.ok) {
          const data = await response.json();
          location.coordinates = [data.location.lat, data.location.lon];
        } else {
          message =
            "User created successfully, but location data could not be fetched. Please update location manually.";
        }
      }
    } catch {
      message =
        "User created successfully, but an error occurred while fetching location data. Please update location manually.";
    }

    if (role !== "rider") {
      userData.location = location;
    }
    const user = new User({ ...userData, role });
    await user.save();

    // Additional logic for riders
    if (role === "rider") {
      const riderData: Partial<IRider> = {
        userId: user.id,
        location,
      };

      const rider = new Rider(riderData);
      await rider.save();

      return { user, rider, message };
    }

    return { user, message };
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
    await Rider.findOneAndDelete({ userId: id });

    return User.findByIdAndDelete(id);
  },

  async authenticateUser(
    email: string,
    password: string,
  ): Promise<{ user: IUser; accessToken: string }> {
    const user = await User.findOne({ email: email });

    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Invalid email or password");
    }

    const payload: JwtPayload = {
      sub: user.id,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
    };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string);

    const response: {
      accessToken: string;
      user: IUser;
      rider?: IRider;
    } = {
      accessToken,
      user,
    };

    if (user.role === "rider") {
      const rider = await Rider.findOne({ userId: user.id });
      if (!rider) {
        throw new ApiError(
          httpStatus.NOT_FOUND,
          "Rider information not found.",
        );
      }
      response.rider = rider;
    }

    return response;
  },
};
