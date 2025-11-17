import { z } from 'zod';

export const createHabitSchema = z.object({
  name: z.string().min(1, 'Nazwa nawyku jest wymagana!'),
  listId: z.string().uuid("Niepoprawny format ID listy")
});

export type CreateHabitBody = z.infer<typeof createHabitSchema>;
