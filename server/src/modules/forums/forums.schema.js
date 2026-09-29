import { z } from 'zod';

export const createThreadSchema = z.object({
  body: z.object({
    title: z.string().min(5),
    content: z.string().min(10),
    category: z.string().min(2),
  }),
});

export const createPostSchema = z.object({
  body: z.object({
    content: z.string().min(2),
  }),
});
