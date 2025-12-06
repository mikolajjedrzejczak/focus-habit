import './middleware/passport.middleware.js';
import express from 'express';
import passport from 'passport';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// routes
import authRoutes from './routes/auth.routes.js';
import habitRoutes from './routes/habit.routes.js';
import habitListRoutes from './routes/habitList.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost', 'http://127.0.0.1'],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/lists', habitListRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'test' });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
