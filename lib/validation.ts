import { z } from 'zod';

export const jobStatus = z.enum([
  'APPLIED',
  'SCREENING',
  'INTERVIEW',
  'OFFER',
  'REJECTED',
  'ON_HOLD',
]);

export const jobCreateSchema = z.object({
  title: z.string().min(2, 'Tittel må være minst 2 tegn'),
  company: z.string().min(1, 'Firma er påkrevd'),
  location: z.string().optional(),
  remote: z.boolean().default(false),
  source: z.string().optional(),
  status: jobStatus.default('APPLIED'),
  tags: z.array(z.string()).max(8, 'Maks 8 tags').optional(),
  url: z.string().optional().refine((val) => !val || val === '' || z.string().url().safeParse(val).success, {
    message: 'Ugyldig URL',
  }),
  salaryNote: z.string().optional(),
  appliedAt: z.coerce.date().optional(),
  nextActionAt: z.coerce.date().optional(),
});

export const jobUpdateSchema = jobCreateSchema.partial();

export const taskCreateSchema = z.object({
  jobId: z.string().optional(),
  title: z.string().min(2, 'Tittel må være minst 2 tegn'),
  dueAt: z.coerce.date().optional(),
});

export const taskUpdateSchema = z.object({
  title: z.string().min(2).optional(),
  dueAt: z.coerce.date().optional().nullable(),
  done: z.boolean().optional(),
});

export const noteCreateSchema = z.object({
  jobId: z.string().min(1, 'Job ID er påkrevd'),
  content: z.string().min(1, 'Innhold er påkrevd'),
});

export const contactCreateSchema = z.object({
  jobId: z.string().optional(),
  name: z.string().min(1, 'Navn er påkrevd'),
  email: z.string().email('Ugyldig e-post').optional().or(z.literal('')),
  phone: z.string().optional(),
  role: z.string().optional(),
});

export const documentUploadSchema = z.object({
  label: z.string().min(1, 'Label er påkrevd'),
  type: z.enum(['CV', 'COVER_LETTER', 'OTHER']),
  blobUrl: z.string().url('Ugyldig URL'),
  original: z.string().optional(),
});
