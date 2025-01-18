import { mockOrganization } from '../../../../organization/domain/models/__mocks__/OrganizationMocks';
import { mockProgressScoreboard, mockSeriesScoreboard } from '../../types/__mocks__/ScoreboardMocks';
import { WIG } from '../WIG';

export const mockWIG: Readonly<WIG> = {
	id: 'wig123',
	name: 'dummy',
	organizationId: mockOrganization.id,
	isOrganizational: false,
};

export const mockWIGOrganizational: Readonly<WIG> = {
	id: 'wig456',
	name: 'dummy2',
	organizationId: mockOrganization.id,
	isOrganizational: true,
};

export const mockWIGList: ReadonlyArray<WIG> = [mockWIG, mockWIGOrganizational];
export const mockWIGWithScoreboard: Readonly<WIG> = {
	...mockWIG,
	scoreboard: mockProgressScoreboard,
};
export const mockWIGWithSeriesScoreboard: Readonly<WIG> = {
	...mockWIG,
	scoreboard: mockSeriesScoreboard,
};
