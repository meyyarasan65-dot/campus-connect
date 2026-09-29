import { z } from 'zod';

export const createAnnouncementSchema = z.object({
  body: z.object({
    title: z.string().min(3),
    content: z.string().min(10),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    targetDepartments: z.array(z.string()).optional(),
    targetBatches: z.array(z.number()).optional(),
    attachments: z.array(z.string().url()).optional(),
  }),
});
