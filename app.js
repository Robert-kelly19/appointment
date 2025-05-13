import express from 'express';
import path, { dirname } from 'path';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import indexRouter from './routes/index.js';
import usersRouter from './routes/users.js';
import authRouter from './routes/auth.js';
import slotRouter from './routes/timeSlot.js';
import appointmetRouter from './routes/appointment.js';
// import swaggerUi from "swagger-ui-express"
// import swaggerSpec from './swaggerConfig.js';
import { fileURLToPath } from 'url';
import winstonLogger from 'winston/lib/winston/config/index.js';

const app = express();
const __filename=fileURLToPath(import.meta.url)
const __dirname =dirname(__filename)

const morganFormat = process.env.NODE_ENV === "production" ? "dev" : 'combined'
app.use(morgan(morganFormat, { stream: winstonLogger.stream }));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth',authRouter);
app.use('/timeSlot', slotRouter);
app.use("/appointment", appointmetRouter)


// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app;
