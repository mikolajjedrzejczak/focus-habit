import './middleware/passport.middleware';
import express from 'express';
import passport from 'passport';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// routes
import authRoutes from './routes/auth.routes';
import habitRoutes from './routes/habit.routes';
import habitListRoutes from './routes/habitList.routes';

const app = express();

const rawOrigins = process.env.FRONTEND_URL || '';

const allowedOrigins = rawOrigins.split(',').map((url) => url.trim());

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/lists', habitListRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'test' });
});

export default app;
