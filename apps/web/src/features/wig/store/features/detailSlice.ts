import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ScoreboardHistoryType } from 'server/src/scoreboard/domain/models/ScoreboardHistory';
import { UpdateGeneralSectionDTO } from 'server/src/wig/data/dtos/UpdateGeneralSectionDTO';
import { WIG } from 'server/src/wig/domain/models/WIG';
import { LagMeasurement } from 'server/src/wig/domain/types/LagMeasurement';
import { LeadMeasurement } from 'server/src/wig/domain/types/LeadMeasurement';
import { Scoreboard } from 'server/src/wig/domain/types/Scoreboard';

type WigDetailState = {
	wig: WIG | null;
};

type SetScoreboardAction = {
	containerType: ScoreboardHistoryType;
	containerId: string;
	scoreboard?: Scoreboard;
};

const initialState: WigDetailState = {
	wig: null,
};

export const WIGDetailSlice = createSlice({
	name: 'wig-detail',
	initialState,
	reducers: {
		setWigDetail: (state, action: PayloadAction<WIG>) => {
			state.wig = action.payload;
		},
		setWigDetailGeneral: (state, action: PayloadAction<Omit<UpdateGeneralSectionDTO, 'id'>>) => {
			if (state.wig) {
				state.wig = { ...state.wig, ...action.payload };
			}
		},
		setScoreboard: (state, action: PayloadAction<SetScoreboardAction>) => {
			const wig = state.wig;
			if (!wig) return;
			const containerType = action.payload.containerType;
			const containerId = action.payload.containerId;
			const scoreboard = action.payload.scoreboard;
			if (containerType === 'wig') {
				wig.scoreboard = scoreboard;
			} else if (containerType === 'lead') {
				const lead = wig?.leads?.find((lead) => lead.id === containerId);
				if (lead) {
					lead.scoreboard = scoreboard;
				}
				wig.leads = [...(wig.leads ?? [])];
			} else if (containerType === 'lag') {
				const lag = wig?.lags?.find((lag) => lag.id === containerId);
				if (lag) {
					lag.scoreboard = scoreboard;
				}
				wig.lags = [...(wig.lags ?? [])];
			}
		},
		addLead: (state, action: PayloadAction<LeadMeasurement>) => {
			if (state.wig) {
				if (!state.wig.leads) {
					state.wig.leads = [];
				}
				state.wig.leads.push(action.payload);
			}
		},
		updateLead: (state, action: PayloadAction<LeadMeasurement>) => {
			if (state.wig) {
				const lead = state.wig.leads?.find((lead) => lead.id === action.payload.id);
				if (lead) {
					Object.assign(lead, action.payload);
					const leads = state.wig.leads ?? [];
					state.wig.leads = [...leads];
				}
			}
		},
		removeLead: (state, action: PayloadAction<string>) => {
			if (state.wig) {
				state.wig.leads = state.wig.leads?.filter((lead) => lead.id !== action.payload);
			}
		},
		addLag: (state, action: PayloadAction<LagMeasurement>) => {
			if (state.wig) {
				if (!state.wig.lags) {
					state.wig.lags = [];
				}
				state.wig.lags.push(action.payload);
			}
		},
		updateLag: (state, action: PayloadAction<LagMeasurement>) => {
			if (state.wig) {
				const lag = state.wig.lags?.find((lag) => lag.id === action.payload.id);
				if (lag) {
					Object.assign(lag, action.payload);
					const lags = state.wig.lags ?? [];
					state.wig.lags = [...lags];
				}
			}
		},
		removeLag: (state, action: PayloadAction<string>) => {
			if (state.wig) {
				state.wig.lags = state.wig.lags?.filter((lag) => lag.id !== action.payload);
			}
		},
		cleanState: (state) => {
			state.wig = null;
		},
	},
});
export const {
	setWigDetail,
	setWigDetailGeneral,
	setScoreboard,
	addLead,
	updateLead,
	removeLead,
	addLag,
	updateLag,
	removeLag,
	cleanState,
} = WIGDetailSlice.actions;
