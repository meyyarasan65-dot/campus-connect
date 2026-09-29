import { z } from 'zod';

export const createClubSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    description: z.string().min(10),
    category: z.string().optional(),
    logoUrl: z.string().url().optional(),
  }),
});

export const updateClubSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    description: z.string().min(10).optional(),
    category: z.string().optional(),
    logoUrl: z.string().url().optional(),
  }),
});
