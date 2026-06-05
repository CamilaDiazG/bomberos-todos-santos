import { z } from 'zod'

const emptyToNull = (value: unknown) => value === '' ? null : value

const booleanFromForm = (value: unknown) => {
  if (typeof value === 'boolean') return value
  return value === 'true' || value === 'on'
}

export const eventSchema = z.object({
  title_es: z.string().trim().min(1, 'El titulo en espanol es obligatorio'),
  title_en: z.string().trim().min(1, 'El titulo en ingles es obligatorio'),
  description_es: z.preprocess(emptyToNull, z.string().nullable().optional()),
  description_en: z.preprocess(emptyToNull, z.string().nullable().optional()),
  type: z.enum(['fundraiser', 'course', 'community', 'training']),
  starts_at: z.preprocess(emptyToNull, z.string().nullable().optional()),
  ends_at: z.preprocess(emptyToNull, z.string().nullable().optional()),
  location: z.preprocess(emptyToNull, z.string().nullable().optional()),
  capacity: z.preprocess(
    emptyToNull,
    z.coerce.number().int().nonnegative().nullable().optional()
  ),
  registration_url: z.preprocess(emptyToNull, z.string().url().nullable().optional()),
  published: z.preprocess(booleanFromForm, z.boolean()).default(true),
})

export type EventInput = z.input<typeof eventSchema>
