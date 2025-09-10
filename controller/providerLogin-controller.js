import { query } from "../config/db.js";
import logger from "../utils/logger.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'

export default async function providerloginHandler(req,res,next) {
    const {email,password} = req.body

    try {
        const findprovider = 'SELECT id,providerName,email,password, job, description FROM provider WHERE email = $1'
        const findproviderResult = await query(findprovider,[email])

        if(findproviderResult.rowCount === 0) {
            logger.info(`login attempt failed, ${email} not found`)
            return res.status(401).json({message: "invalid credentials"})
        }
        const provider=findproviderResult.rows[0]

        const passwordMatch = await bcrypt.compare(password, provider.password)

        if(!passwordMatch){
            logger.warn(`Login failed, invalid password for: ${email}`)
            return res.status(401).json({meassage:"Invalid password"})
        }

        const payload = {
            provider: {
                id: provider.id,
                email: provider.email,
            }
        }
        jwt.sign(payload, process.env.JWT_SECRET,{
            expiresIn: process.env.JWT_EXPIRES_IN
        }, (err, token) => {
            if(err){
                logger.error(`error generating jwt for ${email}: `, err)
                throw new Error('Error generating authentication token')
            }
            logger.info(`provider ${email} logged in successfully`)
            res.json({
                message: `successfully logged into account`,
                token: token,
                provider: {
                    id: provider.id,
                    providerName: provider.providerName,
                    email: provider.email
                }
            })
        })
    } catch (error) {
        logger.error(`error occured during the login process`, error)
        res.status(500).json({message: error.message || 'server error during login'})
    }
}