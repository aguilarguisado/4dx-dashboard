import { EntityNotExistsError } from '../../../common/domain/exceptions/EntityNotExistsError';
import { NotPermissionError } from '../../../common/domain/exceptions/NotPermissionError';
import { UnknownError } from '../../../common/domain/exceptions/UnknownError';
import { Void } from '../../../common/domain/models/Void';
import { UseCase } from '../../../common/domain/UseCase';
import { WIGInteractor } from '../interactors/WIGInteractor';

import { inject, injectable } from 'inversify';
import { Either, EitherAsync } from 'purify-ts';

@injectable()
export class DeleteWIGUseCase implements UseCase<Void> {
	constructor(@inject(WIGInteractor) private wigInteractor: WIGInteractor) {}

	public async execute(
		organizationId: string,
		wig: string,
	): Promise<Either<UnknownError | EntityNotExistsError | NotPermissionError, Void>> {
		return EitherAsync.fromPromise(() => this.wigInteractor.delete(organizationId, wig));
	}
}
