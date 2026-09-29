import { z } from 'zod';

export const updateProfileSchema = z.object({
  body: z.object({
    studentId: z.string().optional(),
    department: z.string().optional(),
    batchYear: z.number().optional(),
    skills: z.array(z.string()).optional(),
    interests: z.array(z.string()).optional(),
    avatarUrl: z.string().url().optional(),
  }),
});
