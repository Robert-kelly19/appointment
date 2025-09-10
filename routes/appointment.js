import express from "express"
import { cancelAppointment, createAppointment } from "../controller/appointment-controller.js";
import { createAppointmentvalidator } from "../validator/appointment-validator.js";
import appointAuth from "../middlewares/appointAuth.js";

const router = express.Router();
/** 
 * 
 * @swagger
 * /:
 * post:
 * summary: book appointment
 * tags[appointment]
 * description: book appointment for authenticated user.
 * security:
 *  - bearerAuth: [] # Indicates this route requires the 'bearerAuth' scheme
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 * properties:
 *     slotId: { type: string, example: 5e64a4c6-9ead-4a69-aca0-3bbf5583aac0}
 * responses:
 *       201:
 *         description:  appointment successfully booked.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/appointment' }
 *  400:
 *         description: Time slot unavailable or already booked.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         description: Unauthorized (Missing or invalid token).
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 **/
router.post("/",createAppointmentvalidator, appointAuth ,createAppointment )

/** 
 * 
 * @swagger
 * /cancel:
 * post:
 * summary: book appointment
 * tags[appointment]
 * description: cancel appointment for authenticated user.
 * security:
 *  - bearerAuth: [] # Indicates this route requires the 'bearerAuth' scheme
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 * properties:
 *     slotid: { type: string, example: 5e64a4c6-9ead-4a69-aca0-3bbf5583aac0}
 * responses:
 *       201:
 *         description:  appointment successfully canceled.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/appointment' }
 *  400:
 *         description: Validation error.5e64a4c6-9ead-4a69-aca0-3bbf5583aac0
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *   404:
 *         description: time slot not found.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 * 
 *       401:
 *         description: Unauthorized (Missing or invalid token).
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 **/

router.patch("/cancel",appointAuth,cancelAppointment)

export default router