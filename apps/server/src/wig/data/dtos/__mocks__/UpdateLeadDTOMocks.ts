import { mockWIG } from '../../../domain/models/__mocks__/WIGMocks';
import { mockProgressScoreboard } from '../../../domain/types/__mocks__/ScoreboardMocks';
import { UpdateLeadDTO } from '../UpdateLeadDTO';

export const mockUpdateLeadDTO: Readonly<UpdateLeadDTO> = {
	id: 'lead123',
	name: 'New Lead',
	wigId: mockWIG.id,
};

export const mockUpdateLeadDTOWithScoreboard: Readonly<UpdateLeadDTO> = {
	...mockUpdateLeadDTO,
	scoreboard: mockProgressScoreboard,
};
