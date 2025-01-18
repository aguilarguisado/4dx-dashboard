import { Void } from '../../../common/domain/models/Void';
import { UseCase } from '../../../common/domain/UseCase';
import { GetWIGError } from '../exceptions/GetWIGError';
import { WIGInteractor } from '../interactors/WIGInteractor';
import { UpdateGeneralSection } from '../types/UpdateGeneralSection';

import { inject, injectable } from 'inversify';
import { Either, EitherAsync } from 'purify-ts';

@injectable()
export class UpdateWIGUseCase implements UseCase<Void> {
	constructor(@inject(WIGInteractor) private wigInteractor: WIGInteractor) {}

	public async execute(
		organizationId: string,
		updateGeneralSection: UpdateGeneralSection,
	): Promise<Either<GetWIGError, Void>> {
		return EitherAsync.fromPromise(() =>
			this.wigInteractor.getWIGFromOrganization(organizationId, updateGeneralSection.id),
		).chain(() => this.wigInteractor.update(updateGeneralSection));
	}
}
