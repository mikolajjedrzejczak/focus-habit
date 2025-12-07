import bcrypt from 'bcryptjs';
import db from '../db';
import type { LoginBody, RegisterBody } from '../validators/auth.validator';
import crypto from 'crypto';
import { generateAccessToken, hashToken } from '../utils/token.utils';

export const findUserByEmail = (email: string) => {
  return db.user.findUnique({
    where: { email },
  });
};

export const generateRefreshToken = async (userId: string) => {
  const newRefreshToken = crypto.randomBytes(64).toString('hex');

  await db.user.update({
    where: { id: userId },
    data: {
      refreshToken: newRefreshToken,
    },
  });

  return newRefreshToken;
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
  if (!isPasswordValid) throw new Error('Niepoprawne hasło!');

  const accessToken = generateAccessToken(user.id);

  const newRefreshToken = crypto.randomBytes(64).toString('hex');

  const hashedRefreshToken = hashToken(newRefreshToken);

  await db.user.update({
    where: { id: user.id },
    data: {
      refreshToken: hashedRefreshToken,
    },
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
    user: { id: user.id, email: user.email },
  };
};

export const refreshAccessToken = async (token: string) => {
  const hashedToken = hashToken(token);

  const user = await db.user.findUnique({
    where: { refreshToken: hashedToken },
  });

  if (!user) throw Error('Niepoprawny refresh token!');

  const newAccessToken = generateAccessToken(user.id);

  return {
    accessToken: newAccessToken,
    user: { id: user.id, email: user.email },
  };
};

export const logoutUser = async (token: string) => {
  const hashedToken = hashToken(token);

  await db.user.updateMany({
    where: { refreshToken: hashedToken },
    data: {
      refreshToken: null,
    },
  });
};
