import { Router } from "express";
import authRoutes from "./auth.route";
import userRoutes from "./user.route";
import riderRoutes from "./rider.route";
import orderRoutes from "./order.route";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/riders", riderRoutes);
router.use("/orders", orderRoutes);

export default router;
