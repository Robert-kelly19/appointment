import { query } from "../config/db.js";
import logger from '../utils/logger.js'

export async function createTimeSlot(req,res,next) {
    const {day,startTime,endTime,reserved} = req.body
    const providerId = req.user.id

    try {
        const insertTimeSlot = `INSERT INTO timeslot (owner_id, day, start_time, end_time, is_reserved) 
        VALUES ($1, $2, $3, $4, COALESCE($5, FALSE)) RETURNING *;`;

    const result = await query(insertTimeSlot, [providerId,day, startTime, endTime,reserved])
    const newTimeSlot = result.rows[0]
    logger.info(`successfully created timeslot ${newTimeSlot.id} by ${providerId}`)
    return res.status(201).json(newTimeSlot)
    } catch (error) {
        logger.error(`Error creating time slot for ${providerId}:`, error)
        return res.status(500).json({message: error.message || 'server error while creating time slot'})
    }
}

export async function getTimeSlot(req,res,next) {
    const providerId=req.user.id
    try {
        const getslot = `SELECT id, day, start_time, end_time, is_reserved FROM timeslot WHERE owner_id = $1
                        `;
        const newResult= await query(getslot,[providerId])
        logger.debug(`fetched ${newResult.rows.length} time slot for provider:${providerId}`)
        return res.status(200).json(newResult.rows)
    } catch (error) {
        logger.error(`failed to get time slot for provider: ${providerId}`)
        return res.status(500).json({message: error.message|| 'server error while fetching time slot '})
    }
}

export async function  getSlotBYId(req,res,next) {
    const slotId = req.params.id
    const providerId = req.user.id

    try {
        const getslotId = `SELECT id, day,start_time, end_time, is_reserved FROM timeslot WHERE 
                            id = $1 AND owner_id = $2`;

        const result = await query(getslotId,[slotId, providerId])

        if(result.rows.length === 0){
            logger.warn(`slot not found or access denied to task ${slotId}, provider id ${providerId}`)
            return res.status(404).json({message: `task not found or access denied for ${slotId} with provider id:${providerId}`})
        }
        logger.debug(`fetched ${slotId} for ${providerId}`)
        return res.json(result.rows[0])
    } catch (error) {
       logger.error(`error while fetchin time slot${slotId}`)
       return res.status(500).json({message: error.message || `server error occured while fetching time slot ${slotId}`}) 
    }
}

export  async function updateTimeSlot(req,res,next) {
    const slotId = req.params.id
    const providerId = req.user.id
    const {day,startTime,endTime,is_reserved} = req.body

    try {
        const updateslot = `UPDATE timeslot SET day = $1, start_time = $2, end_time = $3, 
                            is_reserved = $4 WHERE id = $5 AND owner_id = $6 RETURNING *`;
        const result = await query(updateslot,[day,startTime,endTime,is_reserved,slotId,providerId])

        if(result.rows.length === 0){
            logger.warn(`update failed:slot not found or access denied to task ${slotId}, provider id ${providerId}`)
            const checkslot = `SELECT id FROM timeslot WHERE id = $1`
            const newResult = await query(checkslot,[slotId])
            if(newResult.rows.length === 0){
                return res.status(404).json({message:"time slot not found"})
            } else {
                return res.status(403).json({message:"you dont have permission for this time slot"})
            }
        }
        logger.info(`successfully updated time slot ${slotId} by provider ${providerId}`)
        return res.json(result.rows[0])
    } catch (error) {
        logger.error(`error updating time slot ${slotId} for provider ${providerId}:`,error)
        return res.status(error.status || 500).json({message:error.message||`error updating time slot ${slotId}`})
    }
}

export async function deleteSlot(req,res,next){
    const slotId = req.params.id
    const providerId = req.user.id
    try {
        const deleteSlot = `DELETE FROM timeslot WHERE id = $1 and owner_id = $2`;
        const result = await query(deleteSlot,[slotId,providerId])

        if(result.rows.length === 0){
            logger.warn(`fail to delete time slot ${slotId} or access denied for provider ${providerId} `)
            const checkExistance = `SELECT id FROM timeslot WHERE id = $1`;
            const newResult = await query(checkExistance, [slotId])
            if(newResult.rows.length === 0 ){
                return res.status(404).json({message:`time slot not found`})
            }else{
                return res.status(403).json({message:`you do not have permission for this time slot`})
            }
        }
        logger.info(`successfully deleted time slot:${slotId} by provider: ${providerId}`)
        return res.status(204).json({message:'time slot was deleted'})
    } catch (error) {
        logger.error(`error deleting time slot:${slotId} for provider:${providerId}:`,error)
        return res.status(error.status||500).json({message:error.message || `server error while deleting ${slotId}`})
    }
}