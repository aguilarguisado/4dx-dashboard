import { mockWIG } from '../../../domain/models/__mocks__/WIGMocks';
import { mockProgressScoreboard } from '../../../domain/types/__mocks__/ScoreboardMocks';
import { CreateLagDTO } from '../CreateLagDTO';

export const mockCreateLagDTO: Readonly<CreateLagDTO> = {
	wigId: mockWIG.id,
	title: 'New Lag',
};

export const mockCreateLagDTOWithScoreboard: Readonly<CreateLagDTO> = {
	...mockCreateLagDTO,
	scoreboard: mockProgressScoreboard,
};
