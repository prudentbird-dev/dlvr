import { Router } from "express";
import { Request, Response } from "express";
import httpStatus from "http-status";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import riderRoutes from "./rider.route";
import orderRoutes from "./order.route";

const router = Router();

const PORT = process.env.PORT || 3000;

router.get("/", (req: Request, res: Response) => {
  res.status(httpStatus.OK).send({
    message:
      "Welcome to the DLVR API! Use the appropriate endpoints to access the resources.",
    documentation: `API Documentation available at ${
      process.env.NODE_ENV === "development" ? `http://localhost:${PORT}` : ""
    }/api/docs`,
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/riders", riderRoutes);
router.use("/orders", orderRoutes);

export default router;
