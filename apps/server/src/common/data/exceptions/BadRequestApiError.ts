import { ApiError, TRPCOpts } from './ApiError';

import { IntlObject } from 'i18n';

export type BadRequestApiErrorTRPCArgs = Omit<TRPCOpts, 'code'>;

export class BadRequestApiError extends ApiError {
	constructor(intlObject?: IntlObject | string, args: BadRequestApiErrorTRPCArgs = {}) {
		super({ ...args, code: 'BAD_REQUEST' }, intlObject);
	}
}
