import { z } from 'zod';
export const LoggedUserSchema = z.object({
	id: z.string(),
	email: z.string(),
	name: z.string().nullable(),
	token: z.string(),
});

export type LoggedUser = z.infer<typeof LoggedUserSchema>;
