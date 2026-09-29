import { z } from 'zod';

export const generateQrSchema = z.object({
  body: z.object({
    eventId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid Event ID'),
    points: z.number().int().positive(),
  }),
});

export const scanQrSchema = z.object({
  body: z.object({
    qrToken: z.string(),
  }),
});
