import { z } from 'zod';

export const createUrlSchema = z.object({
  body: z.object({
    originalUrl: z.string().url(),
    customCode: z.string().min(3).max(20).optional(),
    expirationDate: z.string().datetime().optional(),
  })
});

export const updateUrlSchema = z.object({
  body: z.object({
    originalUrl: z.string().url().optional(),
    expirationDate: z.string().datetime().optional().nullable(),
  }),
  params: z.object({
    id: z.string()
  })
});
