import { getLogger } from '../Logger';

/* eslint-disable @typescript-eslint/no-explicit-any */
type BaseErrorOptions<T> = {
	kind: T;
	message: string;
	cause?: any;
};

export class BaseError<T extends string> extends Error {
	kind: T;
	message: string;
	cause: any;

	constructor({ kind, message, cause }: BaseErrorOptions<T>) {
		super();
		this.kind = kind;
		this.message = message;
		this.cause = cause;
		getLogger().error({ error: { kind, message, cause } });
	}
}
