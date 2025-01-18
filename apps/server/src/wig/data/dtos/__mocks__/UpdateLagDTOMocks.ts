import { mockWIG } from '../../../domain/models/__mocks__/WIGMocks';
import { mockProgressScoreboard } from '../../../domain/types/__mocks__/ScoreboardMocks';
import { UpdateLagDTO } from '../UpdateLagDTO';

export const mockUpdateLagDTO: Readonly<UpdateLagDTO> = {
	id: 'lead123',
	title: 'New Lag',
	wigId: mockWIG.id,
};

export const mockUpdateLagDTOWithScoreboard: Readonly<UpdateLagDTO> = {
	...mockUpdateLagDTO,
	scoreboard: mockProgressScoreboard,
};
