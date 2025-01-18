import { FormMode } from '@/types/forms';

import React, { createContext, ReactNode, useContext } from 'react';
import { ScoreboardHistoryType } from 'server/src/scoreboard/domain/models/ScoreboardHistory';

export type ScoreboardFormContextType = {
	namespace?: string;
	mode: FormMode;
	scoreboardId?: string;
	wigId: string;
	containerType: ScoreboardHistoryType;
	containerId: string;
};

// Create a context with a default value
const ScoreboardFormContext = createContext<ScoreboardFormContextType | undefined>(undefined);

type ScoreaboardFormProps = {
	value: ScoreboardFormContextType;
	children: ReactNode;
};

// Create a Provider Component
export const ScoreboardFormProvider: React.FC<ScoreaboardFormProps> = ({ value, children }) => {
	return <ScoreboardFormContext.Provider value={value}>{children}</ScoreboardFormContext.Provider>;
};

// Hook to use the context
export const useScoreboardFormContext = () => {
	const context = useContext(ScoreboardFormContext);
	if (context === undefined) {
		throw new Error('useScoreboardFormContext must be used within a ScoreboardFormContext');
	}
	return context;
};
