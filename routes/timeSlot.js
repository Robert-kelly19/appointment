import express from 'express'
import { createtimeSlotValidator, getslotIdvalidator } from '../validator/timeslot-validator.js'
import { createTimeSlot, deleteSlot, getSlotBYId, getTimeSlot, updateTimeSlot } from '../controller/timeslot-controller.js'
import Auth from '../middlewares/Authmiddleware.js'
const router = express.Router()

/**
 * @swagger
 * /create-slot:
 *   post:
 *     summary: Create a new time slot
 *     tags: [timeSlot]
 *     description: Creates a new time slot for the authenticated provider.
 *     security:
 *       - bearerAuth: [] # Indicates this route requires the 'bearerAuth' scheme
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [date,startTime,endTime]
 *             properties:
 *               day: { type: date, example: 2025-05-6 }
 *               startTime: { type: string, example: 17:20 }
 *               endTime: { type: string, example: 17:26 }
 *               is_reserved: { type: boolean, default: false, example: false }
 *     responses:
 *       201:
 *         description: slot created successfully.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/time slot }
 *       400:
 *         description: Validation error.
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
*/
router.post("/create-slot",createtimeSlotValidator, Auth, createTimeSlot )

/**
 * @swagger
 * /getslot:
 *   get:
 *     summary: Get all slot for the user
 *     tags: [timeSlot]
 *     description: Retrieves a list of all tasks belonging to the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of time slot.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/time slot' }
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */

router.get("/getslot", Auth, getTimeSlot )

/**
 * @swagger
 * /timeSlot/{id}:
 *   get:
 *     summary: Get a specific task by ID
 *     tags: [timeSlot]
 *     description: Retrieves a single time slot by its ID, if it belongs to the authenticated provider.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the time slot to retrieve.
 *     responses:
 *       200:
 *         description: The requested time slot.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/timeSlot' }
 *       400:
 *         description: Invalid time slot ID format.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       404:
 *         description: time slot not found or not owned by user.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */

router.get("/:id",getslotIdvalidator, Auth, getSlotBYId)

/**
 * @swagger
 * /timeSlot/{id}:
 *   put:
 *     summary: Update a time slot by ID
 *     tags: [timeSlot]
 *     description: Updates an existing time slot belonging to the authenticated provider.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the time slot to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *               day: { type: date, example: 2025-05-6 }
 *               startTime: { type: string, example: 15:28 }
 *               endTime: { type: string, example: 16:24 }
 *               is_reserved: { type: boolean, default: false, example: true }
 *     responses:
 *       200:
 *         description: slot updated successfully.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Task' }
 *       400:
 *         description: Validation error or invalid time slot ID.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       403:
 *         description: Forbidden (provider does not own this time slot).
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       404:
 *         description: slot not found.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */

router.put("/:id/updateSlot",getslotIdvalidator, Auth, createtimeSlotValidator, updateTimeSlot)

/**
 * @swagger
 * /timeSlot/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [timeSlot]
 *     description: Deletes a time slot belonging to the authenticated provider.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The ID of the task to delete.
 *     responses:
 *       200:
 *         description: Task deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: time slot deleted successfully. }
 *       400:
 *         description: Invalid time slot ID format.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       403:
 *         description: Forbidden (provider does not own this task).
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       404:
 *         description: time slot not found.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 */

router.delete("/:id/delete-slot",getslotIdvalidator, Auth, deleteSlot)

export default router