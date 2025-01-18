import { mockOrganization } from '../../../../organization/domain/models/__mocks__/OrganizationMocks';
import { mockWIG } from '../../../../wig/domain/models/__mocks__/WIGMocks';
import { ScoreboardHistory } from '../ScoreboardHistory';

export const mockScoreboardHistory: ScoreboardHistory = {
	id: 'historyId',
	organizationId: mockOrganization.id,
	wigId: mockWIG.id,
	containerId: 'testContainer',
	scoreboardId: 'testScoreboard',
	containerType: 'wig',
	date: new Date(),
	value: 50,
};
