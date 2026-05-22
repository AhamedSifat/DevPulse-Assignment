import express, { type Application } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './modules/auth/auth.route';
import issueRoute from './modules/issue/issue.route';
import globalErrorHandler from './middleware/globalErrorHandler';

const app: Application = express();

app.use(cors({
  origin: "*",
  credentials: true,

}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoute);
app.use(globalErrorHandler);

export default app;
