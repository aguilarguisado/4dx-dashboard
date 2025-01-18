import { genericApiErrorConverter } from '../../../common/data/exceptions/utils';
import { CreateScoreboardEntryUseCase } from '../../domain/usecases/CreateScoreboardEntryUseCase';
import { CreateScoreboardHistoryDTO, toCreateScoreboardHistoryModel } from '../dtos/CreateScoreboardHistoryDTO';

import { inject, injectable } from 'inversify';

@injectable()
export class ScoreboardHistoryControllerImpl {
	constructor(
		@inject(CreateScoreboardEntryUseCase) private createScoreboardEntryUseCase: CreateScoreboardEntryUseCase,
	) {}

	async createScoreboardHistory(organizationId: string, createScoreboardEntryDTO: CreateScoreboardHistoryDTO) {
		const { wigId } = createScoreboardEntryDTO;
		const createScoreboardEntry = toCreateScoreboardHistoryModel(createScoreboardEntryDTO);
		return (await this.createScoreboardEntryUseCase.execute(organizationId, wigId, createScoreboardEntry))
			.mapLeft(genericApiErrorConverter)
			.unsafeCoerce();
	}
}
