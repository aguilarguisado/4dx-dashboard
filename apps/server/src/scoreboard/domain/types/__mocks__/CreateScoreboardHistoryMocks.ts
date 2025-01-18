import { mockWIGWithSeriesScoreboard } from '../../../../wig/domain/models/__mocks__/WIGMocks';
import { mockLagWithSeriesScoreboard } from '../../../../wig/domain/types/__mocks__/LagMeasurementMocks';
import { mockLeadWithSeriesScoreboard } from '../../../../wig/domain/types/__mocks__/LeadMeasurementMocks';
import { CreateScoreboardHistory } from '../CreateScoreboardHistory';

export const mockCreateScoreboardHistoryWIG: Readonly<CreateScoreboardHistory> = {
	wigId: mockWIGWithSeriesScoreboard.id,
	containerId: mockWIGWithSeriesScoreboard.id,
	scoreboardId: mockWIGWithSeriesScoreboard.scoreboard?.id as string,
	containerType: 'wig',
	date: new Date(),
	value: 50,
	comment: 'Test comment',
};

export const mockCreateScoreboardHistoryLag: Readonly<CreateScoreboardHistory> = {
	...mockCreateScoreboardHistoryWIG,
	containerType: 'lag',
	containerId: mockLagWithSeriesScoreboard.id,
};

export const mockCreateScoreboardHistoryLead: Readonly<CreateScoreboardHistory> = {
	...mockCreateScoreboardHistoryWIG,
	containerType: 'lead',
	containerId: mockLeadWithSeriesScoreboard.id,
};
