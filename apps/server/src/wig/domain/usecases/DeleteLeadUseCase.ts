import { Void } from '../../../common/domain/models/Void';
import { UseCase } from '../../../common/domain/UseCase';
import { GetWIGError } from '../exceptions/GetWIGError';
import { WIGInteractor } from '../interactors/WIGInteractor';

import { inject, injectable } from 'inversify';
import { Either, EitherAsync } from 'purify-ts';

@injectable()
export class DeleteLeadUseCase implements UseCase<Void> {
	constructor(@inject(WIGInteractor) private wigInteractor: WIGInteractor) {}

	public async execute(organizationId: string, wigId: string, leadId: string): Promise<Either<GetWIGError, Void>> {
		return EitherAsync.fromPromise(() => this.wigInteractor.getWIGFromOrganization(organizationId, wigId)).chain(
			(wig) => this.wigInteractor.deleteLead(wig, leadId),
		);
	}
}
