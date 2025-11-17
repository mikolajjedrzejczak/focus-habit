import type { Request, Response } from 'express';
import * as listService from '../services/habitList.service.js';

interface AuthenticateUser {
  id: string;
  email: string;
}

export const getAllList = async (req: Request, res: Response) => {
  try {
    const user = req.user as AuthenticateUser;
    const lists = await listService.findListsByUserId(user.id);
    res.status(200).json(lists);
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera ' });
  }
};

export const createList = async (req: Request, res: Response) => {
  try {
    const user = req.user as AuthenticateUser;
    const newList = await listService.createList(user.id, req.body);
    res.status(201).json(newList);
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera ' });
  }
};

export const updateList = async (req: Request, res: Response) => {
  try {
    const user = req.user as AuthenticateUser;
    const listId = req.params.id;

    if (!listId) {
      return res.status(400).json({ message: 'Brak id listy w URL' });
    }

    const result = await listService.updateList(user.id, listId, req.body);

    if (result.count === 0) {
      return res
        .status(404)
        .json({ message: 'Nie znaleziono listy lub brak uprawnień' });
    }

    res.status(200).json({ message: 'Lista zaktualizowana' });
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera ' });
  }
};

export const deleteList = async (req: Request, res: Response) => {
  try {
    const user = req.user as AuthenticateUser;
    const listId = req.params.id;

    if (!listId) {
      return res.status(400).json({ message: 'Brak id listy w URL' });
    }

    const result = await listService.deleteList(user.id, listId);

    if (result.count === 0) {
      return res
        .status(404)
        .json({ message: 'Nie znaleziono listy lub brak uprawnień' });
    }

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: 'Błąd serwera ' });
  }
};
