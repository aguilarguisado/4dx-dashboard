import { rebindMock, resetTestAppContainer } from '../../../../__tests__/TestUtils';
import { InternalServerApiError } from '../../../../common/data/exceptions/InternalServerApiError';
import { mockOrganization } from '../../../../organization/domain/models/__mocks__/OrganizationMocks';
import { CreateScoreboardEntryUseCase } from '../../../domain/usecases/CreateScoreboardEntryUseCase';
import { mockCreateScoreboardHistoryDTO } from '../../dtos/__mocks__/CreateScoreboardHistoryDTOMocks';
import { toCreateScoreboardHistoryModel } from '../../dtos/CreateScoreboardHistoryDTO';
import { ScoreboardHistoryControllerImpl } from '../ScoreboardHistoryControllerImpl';

import { Container } from 'inversify';
import { Left, Right } from 'purify-ts';

describe('ScoreboardHistoryControllerImpl', () => {
	let container: Container;

	beforeEach(() => {
		container = resetTestAppContainer();
	});

	describe('createScoreboardHistory', () => {
		it('should successfully create a scoreboard history entry', async () => {
			const mockCreateScoreboardEntryUseCase = {
				execute: vi.fn().mockResolvedValue(Right(mockCreateScoreboardHistoryDTO)),
			};
			rebindMock(container, CreateScoreboardEntryUseCase, mockCreateScoreboardEntryUseCase);
			const controller = container.get(ScoreboardHistoryControllerImpl);

			const result = await controller.createScoreboardHistory(
				mockOrganization.id,
				mockCreateScoreboardHistoryDTO,
			);

			expect(result).toEqual(mockCreateScoreboardHistoryDTO);
			expect(mockCreateScoreboardEntryUseCase.execute).toHaveBeenCalledWith(
				mockOrganization.id,
				mockCreateScoreboardHistoryDTO.wigId,
				expect.anything(),
			);
		});

		it('should handle and convert domain errors into API errors', async () => {
			const domainError = new Error('Domain specific error');
			const mockCreateScoreboardEntryUseCase = {
				execute: vi.fn().mockResolvedValue(Left(domainError)),
			};
			rebindMock(container, CreateScoreboardEntryUseCase, mockCreateScoreboardEntryUseCase);
			const controller = container.get(ScoreboardHistoryControllerImpl);

			await expect(
				controller.createScoreboardHistory(mockOrganization.id, mockCreateScoreboardHistoryDTO),
			).rejects.toThrow(InternalServerApiError);

			expect(mockCreateScoreboardEntryUseCase.execute).toHaveBeenCalledWith(
				mockOrganization.id,
				mockCreateScoreboardHistoryDTO.wigId,
				expect.anything(),
			);
		});

		it('should correctly transform input DTO to domain model', async () => {
			// Assuming the transformation function is being correctly mocked/tested elsewhere or is trivial
			const createScoreboardEntryModel = toCreateScoreboardHistoryModel(mockCreateScoreboardHistoryDTO);
			expect(createScoreboardEntryModel).toEqual(mockCreateScoreboardHistoryDTO);
		});
	});
});
