import pg from "pg"
import logger from "../utils/logger.js"
import dotenv from "dotenv"

dotenv.config();

const {Pool} = pg

const {DB_USER,DB_PASSWORD,DB_HOST,DB_NAME,DB_PORT, NODE_ENV} = process.env

if(!DB_USER || !DB_PASSWORD || !DB_HOST || !DB_NAME || !DB_PORT || !NODE_ENV) {
    logger.error("missing database enviroment variables, check your .env file")
    process.exit(1)
}

const pool = new Pool ({
    user: DB_USER,
    host: DB_HOST,
    database:  DB_NAME,
    password: DB_PASSWORD,
    host: DB_HOST,
    port: parseInt(DB_PORT, 10),
    connectionTimeoutMillis: 2000
})

logger.info(`Database is configured on: ${DB_NAME}`)
pool.on("connect", (client) => {
    logger.info(`Client connected from Pool (Total count: ${pool.totalCount}`)
})

const initialzeDbSchema = async () => {
    const client = await pool.connect ()

try {
    logger.info(`initailizing: ${DB_NAME} `)
    await client.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`)

    //user table
    await client.query(`
        CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        first_name VARCHAR(20) NOT NULL,
        last_name VARCHAR(20) NOT NULL,
        email VARCHAR(225) UNIQUE NOT NULL,
        password VARCHAR(225) NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );`
    )
    logger.info('successfully created user table')

    //service provider table
    await client.query(`
        CREATE TABLE IF NOT EXISTS provider (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        providerName VARCHAR(225) NOT NULL,
        email VARCHAR(225) UNIQUE NOT NULL,
        password VARCHAR(225) NOT NULL,
        job VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );`
    )
    logger.info('successfully created provider table')

    await client.query(`
      CREATE TABLE IF NOT EXISTS timeslot (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      owner_id UUID NOT NULL REFERENCES provider(id) ON DELETE CASCADE,
      day DATE NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      is_reserved  BOOLEAN DEFAULT FALSE NOT NULL
      );
      `)
    logger.info('successfully created timeslot table')
    
    await query(`  DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_status') THEN
          CREATE TYPE appointment_status AS ENUM ('booked', 'canceled');
        END IF;
      END$$;`);

      logger.info('enum type created successfully')
      
    await client.query(`
      CREATE TABLE IF NOT EXISTS appointment (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        timeslot_id UUID NOT NULL REFERENCES timeslot(id) ON DELETE CASCADE,
        status appointment_status NOT NULL DEFAULT 'booked'
      );
    `);
    
      logger.info('appoitment table created successfully')

} catch (error) {
    logger.error(`Error while loading InitialzeDbSchema`,error)
} finally{
    client.release()
}
}

const connectToDb = async () => {
    try {
      const client = await pool.connect()
      logger.info(`Database connection pool established successfully`)
      client.release()
    } catch (error) {
      logger.error('Unable to establish database connection pool', error)
      process.exit(1)
    }
  }

  const query = async (text, params) => {
    const start = Date.now()
    try {
      const response = await pool.query(text, params)
      const duration = Date.now() - start;
      logger.info(`Executed query: { text: ${text.substring(0, 100)}..., params: ${JSON.stringify(params)}, duration: ${duration}ms, rows: ${response.rowCount}}`);
      return response
    } catch (error) {
      logger.error(`Error executing query: { text: ${text.substring(0, 100)}..., params: ${JSON.stringify(params)}, error: ${error.message}}`);
      throw error
    }
  }

  export { pool, initialzeDbSchema, connectToDb, query }