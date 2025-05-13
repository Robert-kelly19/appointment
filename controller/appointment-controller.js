import { query } from '../config/db.js';
import logger from '../utils/logger.js';

/**
 * Book a new appointment and notify via Socket.IO
 * Assumes `req.user.id` is available and `req.io` is set via middleware.
 */
export async function createAppointment(req, res, next) {
  const userid= req.user.id;
  const { slotId } = req.body;


  try {
    await query('BEGIN');

    // Check if slot is available
    const slotCheck = await query(
      `SELECT * FROM timeslot WHERE id = $1 AND is_reserved = FALSE`,
      [slotId]
    );

    if (slotCheck.rows.length === 0) {
      await query('ROLLBACK');
      return res.status(400).json({ message: 'Time slot unavailable or already booked.' });
    }

    // Insert appointment
    const insertAppointment = `
      INSERT INTO appointment (user_id, timeslot_id, status)
      VALUES ($1, $2,'booked') RETURNING *;
    `;
    const result = await query(insertAppointment, [userid,slotId]);
    const appointment = result.rows[0];

    // Mark slot as reserved
    await query(`UPDATE timeslot SET is_reserved = TRUE WHERE id = $1`, [slotId]);

    await query('COMMIT');

    logger.info(`Appointment booked: ${appointment.id} by client ${userid}`);

    return res.status(201).json({
      message: 'Appointment successfully booked.',
      appointment: appointment
    });

  } catch (error) {
    await query('ROLLBACK');
    logger.error('Error booking appointment:', error);
    return res.status(500).json({ message: 'Server error booking appointment' });
  } 
}

export const cancelAppointment = async (req, res, next) => {
  const clientId = req.user?.id;
  const { appointmentId } = req.body;

  if (!appointmentId) {
    return res.status(400).json({ message: "Appointment ID is required" });
  }

  try {
    await query('BEGIN');

    const checkResult = await query(
      `
      SELECT timeslot_id FROM appointment
      WHERE id = $1 AND user_id = $2 AND status = 'booked'
      `,
      [appointmentId, clientId]
    );

    if (checkResult.rowCount === 0) {
      await query('ROLLBACK');
      return res.status(404).json({ message: "Appointment not found or already cancelled" });
    }

    const timeslotId = checkResult.rows[0].timeslot_id;

    await query(`UPDATE appointment SET status = 'canceled' WHERE id = $1`, [appointmentId]);
    await query(`UPDATE timeslot SET is_reserved = FALSE WHERE id = $1`, [timeslotId]);

    await query('COMMIT');

    logger.info(`Appointment cancelled: ${appointmentId} by client ${clientId}`);
    res.json({ message: "Appointment cancelled successfully" });
  } catch (error) {
    await query('ROLLBACK');
    logger.error(`Error cancelling appointment ${appointmentId} for client ${clientId}:`, error);
    res.status(500).json({ message: "Server error cancelling appointment" });
  }
};

