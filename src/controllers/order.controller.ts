import { Request, Response, NextFunction } from "express";
import { IOrder } from "../types/order.type";
import { orderService } from "../services/order.service";
import { riderService } from "../services/rider.service";
import ApiError from "../utils/apiErrorHandler.util";
import httpStatus from "http-status";

export const orderController = {
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(
          new ApiError(
            httpStatus.UNAUTHORIZED,
            "Access denied: User not authenticated",
          ),
        );
      }

      const {
        pickupLocation,
        dropoffLocation,
      }: {
        pickupLocation: {
          type: string;
          coordinates: number[];
        };
        dropoffLocation: {
          type: string;
          coordinates: number[];
        };
      } = req.body;

      if (
        !pickupLocation ||
        !Array.isArray(pickupLocation.coordinates) ||
        pickupLocation.coordinates.length !== 2 ||
        !dropoffLocation ||
        !Array.isArray(dropoffLocation.coordinates) ||
        dropoffLocation.coordinates.length !== 2
      ) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Invalid location data provided.",
        );
      }

      const nearestRider = await riderService.getNearestAvailableRider(
        pickupLocation.coordinates,
      );

      if (!nearestRider) {
        throw new ApiError(
          httpStatus.SERVICE_UNAVAILABLE,
          "Rider not available",
        );
      }

      const orderData: Partial<IOrder> = {
        userId: req.user.id,
        pickupLocation: {
          type: "Point",
          coordinates: pickupLocation.coordinates,
        },
        dropoffLocation: {
          type: "Point",
          coordinates: dropoffLocation.coordinates,
        },
        riderId: nearestRider.id,
        status: nearestRider ? "assigned" : "pending",
      };

      const order = await orderService.createOrder(orderData);

      if (nearestRider) {
        await riderService.updateRider(nearestRider.id, { isAvailable: false });
      }

      res.status(httpStatus.CREATED).json({ status: "success", order });
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

  async getOrders(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return next(
          new ApiError(
            httpStatus.UNAUTHORIZED,
            "Access denied: User not authenticated",
          ),
        );
      }

      let orders;
      if (req.user.role === "user") {
        orders = await orderService.getOrdersByUserId(req.user.id);
      } else if (req.user.role === "rider") {
        orders = await orderService.getOrdersByRiderId(req.user.id);
      } else if (req.user.role === "admin") {
        orders = await orderService.getOrders();
      } else {
        return next(
          new ApiError(
            httpStatus.FORBIDDEN,
            "Access denied: User role not recognized",
          ),
        );
      }

      res.status(httpStatus.OK).json({ status: "success", orders });
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

  async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await orderService.getOrderById(req.params.id);
      if (!order) {
        return next(new ApiError(httpStatus.NOT_FOUND, "Order not found"));
      }
      res.status(httpStatus.OK).json({ status: "success", order });
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

  async updateOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await orderService.updateOrder(req.params.id, req.body);
      if (!order) {
        return next(
          new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Something went wrong while updating order",
          ),
        );
      }
      res.status(httpStatus.OK).json({ status: "success", order });
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

  async deleteOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await orderService.deleteOrder(req.params.id);
      if (!order) {
        return next(
          new ApiError(
            httpStatus.INTERNAL_SERVER_ERROR,
            "Something went wrong while deleting order",
          ),
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
