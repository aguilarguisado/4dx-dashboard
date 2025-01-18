import { ApiError, TRPCOpts } from './ApiError';

import { IntlObject } from 'i18n';

export type ForbiddenApiErrorTRPCArgs = Omit<TRPCOpts, 'code'>;

export class ForbiddenApiError extends ApiError {
	constructor(intlObject?: IntlObject | string, args: ForbiddenApiErrorTRPCArgs = {}) {
		super({ ...args, code: 'FORBIDDEN' }, intlObject);
	}
}
