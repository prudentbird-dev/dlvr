import express from "express";
import { riderController } from "../controllers/rider.controller";
import { authGuard, authorize } from "../middlewares/authGuard.middleware";

const router = express.Router();

router.get("/", authGuard, authorize("admin"), riderController.getRiders);
router.get(
  "/:id",
  authGuard,
  authorize("admin", "rider", "user"),
  riderController.getRiderById,
);
router.put(
  "/:id",
  authGuard,
  authorize("admin", "rider"),
  riderController.updateRider,
);
router.delete(
  "/:id",
  authGuard,
  authorize("admin"),
  riderController.deleteRider,
);

export default router;
