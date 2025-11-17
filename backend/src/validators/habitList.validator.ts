import z from 'zod';

export const createListSchema = z.object({
  name: z.string().min(1, 'Nazwa listy jest wymagana'),
});

export type CreateListBody = z.infer<typeof createListSchema>;

export const updateListSchema = z.object({
  name: z.string().min(1, 'Nazwa listy jest wymagana'),
});

export type UpdateListBody = z.infer<typeof updateListSchema>;
