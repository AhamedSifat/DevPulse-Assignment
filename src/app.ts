import express, { type Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

export default app;
