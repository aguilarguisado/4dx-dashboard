import { ApiError, TRPCOpts } from './ApiError';

import { IntlObject } from 'i18n';

export type InternalServerApiErrorTRPCArgs = Omit<TRPCOpts, 'code'>;

export class InternalServerApiError extends ApiError {
	constructor(intlObject?: IntlObject | string, args: InternalServerApiErrorTRPCArgs = {}) {
		super({ ...args, code: 'INTERNAL_SERVER_ERROR' }, intlObject);
	}
}
