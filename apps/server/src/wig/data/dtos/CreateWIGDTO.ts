import { CreateWIG, CreateWIGSchema } from '../../domain/types/CreateWIG';

import { z } from 'zod';

export const CreateWIGDTOSchema = CreateWIGSchema;

export type CreateWIGDTO = z.infer<typeof CreateWIGDTOSchema>;

export const toCreateWIGModel = (dto: CreateWIGDTO): CreateWIG => {
	return dto as CreateWIG;
};
