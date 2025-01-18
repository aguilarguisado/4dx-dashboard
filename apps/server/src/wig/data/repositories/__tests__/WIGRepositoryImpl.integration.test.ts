import { resetTestAppContainer } from '../../../../__tests__/TestUtils';
import { EntityNotExistsError } from '../../../../common/domain/exceptions/EntityNotExistsError';
import { UnknownError } from '../../../../common/domain/exceptions/UnknownError';
import { resetDB } from '../../../../lib/firestore/FirestoreDB';
import { mockOrganization } from '../../../../organization/domain/models/__mocks__/OrganizationMocks';
import { WIG } from '../../../domain/models/WIG';
import { mockLag, mockLagWithProgressScoreboard } from '../../../domain/types/__mocks__/LagMeasurementMocks';
import { mockLead, mockLeadWithProgressScoreboard } from '../../../domain/types/__mocks__/LeadMeasurementMocks';
import { mockProgressScoreboard } from '../../../domain/types/__mocks__/ScoreboardMocks';
import { WIGRepositoryImpl } from '../WIGRepositoryImpl';

import { randomUUID } from 'crypto';
import { Container } from 'inversify';

describe('WIGRepositoryImpl', () => {
	let container: Container;
	let repository: WIGRepositoryImpl;
	let wigToCreate: WIG;
	let organizationId: string;
	beforeEach(async () => {
		container = resetTestAppContainer();
		repository = container.get(Symbol.for('WIGRepository'));
		vi.spyOn(repository, 'getCollectionPath').mockReturnValue('test_' + repository.getCollectionPath());
		organizationId = mockOrganization.id;
		wigToCreate = { id: randomUUID(), name: 'name', organizationId, isOrganizational: false };
		await repository.create(wigToCreate);
	});

	afterAll(async () => {
		await resetDB();
	});

	describe('getWIGListFromOrganization', () => {
		it('should get wig list from organization successfully', async () => {
			const result = await repository.getWIGListFromOrganization(mockOrganization.id);
			expect(result.isRight()).toBe(true);
			expect(result.extract()).toMatchObject([wigToCreate]);
		});

		it('should not get wigs from other organizations', async () => {
			const result = await repository.getWIGListFromOrganization('other');
			expect(result.isRight()).toBe(true);
			expect(result.extract()).toEqual([]);
		});

		it('should return an error if something unexpected happens', async () => {
			vi.spyOn(repository, 'getCollectionPath').mockImplementation(() => {
				throw new Error();
			});
			const result = await repository.getWIGListFromOrganization('dummy');
			expect(result.isLeft()).toBe(true);
			expect(result.extract()).toBeInstanceOf(UnknownError);
		});
	});

	describe('getWIGFromOrganization', () => {
		it('should get wig from organization successfully', async () => {
			const result = await repository.getWIGFromOrganization(organizationId, wigToCreate.id);
			expect(result.isRight()).toBe(true);
			expect(result.extract()).toMatchObject(wigToCreate);
		});

		it('should fail if the wig does not exist', async () => {
			const result = await repository.getWIGFromOrganization(organizationId, 'randomID');
			expect(result.isLeft()).toBe(true);
			expect(result.extract()).toBeInstanceOf(EntityNotExistsError);
		});

		it('should not get wig from other organizations', async () => {
			const result = await repository.getWIGFromOrganization('otherOrganization', wigToCreate.id);
			expect(result.isLeft()).toBe(true);
		});

		it('should return an error if something unexpected happens', async () => {
			vi.spyOn(repository, 'getCollectionPath').mockImplementation(() => {
				throw new Error();
			});
			const result = await repository.getWIGFromOrganization(organizationId, wigToCreate.id);
			expect(result.isLeft()).toBe(true);
			expect(result.extract()).toBeInstanceOf(UnknownError);
		});
	});

	describe('getOrganizationalWIGs', () => {
		it('should get organizational wigs successfully', async () => {
			const newWIG = { ...wigToCreate, id: randomUUID(), isOrganizational: true };
			await repository.create(newWIG);
			const result = await repository.getOrganizationalWIGs(organizationId);
			expect(result.isRight()).toBe(true);
			expect(result.extract()).toMatchObject([newWIG]);
		});

		it('should not return any organizational wig from other organization', async () => {
			const newWIG = { ...wigToCreate, id: randomUUID(), isOrganizational: true };
			await repository.create(newWIG);
			const result = await repository.getOrganizationalWIGs('other');
			expect(result.isRight()).toBe(true);
			expect(result.extract()).toMatchObject([]);
		});

		it('should return an error if something unexpected happens', async () => {
			vi.spyOn(repository, 'getCollectionPath').mockImplementation(() => {
				throw new Error();
			});
			const result = await repository.getOrganizationalWIGs(organizationId);
			expect(result.isLeft()).toBe(true);
			expect(result.extract()).toBeInstanceOf(UnknownError);
		});
	});

	describe('addLead', () => {
		it('should add lead to wig successfully', async () => {
			const lead = { id: 'leadId', name: 'leadName' };
			const result = await repository.addLead(wigToCreate.id, lead);
			expect(result.isRight()).toBe(true);
			const wigResult = await repository.getWIGFromOrganization(organizationId, wigToCreate.id);
			expect(wigResult.isRight()).toBe(true);
			const leads = wigResult.unsafeCoerce().leads;
			expect(leads).toMatchObject([lead]);
		});

		it('should fail if the wig does not exist', async () => {
			const lead = { id: 'leadId', name: 'leadName' };
			const result = await repository.addLead('otherId', lead);
			expect(result.isLeft()).toBe(true);
		});
	});

	describe('updateLead', () => {
		it('should update lead to wig successfully', async () => {
			const lead = { ...mockLead, id: 'id1' };
			await repository.addLead(wigToCreate.id, lead);
			const lead2 = { ...mockLead, id: 'id2' };
			await repository.addLead(wigToCreate.id, lead2);

			const updatedLead = { ...lead, name: 'updatedName' };
			const result = await repository.updateLead(wigToCreate.id, updatedLead);
			expect(result.isRight()).toBe(true);
			const wigResult = await repository.getWIGFromOrganization(organizationId, wigToCreate.id);
			expect(wigResult.isRight()).toBe(true);
			const leads = wigResult.unsafeCoerce().leads;
			expect(leads).toMatchObject([updatedLead, lead2]);
		});

		it('should update lead (with scoreboard) to wig successfully', async () => {
			const lead = { ...mockLeadWithProgressScoreboard, id: 'id1' };
			await repository.addLead(wigToCreate.id, lead);
			const lead2 = { ...mockLead, id: 'id2' };
			await repository.addLead(wigToCreate.id, lead2);

			const updatedLead = { ...lead, name: 'updatedName' };
			const result = await repository.updateLead(wigToCreate.id, updatedLead);
			expect(result.isRight()).toBe(true);
			const wigResult = await repository.getWIGFromOrganization(organizationId, wigToCreate.id);
			expect(wigResult.isRight()).toBe(true);
			const leads = wigResult.unsafeCoerce().leads;
			expect(leads).toMatchObject([updatedLead, lead2]);
		});

		it('should fail if the lead does not exist', async () => {
			const lead = { id: 'leadId', name: 'leadName' };
			const result = await repository.updateLead(wigToCreate.id, lead);
			expect(result.isLeft()).toBe(true);
			expect(result.extract()).toBeInstanceOf(EntityNotExistsError);
		});

		it('should fail if the wig does not exist', async () => {
			const lead = { id: 'leadId', name: 'leadName' };
			const result = await repository.updateLead('otherId', lead);
			expect(result.isLeft()).toBe(true);
			expect(result.extract()).toBeInstanceOf(EntityNotExistsError);
		});

		it('should return an error if something unexpected happens', async () => {
			const lead = { id: 'leadId', name: 'leadName' };
			vi.spyOn(repository, 'getCollectionPath').mockImplementation(() => {
				throw new Error();
			});
			const result = await repository.updateLead('otherId', lead);
			expect(result.isLeft()).toBe(true);
			expect(result.extract()).toBeInstanceOf(UnknownError);
		});
	});

	describe('deleteLead', () => {
		it('should delete lead from wig successfully', async () => {
			const lead = { id: 'leadId', name: 'leadName' };
			await repository.addLead(wigToCreate.id, lead);
			const result = await repository.deleteLead(wigToCreate.id, 'leadId');
			expect(result.isRight()).toBe(true);
			const wigResult = await repository.getWIGFromOrganization(organizationId, wigToCreate.id);
			expect(wigResult.isRight()).toBe(true);
			const leads = wigResult.unsafeCoerce().leads;
			expect(leads).toMatchObject([]);
		});

		it('should fail if the lead does not exist', async () => {
			const result = await repository.deleteLead(wigToCreate.id, 'leadId');
			expect(result.isLeft()).toBe(true);
			expect(result.extract()).toBeInstanceOf(EntityNotExistsError);
		});

		it('should fail if the wig does not exist', async () => {
			const result = await repository.deleteLead('otherId', 'leadId');
			expect(result.isLeft()).toBe(true);
			expect(result.extract()).toBeInstanceOf(EntityNotExistsError);
		});

		it('should return an error if something unexpected happens', async () => {
			vi.spyOn(repository, 'getCollectionPath').mockImplementation(() => {
				throw new Error();
			});
			const result = await repository.deleteLead(wigToCreate.id, 'leadId');
			expect(result.isLeft()).toBe(true);
			expect(result.extract()).toBeInstanceOf(UnknownError);
		});
	});

	describe('addLag', () => {
		it('should add lag to wig successfully', async () => {
			const lag = { id: 'lagId', title: 'lagName' };
			const result = await repository.addLag(wigToCreate.id, lag);
			expect(result.isRight()).toBe(true);
			const wigResult = await repository.getWIGFromOrganization(organizationId, wigToCreate.id);
			expect(wigResult.isRight()).toBe(true);
			const lags = wigResult.unsafeCoerce().lags;
			expect(lags).toMatchObject([lag]);
		});

		it('should fail if the wig does not exist', async () => {
			const lag = { id: 'lagId', title: 'lagName' };
			const result = await repository.addLag('otherId', lag);
			expect(result.isLeft()).toBe(true);
		});
	});

	describe('updateLag', () => {
		it('should update lag to wig successfully', async () => {
			const lag = { ...mockLag, id: 'id1' };
			await repository.addLag(wigToCreate.id, lag);
			const lag2 = { ...mockLag, id: 'id2' };
			await repository.addLag(wigToCreate.id, lag2);

			const updatedLag = { ...lag, title: 'updatedLagName' };
			const result = await repository.updateLag(wigToCreate.id, updatedLag);
			expect(result.isRight()).toBe(true);
			const wigResult = await repository.getWIGFromOrganization(organizationId, wigToCreate.id);
			expect(wigResult.isRight()).toBe(true);
			const lags = wigResult.unsafeCoerce().lags;
			expect(lags).toMatchObject([updatedLag, lag2]);
		});

		it('should update lag (with scoreboard) to wig successfully', async () => {
			const lag = { ...mockLagWithProgressScoreboard, id: 'id1' };
			await repository.addLag(wigToCreate.id, lag);
			const lag2 = { ...mockLag, id: 'id2' };
			await repository.addLag(wigToCreate.id, lag2);

			const updatedLag = { ...lag, title: 'updatedLagName' };
			const result = await repository.updateLag(wigToCreate.id, updatedLag);
			expect(result.isRight()).toBe(true);
			const wigResult = await repository.getWIGFromOrganization(organizationId, wigToCreate.id);
			expect(wigResult.isRight()).toBe(true);
			const lags = wigResult.unsafeCoerce().lags;
			expect(lags).toMatchObject([updatedLag, lag2]);
		});

		it('should fail if the lag does not exist', async () => {
			const lag = { id: 'lagId', title: 'lagName' };
			const result = await repository.updateLag(wigToCreate.id, lag);
			expect(result.isLeft()).toBe(true);
			expect(result.extract()).toBeInstanceOf(EntityNotExistsError);
		});

		it('should fail if the wig does not exist', async () => {
			const lag = { id: 'lagId', title: 'lagName' };
			const result = await repository.updateLag('otherId', lag);
			expect(result.isLeft()).toBe(true);
			expect(result.extract()).toBeInstanceOf(EntityNotExistsError);
		});

		it('should return an error if something unexpected happens', async () => {
			const lag = { id: 'lagId', title: 'lagName' };
			vi.spyOn(repository, 'getCollectionPath').mockImplementation(() => {
				throw new Error();
			});
			const result = await repository.updateLag('otherId', lag);
			expect(result.isLeft()).toBe(true);
			expect(result.extract()).toBeInstanceOf(UnknownError);
		});
	});

	describe('deleteLag', () => {
		it('should delete lag from wig successfully', async () => {
			const lag = { id: 'lagId', title: 'lagName' };
			await repository.addLag(wigToCreate.id, lag);
			const result = await repository.deleteLag(wigToCreate.id, 'lagId');
			expect(result.isRight()).toBe(true);
			const wigResult = await repository.getWIGFromOrganization(organizationId, wigToCreate.id);
			expect(wigResult.isRight()).toBe(true);
			const lags = wigResult.unsafeCoerce().lags;
			expect(lags).toMatchObject([]);
		});

		it('should fail if the lag does not exist', async () => {
			const result = await repository.deleteLag(wigToCreate.id, 'lagId');
			expect(result.isLeft()).toBe(true);
			expect(result.extract()).toBeInstanceOf(EntityNotExistsError);
		});

		it('should fail if the wig does not exist', async () => {
			const result = await repository.deleteLag('otherId', 'lagId');
			expect(result.isLeft()).toBe(true);
			expect(result.extract()).toBeInstanceOf(EntityNotExistsError);
		});

		it('should return an error if something unexpected happens', async () => {
			vi.spyOn(repository, 'getCollectionPath').mockImplementation(() => {
				throw new Error();
			});
			const result = await repository.deleteLag(wigToCreate.id, 'leadId');
			expect(result.isLeft()).toBe(true);
			expect(result.extract()).toBeInstanceOf(UnknownError);
		});
	});

	describe('setScoreboard', () => {
		it('should set scoreboard to wig successfully', async () => {
			const result = await repository.setScoreboard(wigToCreate.id, mockProgressScoreboard);
			expect(result.isRight()).toBe(true);
			const wigResult = await repository.getWIGFromOrganization(organizationId, wigToCreate.id);
			expect(wigResult.isRight()).toBe(true);
			const wig = wigResult.unsafeCoerce();
			expect(wig.scoreboard).toMatchObject(mockProgressScoreboard);
		});

		it('should fail if the wig does not exist', async () => {
			const result = await repository.setScoreboard('otherId', mockProgressScoreboard);
			expect(result.isLeft()).toBe(true);
		});
	});

	describe('clearScoreboardData', () => {
		it('should clear the data of the scoreboard of a wig successfully', async () => {
			await repository.setScoreboard(wigToCreate.id, mockProgressScoreboard);
			const result = await repository.clearScoreboardData(wigToCreate.id);
			expect(result.isRight()).toBe(true);
			const wigResult = await repository.getWIGFromOrganization(organizationId, wigToCreate.id);
			expect(wigResult.isRight()).toBe(true);
			const wig = wigResult.unsafeCoerce();
			expect(wig.scoreboard).toBeDefined();
			expect(wig.scoreboard?.data).toBeUndefined();
		});

		it('should fail if the wig does not exist', async () => {
			const result = await repository.clearScoreboardData('otherId');
			expect(result.isLeft()).toBe(true);
		});
	});

	describe('removeScoreboard', () => {
		it('should remove scoreboard from wig successfully', async () => {
			await repository.setScoreboard(wigToCreate.id, mockProgressScoreboard);
			const result = await repository.removeScoreboard(wigToCreate.id);
			expect(result.isRight()).toBe(true);
			const wigResult = await repository.getWIGFromOrganization(organizationId, wigToCreate.id);
			expect(wigResult.isRight()).toBe(true);
			const wig = wigResult.unsafeCoerce();
			expect(wig.scoreboard).toBeUndefined();
		});

		it('should fail if the wig does not exist', async () => {
			const result = await repository.removeScoreboard('otherId');
			expect(result.isLeft()).toBe(true);
		});
	});
});
