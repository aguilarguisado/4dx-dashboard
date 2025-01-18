import { mockProgressScoreboard, mockSeriesScoreboard } from './ScoreboardMocks';
import { LagMeasurement } from '../LagMeasurement';

export const mockLag: Readonly<LagMeasurement> = { id: 'Lag123', title: 'dummyLag' };
export const mockLagWithProgressScoreboard: Readonly<LagMeasurement> = {
	...mockLag,
	scoreboard: mockProgressScoreboard,
};
export const mockLagWithSeriesScoreboard: Readonly<LagMeasurement> = { ...mockLag, scoreboard: mockSeriesScoreboard };
