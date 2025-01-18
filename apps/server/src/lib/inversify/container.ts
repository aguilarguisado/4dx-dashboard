import { authModule } from '../../authentication/di';
import { organizationModule } from '../../organization/di';
import { scoreboardHistoryModule } from '../../scoreboard/di';
import { wigModule } from '../../wig/di';

import { Container } from 'inversify';

export const createNewContainer = () => {
	const container = new Container();
	container.load(authModule);
	container.load(organizationModule);
	container.load(wigModule);
	container.load(scoreboardHistoryModule);
	return container;
};

let container: Container | null = null;

export const getAppContainer = () => {
	if (container === null) {
		container = createNewContainer();
	}
	return container;
};

export const resetAppContainer = () => {
	container = null;
	return getAppContainer();
};
