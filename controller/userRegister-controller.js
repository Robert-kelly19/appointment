import { query } from "../config/db.js";
import logger from "../utils/logger.js";
import bcrypt from "bcryptjs";

const Hash_salt = 10

export default async function userRegisterHandler(req,res,next){
    const {firstName, lastName,email,password} = req.body
    try {
        const checkQuery = 'SELECT email FROM users WHERE email=$1';
        const userCheckQuery = await query(checkQuery,[email])

        if(userCheckQuery.rows.length>0){
            logger.warn(`failed to register user: ${email} already exist`)
            return res.status(409).json({message:"Email already exist"})
        }
        const encryptPassword = await bcrypt.hash(password,Hash_salt)
        logger.debug(`password  encrypted for user:${firstName}`)

        const insertUser = `INSERT INTO users (first_name, last_name, email, password)
                            VALUES($1,$2,$3,$4) RETURNING first_name`
        const newUserResult = await query(insertUser,[firstName,lastName,email,encryptPassword ])
        
        const newUser = newUserResult.rows[0]
        logger.info(`${newUser.first_name}: registered successfully`)

        return res.status(201).json({message:"successfully registered",
            username:{
                name:newUser.first_name
            }
        })
    } catch (error) {
        logger.error(`An error occured while registering ${firstName}: `,error)
        next(error)
    }
}