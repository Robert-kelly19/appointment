import { query } from "../config/db.js";
import logger from "../utils/logger.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'

export default async function userloginHandler(req,res,next) {
    const {email,password} = req.body

    try {
        const findUser = 'SELECT id,first_name,last_name,email,password FROM users WHERE email = $1'
        const findUserResult = await query(findUser,[email])

        if(findUserResult.rowCount === 0) {
            logger.info(`login attempt failed, ${email} not found`)
            return res.status(401).json({message: "invalid credentials"})
        }
        const user=findUserResult.rows[0]

        const passwordMatch = await bcrypt.compare(password, user.password)

        if(!passwordMatch){
            logger.warn(`Login failed, invalid password for: ${email}`)
            return res.status(401).json({meassage:"Invalid password"})
        }

        const payload = {
            user: {
                id: user.id,
                email: user.email
            }
        }
        jwt.sign(payload, process.env.JWT_SECRET,{
            expiresIn: process.env.JWT_EXPIRES_IN
        }, (err, token) => {
            if(err){
                logger.error(`error generating jwt for ${email}: `, err)
                throw new Error('Error generating authentication token')
            }
            logger.info(`user ${email} logged in successfully`)
            res.json({
                message: `successfully logged into account`,
                token: token,
                user: {
                    id: user.id,
                    firstName: user.first_name,
                    lastName: user.last_name,
                    email: user.email
                }
            })
        })
    } catch (error) {
        logger.error(`error occured during the login process`, error)
        res.status(500).json({message: error.message || 'server error during login'})
    }
}