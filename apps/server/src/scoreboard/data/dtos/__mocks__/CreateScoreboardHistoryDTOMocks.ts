import { mockWIG } from '../../../../wig/domain/models/__mocks__/WIGMocks';
import { CreateScoreboardHistoryDTO } from '../CreateScoreboardHistoryDTO';

export const mockCreateScoreboardHistoryDTO: Readonly<CreateScoreboardHistoryDTO> = {
	scoreboardId: 'scoreboard123',
	wigId: mockWIG.id,
	containerId: 'container123',
	containerType: 'wig',
	date: new Date(),
	value: 100,
};
