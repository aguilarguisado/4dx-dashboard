import { EntityNotExistsError } from '../../../common/domain/exceptions/EntityNotExistsError';
import { SLAError } from '../../../common/domain/exceptions/SLAError';
import { UnknownError } from '../../../common/domain/exceptions/UnknownError';
import { IdModel } from '../../../common/domain/models/BaseModel';
import { UseCase } from '../../../common/domain/UseCase';
import { WIGInteractor } from '../interactors/WIGInteractor';
import { CreateWIG } from '../types/CreateWIG';

import { inject, injectable } from 'inversify';
import { Either, EitherAsync } from 'purify-ts';

@injectable()
export class CreateWIGUseCase implements UseCase<IdModel> {
	constructor(@inject(WIGInteractor) private wigInteractor: WIGInteractor) {}

	public async execute(
		organizationId: string,
		createWIG: CreateWIG,
	): Promise<Either<UnknownError | EntityNotExistsError | SLAError, IdModel>> {
		return EitherAsync.fromPromise(() => this.wigInteractor.create(organizationId, createWIG));
	}
}
