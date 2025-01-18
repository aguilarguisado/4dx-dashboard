import { z } from 'zod';

// TODO: Show password pattern in frontend
const passwordValidation = new RegExp(
	/*
    Length: Between 8 and 20 characters. This range is manageable for most users to
      remember while providing sufficient complexity to defend against brute-force attacks.
    Character Types:
      Lowercase letter (?=.*[a-z]): At least one lowercase letter from a to z.
      Uppercase letter (?=.*[A-Z]): At least one uppercase letter from A to Z.
      Digit (?=.*\d): At least one digit from 0 to 9.
      Special character (?=.*[@$!%*?&]): At least one special character from the set @$!%*?&.
          This list can be adjusted based on your requirements or to include more symbols,
              but keep in mind that some symbols may be problematic on certain platforms or hard
              for users to type on mobile keyboards.
    */
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/,
);

export const AuthenticatedUserSchema = z.object({
	id: z.string(),
	email: z.string(),
	displayName: z.string(),
	role: z.string().optional().default('user'),
	organizationId: z.string(),
});

export const CreateUserSchema = AuthenticatedUserSchema.omit({ id: true }).extend({
	password: z
		.string()
		.min(1, { message: 'validation.error.required' })
		.regex(passwordValidation, { message: 'validation.error.weak_password' }),
});

export type AuthenticatedUser = z.infer<typeof AuthenticatedUserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
