import { z } from 'zod';

export const WIGIdDTOSchema = z.object({
	wigId: z.string(),
});

export type WIGIdDTO = z.infer<typeof WIGIdDTOSchema>;
