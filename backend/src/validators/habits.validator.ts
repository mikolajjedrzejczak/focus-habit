import { z } from 'zod';

export const createHabitSchema = z.object({
  name: z.string().min(1, 'Nazwa nawyku jest wymagana!'),
});

export type CreateHabitBody = z.infer<typeof createHabitSchema>;
