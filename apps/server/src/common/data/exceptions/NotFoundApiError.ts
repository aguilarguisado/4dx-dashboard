import { ApiError, TRPCOpts } from './ApiError';

import { IntlObject } from 'i18n';

export type NotFoundApiTRPCArgs = Omit<TRPCOpts, 'code'>;

export class NotFoundApiError extends ApiError {
	constructor(intlObject?: IntlObject | string, args: NotFoundApiTRPCArgs = {}) {
		super({ ...args, code: 'NOT_FOUND' }, intlObject);
	}
}
