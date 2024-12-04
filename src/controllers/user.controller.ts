import { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service";
import httpStatus from "http-status";
import ApiError from "../utils/apiErrorHandler.util";
import Rider from "../models/rider.model";
import { IUser } from "src/types/user.type";
import { IRider } from "src/types/rider.type";

export const userController = {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await userService.getUsers();
      if (!users) {
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          "Error fetching users",
        );
      }
      res.status(httpStatus.OK).json({ status: "success", users });
    } catch (error) {
      return next(
        error instanceof ApiError
          ? error
          : new ApiError(
              httpStatus.INTERNAL_SERVER_ERROR,
              "An unexpected error occurred",
            ),
      );
    }
  },

  async getUserById(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(
          new ApiError(
            httpStatus.UNAUTHORIZED,
            "Access denied: User not authenticated",
          ),
        );
      }
      const user = req.user;

      const response: {
        status: string;
        user: IUser;
        rider?: IRider;
      } = {
        status: "success",
        user,
      };

      if (user.role === "rider") {
        const rider = await Rider.findOne({ userId: user.id });
        if (!rider) {
          return next(
            new ApiError(httpStatus.NOT_FOUND, "Rider information not found."),
          );
        }
        response.rider = rider;
      }
      res.status(httpStatus.OK).json(response);
    } catch (error) {
      return next(
        error instanceof ApiError
          ? error
          : new ApiError(
              httpStatus.INTERNAL_SERVER_ERROR,
              "An unexpected error occurred",
            ),
      );
    }
  },

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(
          new ApiError(
            httpStatus.UNAUTHORIZED,
            "Access denied: User not authenticated",
          ),
        );
      }
      const user = await userService.updateUser(req.user.id, req.body);
      if (!user) {
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          "Something went wrong while updating user",
        );
      }
      res.status(httpStatus.OK).json({ status: "success", user });
    } catch (error) {
      return next(
        error instanceof ApiError
          ? error
          : new ApiError(
              httpStatus.INTERNAL_SERVER_ERROR,
              "An unexpected error occurred",
            ),
      );
    }
  },

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await userService.deleteUser(req.params.id);
      if (!user) {
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          "Something went wrong while deleting user",
        );
      }
      res.status(httpStatus.NO_CONTENT).send();
    } catch (error) {
      return next(
        error instanceof ApiError
          ? error
          : new ApiError(
              httpStatus.INTERNAL_SERVER_ERROR,
              "An unexpected error occurred",
            ),
      );
    }
  },
};
