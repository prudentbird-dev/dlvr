import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import httpStatus from "http-status";
import ApiError from "../utils/apiErrorHandler.util";
import User from "../models/user.model";
import { IUser } from "../types/user.type";

interface AuthRequest extends Request {
  user?: IUser;
}

export const authGuard = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return next(
        new ApiError(httpStatus.UNAUTHORIZED, "Access token not provided"),
      );
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;
    const user = await User.findById(decoded.sub);

    if (!user) {
      return next(
        new ApiError(httpStatus.FORBIDDEN, "Forbidden: Access required"),
      );
    }

    req.user = user;
    next();
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
};

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(httpStatus.FORBIDDEN, "Access denied"));
    }
    next();
  };
};
