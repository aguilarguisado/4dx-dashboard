import { TRPCError } from '@trpc/server';
import { TRPC_ERROR_CODE_KEY } from '@trpc/server/rpc';
import { IntlObject } from 'i18n';

export type TRPCOpts = {
	code: TRPC_ERROR_CODE_KEY;
	cause?: unknown;
};

export class ApiError extends TRPCError {
	constructor(args: TRPCOpts, intlObject?: IntlObject | string) {
		const isString = typeof intlObject === 'string';
		const message = isString ? intlObject : JSON.stringify(intlObject ?? { id: 'error.unknown' });
		super({ ...args, message });
	}
}
