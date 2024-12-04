import { Request, Response, NextFunction } from "express";
import { riderService } from "../services/rider.service";
import Rider from "../models/rider.model";
import httpStatus from "http-status";
import ApiError from "../utils/apiErrorHandler.util";
import { userService } from "../services/user.service";

export const riderController = {
  async getRiders(req: Request, res: Response, next: NextFunction) {
    try {
      const riders = await riderService.getRiders();
      if (!riders) {
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          "Error fetching riders",
        );
      }

      res.status(httpStatus.OK).json({ status: "success", riders });
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

  async getRider(req: Request, res: Response, next: NextFunction) {
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
      const rider = await Rider.findOne({ userId: user._id });

      if (!rider) {
        throw new ApiError(httpStatus.NOT_FOUND, "Rider not found");
      }

      res.status(httpStatus.OK).json({ status: "success", user, rider });
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

  async getRiderById(req: Request, res: Response, next: NextFunction) {
    try {
      const rider = await riderService.getRiderById(req.params.id);
      if (!rider) {
        throw new ApiError(httpStatus.NOT_FOUND, "Rider not found");
      }

      const user = await userService.getUserById(rider.userId.toString());
      res.status(httpStatus.OK).json({ status: "success", rider, user });
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

  async updateRider(req: Request, res: Response, next: NextFunction) {
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
      const riderData = await Rider.findOne({ userId: user._id });

      if (!riderData) {
        throw new ApiError(httpStatus.NOT_FOUND, "Rider not found");
      }

      const rider = await riderService.updateRider(riderData.id, req.body);
      if (!rider) {
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          "Error updating rider",
        );
      }
      res.status(httpStatus.OK).json({ status: "success", rider });
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

  async updateRiderById(req: Request, res: Response, next: NextFunction) {
    try {
      const rider = await riderService.updateRider(req.params.id, req.body);
      if (!rider) {
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          "Error updating rider",
        );
      }
      res.status(httpStatus.OK).json({ status: "success", rider });
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
