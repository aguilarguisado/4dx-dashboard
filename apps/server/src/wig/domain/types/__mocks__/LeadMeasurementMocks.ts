import { mockProgressScoreboard, mockSeriesScoreboard } from './ScoreboardMocks';
import { LeadMeasurement } from '../LeadMeasurement';

// Make it unmodifiables

export const mockLead: Readonly<LeadMeasurement> = { id: 'Lead123', name: 'dummyLead' };
export const mockLeadWithProgressScoreboard: Readonly<LeadMeasurement> = {
	...mockLead,
	scoreboard: mockProgressScoreboard,
};
export const mockLeadWithSeriesScoreboard: Readonly<LeadMeasurement> = {
	...mockLead,
	scoreboard: mockSeriesScoreboard,
};
