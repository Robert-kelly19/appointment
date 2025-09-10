import express from 'express'
import userRegisterHandler from '../controller/userRegister-controller.js'
import { validateUser, userLoginvalidator } from '../validator/user-validator.js'
import Auth from '../middlewares/Authmiddleware.js'
import userloginHandler from '../controller/userLogin-controller.js'
import providerRegisterHandler from '../controller/providerRegistration-controller.js'
import { providerLoginvalidator, validateProvider} from '../validator/provider-validator.js'
import providerloginHandler from '../controller/providerLogin-controller.js'

const router = express.Router()


/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User and provider registration and login
**/


/**
 *
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     description: Creates a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
 *             properties:
 *               firstName: { type: string, example: Robert }
 *               lastName: { type: string, example: kelly }
 *               email: { type: string, format: email, example: robert@example.com }
 *               password: { type: string, format: password, example: P@word123 }
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: User registered successfuly! }
 *                 username:
 *                   type: object
 *                   properties:
 *                     firstname: { type: string }
 *       400:
 *         description: Validation error (e.g., passwords don't match, invalid email).
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       409:
 *         description: Email already in use.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error during registration.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *     security: [] # Override global security - this endpoint is public
 */

router.post("/userRegister",validateUser, userRegisterHandler )

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     description: Authenticates a user and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email: { type: string, format: email, example: john.doe@example.com }
 *               password: { type: string, format: password, example: P@sswOrd123 }
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Login successful! }
 *                 token: { type: string, description: JWT token for authentication }
 *                 user: { $ref: '#/components/schemas/User' }
 *       400:
 *         description: Validation error (e.g., missing fields).
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         description: Invalid credentials (email not found or password incorrect).
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error during login.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *     security: [] # Override global security - this endpoint is public
 */

router.post("/userlogin", userLoginvalidator, userloginHandler)

/**
 *
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new provider
 *     tags: [Authentication]
 *     description: Creates a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               -providerName
 *               -job
 *               -description
 *               - password
 *             properties:
 *               email: { type: string, format: email, example: robert@example.com }
 *               providerName: { type: string, example: kelly }
 *               job: {type: string, example: farmer}
 *               description: { type: string, example: open for two party }
 *               password: { type: string, format: password, example: P@word123 }
 *     responses:
 *       201:
 *         description: provider registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: User registered successfuly! }
 *                 providerid:
 *                   type: object
 *                   properties:
 *                     id: { type: string }
 *       400:
 *         description: Validation error (e.g., passwords don't match, invalid email).
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       409:
 *         description: Email already in use.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error during registration.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *     security: [] # Override global security - this endpoint is public
 */


router.post("/providerRegister", validateProvider, providerRegisterHandler)

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a provider
 *     tags: [Authentication]
 *     description: Authenticates a provider and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email: { type: string, format: email, example: john.doe@example.com }
 *               password: { type: string, format: password, example: P@sswOrd123 }
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: Login successful! }
 *                 token: { type: string, description: JWT token for authentication }
 *                 provider: { $ref: '#/components/schemas/provider' }
 *       400:
 *         description: Validation error (e.g., missing fields).
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       401:
 *         description: Invalid credentials (email not found or password incorrect).
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *       500:
 *         description: Server error during login.
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Error' }
 *     security: [] # Override global security - this endpoint is public
 */

router.post("/providerlogin",providerLoginvalidator,providerloginHandler)


export default router