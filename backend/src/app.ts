import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
//routes
import userRoutes from './routes/user.route'
import authRoutes from './routes/auth.route';
import songRoutes from './routes/song.route'
import albumRoutes from './routes/album.route';
import statRoutes from './routes/stat.route';
import adminRoutes from './routes/admin.route';
//db
import { connectToDb } from './db/connectToDb';
//middlewares
import errorMiddleware from './middlewares/error.middleware';
import {clerkMiddleware} from '@clerk/express'

dotenv.config();;

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(clerkMiddleware()) // add auth to request object make req.auth available
app.use(express.urlencoded({ extended: true }));
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for simplicity, adjust as needed
}));
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));

app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/stats', statRoutes);

app.use(errorMiddleware)

app.listen(port , async () => {
  await connectToDb();
  console.log(`Server running on http://localhost:${port}`);
});