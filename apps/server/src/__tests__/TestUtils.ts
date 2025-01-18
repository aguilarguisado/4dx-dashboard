import 'reflect-metadata';
import { resetAppContainer } from '../lib/inversify/container';

import { Container } from 'inversify';

// eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-unused-vars
type ServiceIdentifier<T> = symbol | string | Function;

export const rebindMock = <T>(
	container: Container,
	serviceIdentifier: ServiceIdentifier<T>,
	mock: Partial<T>,
): void => {
	container.rebind(serviceIdentifier).toConstantValue(mock as T);
};

export const resetTestAppContainer = () => resetAppContainer();
