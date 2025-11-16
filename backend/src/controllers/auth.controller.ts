import type { Request, Response } from 'express';
import * as authService from '../services/auth.service.js';
import { refreshTokenOption } from '../config/cookie.config.js';

export const register = async (req: Request, res: Response) => {
  try {
    const existingUser = await authService.findUserByEmail(req.body.email);

    if (existingUser) {
      return res
        .status(409)
        .json({ message: 'Użytkownik o tym adresie email już istnieje!' });
    }

    const newUser = await authService.createUser(req.body);

    res.status(201).json({
      id: newUser.id,
      email: newUser.email,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Błąd serwera!' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { accessToken, refreshToken, user } = await authService.loginUser(
      req.body
    );

    res.cookie('refreshToken', refreshToken, refreshTokenOption);

    res.status(200).json({
      message: 'Zalogowano pomyślnie!',
      accessToken: accessToken,
      user: user,
    });
  } catch (err) {
    if (
      err instanceof Error &&
      (err.message.includes('użytkownika') || err.message.includes('hasło'))
    ) {
      return res.status(401).json({ message: 'Niepoprawny email lub hasło!' });
    }

    console.log(err);
    res.status(500).json({ message: 'Błąd serwera!' });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const tokenFromCookie = req.cookies.refreshToken;

    if (!tokenFromCookie) {
      return res.status(401).json({ message: 'Brak refresh Tokena' });
    }

    const data = await authService.refreshAccessToken(tokenFromCookie);

    res.status(200).json(data);
  } catch (err) {
    res.status(401).json({ message: 'Niepoprawny lub nieważny Refresh Token' });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    const tokenFromCookie = req.cookies.refreshToken;

    if (tokenFromCookie) {
      await authService.logoutUser(tokenFromCookie);
    }

    res.cookie('refreshToken', '', { ...refreshTokenOption, maxAge: 0 });

    res.status(200).json({ message: 'Wylogowano pomyślnie' });
  } catch (err) {
    res.status(500).json({ message: 'Wystąpił błąd podczas wylogowania' });
  }
};
