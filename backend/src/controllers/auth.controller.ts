import type { Request, Response } from 'express';
import { loginSchema, registerSchema } from '../validators/auth.validator.js';
import * as authService from '../services/auth.service.js';

export const register = async (req: Request, res: Response) => {
  const validationResult = registerSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      message: 'Błąd walidacji!',
      errors: validationResult.error.errors,
    });
  }

  const registerData = validationResult.data;

  try {
    const existingUser = await authService.findUserByEmail(registerData.email);

    if (existingUser) {
      return res
        .status(409)
        .json({ message: 'Użytkownik o tym adresie email już istnieje!' });
    }

    const newUser = await authService.createUser(registerData);

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
  const validationResult = loginSchema.safeParse(req.body);

  if (!validationResult.success) {
    return res.status(400).json({
      message: 'Błąd walidacji!',
      errors: validationResult.error.errors,
    });
  }

  try {
    const token = await authService.loginUser(validationResult.data);

    res.status(200).json({
      message: 'Zalogowano pomyślnie!',
      token: token,
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
