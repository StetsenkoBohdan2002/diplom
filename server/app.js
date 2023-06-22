// Репозиторій проект: https://github.com/StetsenkoBohdan2002/diplom
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import queriesRouter from './routers/queriesRouter.js';
import errorHandler from './errorHandler.js';
const app = express();
dotenv.config();
mongoose
  .connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/api/queries', queriesRouter);

app.use(errorHandler);

// Server listen
app.listen(3000, () => console.log('Server listening to port 3000'));
