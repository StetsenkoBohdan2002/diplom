/* istanbul ignore file */
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import queriesRouter from './routers/queriesRouter.js';

const app = express();
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || 'String';
  res.status(status).json({ message });
}
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/queries', queriesRouter);

app.use(errorHandler);

// Server listen
export default app;