import './config.js';
import express from 'express';
import db from './db.js';

import bcrypt from 'bcryptjs';
import { z } from 'zod';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ message: 'test' });
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
