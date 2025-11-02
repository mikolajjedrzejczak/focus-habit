import bcrypt from 'bcryptjs';
import db from '../db.js';
import type { LoginBody, RegisterBody } from '../validators/auth.validator.js';
import jwt from 'jsonwebtoken';

export const findUserByEmail = (email: string) => {
  return db.user.findUnique({
    where: { email },
  });
};

export const createUser = async (data: RegisterBody) => {
  const { email, password } = data;

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await db.user.create({
    data: {
      email: email,
      password: hashedPassword,
    },
  });

  return user;
};

export const loginUser = async (data: LoginBody) => {
  const { email, password } = data;

  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error('Nie znaleziono użytkownika!');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error('Niepoprawne hasło!');
  }

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: '1d' }
  );

  return token;
};
