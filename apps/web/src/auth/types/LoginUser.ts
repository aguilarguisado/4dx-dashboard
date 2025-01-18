import { buildZodI18N } from 'i18n';
import { z } from 'zod';

export const LoginUserSchema = z.object({
	email: z.string().min(1, { message: buildZodI18N('validation.error.required') }),
	password: z.string().min(1, { message: buildZodI18N('validation.error.required') }),
});

export type LoginUser = z.infer<typeof LoginUserSchema>;
