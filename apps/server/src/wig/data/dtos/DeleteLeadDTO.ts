import { IdModelSchema } from '../../../common/domain/models/BaseModel';

import { z } from 'zod';

export const DeleteLeadDTOSchema = IdModelSchema.extend({
	wigId: z.string(),
});

export type DeleteLeadDTO = z.infer<typeof DeleteLeadDTOSchema>;
