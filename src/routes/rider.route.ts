import express from "express";
import { riderController } from "../controllers/rider.controller";
import { authGuard, authorize } from "../middlewares/authGuard.middleware";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Riders
 *   description: Rider management endpoints
 */

/**
 * @swagger
 * /api/riders:
 *   get:
 *     summary: Get all riders
 *     tags: [Riders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of riders retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.get(
  "/",
  authGuard,
  authorize("admin", "user"),
  riderController.getRiders,
);

/**
 * @swagger
 * /api/riders/me:
 *   get:
 *     summary: Get the current authenticated rider
 *     tags: [Riders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Rider retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Rider not found
 */
router.get("/me", authGuard, authorize("rider"), riderController.getRider);

/**
 * @swagger
 * /api/riders/{id}:
 *   get:
 *     summary: Get a rider by ID
 *     tags: [Riders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Rider retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Rider not found
 */
router.get(
  "/:id",
  authGuard,
  authorize("admin", "user"),
  riderController.getRiderById,
);

/**
 * @swagger
 * /api/riders/me:
 *   put:
 *     summary: Update the current authenticated rider
 *     tags: [Riders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [Point]
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     minItems: 2
 *                     maxItems: 2
 *               isAvailable:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Rider updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Rider not found
 */
router.put("/me", authGuard, authorize("rider"), riderController.updateRider);

/**
 * @swagger
 * /api/riders/{id}:
 *   put:
 *     summary: Update a rider by ID
 *     tags: [Riders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     enum: [Point]
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     minItems: 2
 *                     maxItems: 2
 *               isAvailable:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Rider updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Rider not found
 */
router.put(
  "/:id",
  authGuard,
  authorize("admin", "rider"),
  riderController.updateRiderById,
);

export default router;
