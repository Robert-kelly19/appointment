import Joi from "joi";

const validateregistration = Joi.object({
    email: Joi.string().email({maxDomainSegments: 2}).required(),
    firstName: Joi.string().min(3).max(30).required(), 
    lastName: Joi.string().min(3).max(30).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    confirmpassword:Joi.ref('password'),
})

export const validateUser = (req,res,next) => {
    const {error} = validateregistration.validate(res.body);
    if(error){
        return res.status(400).json({mesage:error.details[0].message})
    }
    next();
};

const userLoginSchema = Joi.object({
    email: Joi.string().email({maxDomainSegments: 2}).required(),
    password: Joi.string().required(),
})

export const userLoginvalidator = (req,res,next) => {
    const {error} = userLoginSchema.validate(res.body);
    if(error){
        return res.status(400).json({mesage:error.details[0].message})
    }
    next();
}