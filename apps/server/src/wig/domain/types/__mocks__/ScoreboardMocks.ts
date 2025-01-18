import { Scoreboard } from '../Scoreboard';

export const mockProgressScoreboard: Readonly<Scoreboard> = {
	id: '123',
	visualizationType: 'progress' as const,
	config: { init: 0, target: 100, current: 50 },
};

export const mockSeriesScoreboard: Readonly<Scoreboard> = {
	id: '123',
	visualizationType: 'series' as const,
	config: { label: 'dummyLabel', type: 'line' as const },
	data: [
		{ label: new Date('2021-01-01'), value: 10 },
		{ label: new Date('2021-01-02'), value: 20 },
	],
};
