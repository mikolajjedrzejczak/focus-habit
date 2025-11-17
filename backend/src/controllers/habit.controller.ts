import type { Request, Response } from 'express';
import * as habitService from '../services/habit.service.js';

interface AuthenticatedUser {
  id: string;
  email: string;
}

export const createHabit = async (req: Request, res: Response) => {
  try {
    const user = req.user as AuthenticatedUser;
    const newHabit = await habitService.createHabit(user.id, req.body);
    res.status(201).json(newHabit);
  } catch (err) {
    if (err instanceof Error && err.message.includes('uprawnień')) {
      return res.status(404).json({ message: err.message });
    }
    res.status(500).json({ message: 'Błąd serwera' });
  }
};

export const deleteHabit = async (req: Request, res: Response) => {
  try {
    const user = req.user as AuthenticatedUser;
    const habitId = req.params.id as string;

    const result = await habitService.deleteHabitById(user.id, habitId);

    if (result.count === 0) {
      return res.status(404).json({ message: 'Nie znaleziono nawyku!' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera' });
  }
};

export const toggleHabit = async (req: Request, res: Response) => {
  try {
    const user = req.user as AuthenticatedUser;
    const habitId = req.params.id as string | undefined;

    if (!habitId) {
      return res.status(400).json({ message: 'Brak id nawyku' });
    }

    const result = await habitService.toggleHabitEntry(user.id, habitId);

    res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error && error.message.includes('uprawnień')) {
      return res.status(404).json({ message: 'Nie znaleziono nawyku' });
    }
    res.status(500).json({ message: 'Wewnętrzny błąd serwera' });
  }
};
