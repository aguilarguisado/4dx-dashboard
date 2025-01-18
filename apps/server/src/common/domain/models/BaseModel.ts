import { z } from 'zod';

export const IdModelSchema = z.object({
	id: z.string(),
});

export const TimestampedModelSchema = z.object({
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
});

export const BaseModelSchema = IdModelSchema.extend(TimestampedModelSchema.shape);

export type IdModel = z.infer<typeof IdModelSchema>;
export type BaseModel = z.infer<typeof BaseModelSchema>;
