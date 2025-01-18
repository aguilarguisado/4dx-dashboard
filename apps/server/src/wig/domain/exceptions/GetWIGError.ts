import { EntityNotExistsError } from '../../../common/domain/exceptions/EntityNotExistsError';
import { NotPermissionError } from '../../../common/domain/exceptions/NotPermissionError';
import { UnknownError } from '../../../common/domain/exceptions/UnknownError';

export type GetWIGError = UnknownError | EntityNotExistsError | NotPermissionError;
