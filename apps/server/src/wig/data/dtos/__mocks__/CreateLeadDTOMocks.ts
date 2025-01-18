import { mockWIG } from '../../../domain/models/__mocks__/WIGMocks';
import { mockProgressScoreboard } from '../../../domain/types/__mocks__/ScoreboardMocks';
import { CreateLeadDTO } from '../CreateLeadDTO';

export const mockCreateLeadDTO: Readonly<CreateLeadDTO> = {
	name: 'New Lead',
	wigId: mockWIG.id,
};

export const mockCreateLeadDTOWithScoreboard: Readonly<CreateLeadDTO> = {
	...mockCreateLeadDTO,
	scoreboard: mockProgressScoreboard,
};
