import { AuthenticatedUser } from '../../authentication/domain/models/AuthenticatedUser';

type UserSession = {
	user: AuthenticatedUser | null;
};
export const authenticatedMockUser = {
	id: '1',
	email: 'test@test.com',
	displayName: 'test',
	organizationId: 'org123',
	role: 'user',
};
export const getNotLoggedUser: () => UserSession = () => ({ user: null });
export const getOrdinaryUser: () => UserSession = () => ({ user: { ...authenticatedMockUser, role: 'user' } });
export const getSuperAdminUser: () => UserSession = () => ({ user: { ...authenticatedMockUser, role: 'superadmin' } });
