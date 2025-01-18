import pino, { Logger } from 'pino';

// This implementation does not follow the Clean Architecture principles.
// It is a simple wrapper around the pino logger.
// It should be replaced by an interface in the domain layer, with DI in the data layer to
// not depend on any external library in domain (but for zod, which is a validation library).
let loggerInstance: Logger | undefined;

export const getLogger = () => {
	if (!loggerInstance) {
		loggerInstance = pino({
			level: process.env.NODE_ENV === 'test' ? 'silent' : 'info',
		});
	}
	return loggerInstance;
};

export const resetLogger = () => {
	loggerInstance = undefined;
	return getLogger();
};
