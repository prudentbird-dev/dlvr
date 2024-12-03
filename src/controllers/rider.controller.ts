import { Request, Response, NextFunction } from "express";
import { riderService } from "../services/rider.service";
import httpStatus from "http-status";
import ApiError from "../utils/apiErrorHandler.util";

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

  async getRiderById(req: Request, res: Response, next: NextFunction) {
    try {
      const rider = await riderService.getRiderById(req.params.id);
      if (!rider) {
        throw new ApiError(httpStatus.NOT_FOUND, "Rider not found");
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

  async updateRider(req: Request, res: Response, next: NextFunction) {
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

  async deleteRider(req: Request, res: Response, next: NextFunction) {
    try {
      const rider = await riderService.deleteRider(req.params.id);
      if (!rider) {
        throw new ApiError(
          httpStatus.INTERNAL_SERVER_ERROR,
          "Error deleting rider",
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
