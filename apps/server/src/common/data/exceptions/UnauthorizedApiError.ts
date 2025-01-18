import { ApiError, TRPCOpts } from './ApiError';

import { IntlObject } from 'i18n';

export type UnauthorizedApiErrorTRPCArgs = Omit<TRPCOpts, 'code'>;

export class UnauthorizedApiError extends ApiError {
	constructor(intlObject?: IntlObject | string, args: UnauthorizedApiErrorTRPCArgs = {}) {
		super({ ...args, code: 'UNAUTHORIZED' }, intlObject);
	}
}
