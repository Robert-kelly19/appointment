import { query } from "../config/db.js";
import logger from "../utils/logger.js";
import bcrypt from "bcryptjs";

const Hash_salt = 10

export default async function providerRegisterHandler(req,res,next){
    const {providerName,email,password,job,description} = req.body
    try {
        const checkQuery = 'SELECT email FROM provider WHERE email=$1';
        const providerCheckQuery = await query(checkQuery,[email])

        if(providerCheckQuery.rows.length>0){
            logger.warn(`failed to register service provider: ${email} already exist`)
            return res.status(409).json({message:"Email already exist"})
        }
        const encryptPassword = await bcrypt.hash(password,Hash_salt)
        logger.debug(`password  encrypted for user:${providerName}`)

        const insertprovider = `INSERT INTO provider (providerName, email, password, job, description)
                            VALUES($1,$2,$3,$4,$5) RETURNING id`
        const newProviderResult = await query(insertprovider,[providerName,email,encryptPassword,job,description ])
        
        
        const newProvider = newProviderResult.rows[0]
        logger.info(`${newProvider.providerName} registered successfully`)

        return res.status(201).json({message:"successfully registered",
            providerid:{
                id:newProvider.id
            }
        })
    } catch (error) {
        logger.error(`An error occured while registering ${providerName}: `,error)
        next(error)
    }
}