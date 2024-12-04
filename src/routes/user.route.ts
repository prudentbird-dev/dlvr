import express from "express";
import { userController } from "../controllers/user.controller";
import { authGuard, authorize } from "../middlewares/authGuard.middleware";

const router = express.Router();

router.get("/", authGuard, authorize("admin"), userController.getUsers);
router.get(
  "/",
  authGuard,
  authorize("admin", "user", "rider"),
  userController.getUserById,
);
router.put(
  "/",
  authGuard,
  authorize("admin", "user", "rider"),
  userController.updateUser,
);
router.delete("/:id", authGuard, authorize("admin"), userController.deleteUser);

export default router;
