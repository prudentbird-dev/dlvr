import { Request, Response, NextFunction } from "express";
import { userService } from "../services/user.service";
import httpStatus from "http-status";
import ApiError from "../utils/apiErrorHandler.util";

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, riderSecret, adminSecret } = req.body;
      const clientIp = req.ip || req.socket.remoteAddress;
      const response = await userService.createUser(
        { email, password },
        riderSecret,
        adminSecret,
        clientIp,
      );
      if (!response) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Error creating user");
      }

      res.status(httpStatus.CREATED).json({ status: "success", ...response });
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

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Email and password are required",
        );
      }

      const response = await userService.authenticateUser(email, password);

      res.status(httpStatus.OK).json({
        status: "success",
        ...response,
      });
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
