import Joi from "joi";

const timeslotSchema = Joi.object({
    day: Joi.date().required(),
    startTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
    endTime: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(),
    is_reserved: Joi.boolean().default(false)
})

export const createtimeSlotValidator = (req, res, next) => {
    const { error } = timeslotSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

const slotIdSchema =Joi.object({
    id: Joi.string().required()
})

export const getslotIdvalidator = (req,res,next) => {
    const {error} = slotIdSchema.validate(req.params)
    if (error){
        return res.status(400).json({message: error.details[0].message})
    }
    next()
}
