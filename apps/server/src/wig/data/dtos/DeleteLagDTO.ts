import { IdModelSchema } from '../../../common/domain/models/BaseModel';

import { z } from 'zod';

export const DeleteLagDTOSchema = IdModelSchema.extend({
	wigId: z.string(),
});

export type DeleteLagDTO = z.infer<typeof DeleteLagDTOSchema>;
