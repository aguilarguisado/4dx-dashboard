import { EntityNotExistsError } from '../../../common/domain/exceptions/EntityNotExistsError';
import { UnknownError } from '../../../common/domain/exceptions/UnknownError';
import { UseCase } from '../../../common/domain/UseCase';
import { WIGInteractor } from '../interactors/WIGInteractor';
import { WIG } from '../models/WIG';

import { inject, injectable } from 'inversify';
import { Either, EitherAsync } from 'purify-ts';

@injectable()
export class GetWIGListUseCase implements UseCase<WIG[]> {
	constructor(@inject(WIGInteractor) private wigInteractor: WIGInteractor) {}

	public async execute(organizationId: string): Promise<Either<UnknownError | EntityNotExistsError, WIG[]>> {
		return EitherAsync.fromPromise(() => this.wigInteractor.getWIGListFromOrganization(organizationId));
	}
}
