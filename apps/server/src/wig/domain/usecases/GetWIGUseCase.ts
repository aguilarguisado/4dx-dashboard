import { UseCase } from '../../../common/domain/UseCase';
import { GetWIGError } from '../exceptions/GetWIGError';
import { WIGInteractor } from '../interactors/WIGInteractor';
import { WIG } from '../models/WIG';

import { inject, injectable } from 'inversify';
import { Either, EitherAsync } from 'purify-ts';

@injectable()
export class GetWIGUseCase implements UseCase<WIG> {
	constructor(@inject(WIGInteractor) private wigInteractor: WIGInteractor) {}

	public async execute(organizationId: string, wigId: string): Promise<Either<GetWIGError, WIG>> {
		return EitherAsync.fromPromise(() => this.wigInteractor.getWIGFromOrganization(organizationId, wigId));
	}
}
