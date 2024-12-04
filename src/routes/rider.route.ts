import express from "express";
import { riderController } from "../controllers/rider.controller";
import { authGuard, authorize } from "../middlewares/authGuard.middleware";

/**
 * @swagger
 * tags:
 *   name: Riders
 *   description: Rider management endpoints
 */
const router = express.Router();

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 riders:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Rider'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal Server Error
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 rider:
 *                   $ref: '#/components/schemas/Rider'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Rider not found
 *       500:
 *         description: Internal Server Error
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 rider:
 *                   $ref: '#/components/schemas/Rider'
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Rider not found
 *       500:
 *         description: Internal Server Error
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
 *             $ref: '#/components/schemas/RiderUpdate'
 *     responses:
 *       200:
 *         description: Rider updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 rider:
 *                   $ref: '#/components/schemas/Rider'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Rider not found
 *       500:
 *         description: Internal Server Error
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
 *             $ref: '#/components/schemas/RiderUpdate'
 *     responses:
 *       200:
 *         description: Rider updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 rider:
 *                   $ref: '#/components/schemas/Rider'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Rider not found
 *       500:
 *         description: Internal Server Error
 */
router.put(
  "/:id",
  authGuard,
  authorize("admin", "rider"),
  riderController.updateRiderById,
);

export default router;
