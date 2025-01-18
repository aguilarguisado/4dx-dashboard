import { BaseRepository } from '../../../common/domain/BaseRepository';
import { EntityNotExistsError } from '../../../common/domain/exceptions/EntityNotExistsError';
import { UnknownError } from '../../../common/domain/exceptions/UnknownError';
import { Void } from '../../../common/domain/models/Void';
import { GetWIGError } from '../exceptions/GetWIGError';
import { WIG } from '../models/WIG';
import { LagMeasurement } from '../types/LagMeasurement';
import { LeadMeasurement } from '../types/LeadMeasurement';
import { Scoreboard } from '../types/Scoreboard';

import { Either } from 'purify-ts/Either';

export type WIGRepository = BaseRepository<WIG> & {
	getWIGListFromOrganization(organizationId: string): Promise<Either<UnknownError, WIG[]>>;
	getWIGFromOrganization(organizationId: string, wigId: string): Promise<Either<GetWIGError, WIG>>;
	getOrganizationalWIGs(organizationId: string): Promise<Either<UnknownError, WIG[]>>;
	addLead(wigId: string, lead: LeadMeasurement): Promise<Either<UnknownError, LeadMeasurement>>;
	updateLead(
		wigId: string,
		lead: LeadMeasurement,
	): Promise<Either<UnknownError | EntityNotExistsError, LeadMeasurement>>;
	deleteLead(wigId: string, leadId: string): Promise<Either<UnknownError | EntityNotExistsError, Void>>;
	addLag(wigId: string, lag: LagMeasurement): Promise<Either<UnknownError, LagMeasurement>>;
	updateLag(wigId: string, lag: LagMeasurement): Promise<Either<UnknownError | EntityNotExistsError, LagMeasurement>>;
	deleteLag(wigId: string, lagId: string): Promise<Either<UnknownError | EntityNotExistsError, Void>>;
	setScoreboard(wigId: string, scoreboard: Scoreboard): Promise<Either<GetWIGError, WIG>>;
	clearScoreboardData(wigId: string): Promise<Either<UnknownError, Void>>;
	removeScoreboard(wigId: string): Promise<Either<UnknownError, Void>>;
};
