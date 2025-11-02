import './config.js';
import express from 'express';
import passport from 'passport';
import './middleware/passport.middleware.js';

// routes
import authRoutes from './routes/auth.routes.js';
import habitRouter from './routes/habit.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(passport.initialize());

app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRouter);

app.get('/api', (req, res) => {
  res.json({ message: 'test' });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
