import { z } from 'zod';

export const createEventSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    description: z.string().min(10),
    date: z.string().datetime(),
    location: z.string(),
    club: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Club ID').optional(),
    maxCapacity: z.number().int().positive().optional(),
    openToAlumni: z.boolean().optional(),
    coverImageUrl: z.string().url().optional(),
    tags: z.array(z.string()).optional(),
  }),
});
