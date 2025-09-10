import Joi from "joi";

const validateregistration = Joi.object({
    email: Joi.string().email({maxDomainSegments: 2}).required(),
    providerName: Joi.string().min(3).max(30).required(), 
    job: Joi.string().min(3).max(30).required(),
    description: Joi.string().min(20).max(500),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    cfmpassword:Joi.ref('password'),
})

export const validateProvider = (req,res,next) => {
    const {error} = validateregistration.validate(res.body);
    if(error){
        return res.status(400).json({mesage:error.details[0].message})
    }
    next();
};

const LoginSchema = Joi.object({
    email: Joi.string().email({maxDomainSegments: 2}).required(),
    password: Joi.string().required(),
})

export const providerLoginvalidator = (req,res,next) => {
    const {error} = LoginSchema.validate(req.body);
    if(error){
        return res.status(400).json({mesage:error.details[0].message})
    }
    next();
}