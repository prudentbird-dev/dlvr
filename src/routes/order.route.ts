import express from "express";
import { orderController } from "../controllers/order.controller";
import { authGuard, authorize } from "../middlewares/authGuard.middleware";

const router = express.Router();

router.post("/", authGuard, authorize("user"), orderController.createOrder);

router.get(
  "/",
  authGuard,
  authorize("user", "rider", "admin"),
  orderController.getOrders,
);

router.get(
  "/:id",
  authGuard,
  authorize("user", "rider", "admin"),
  orderController.getOrderById,
);

router.put(
  "/:id",
  authGuard,
  authorize("admin", "rider"),
  orderController.updateOrder,
);

router.delete(
  "/:id",
  authGuard,
  authorize("admin"),
  orderController.deleteOrder,
);

export default router;
