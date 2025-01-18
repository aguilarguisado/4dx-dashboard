import { mockCreateLag } from '../__mocks__/CreateLagMocks';
import { CreateLagSchema } from '../CreateLag';

import { z } from 'zod';

describe('CreateLagSchema', () => {
	it('should be an instance of Zod schema', () => {
		expect(CreateLagSchema).toBeInstanceOf(z.ZodSchema);
	});

	it('should omit the id field from LagMeasurementSchema', () => {
		const result = CreateLagSchema.safeParse(mockCreateLag);
		expect(result.success).toBe(true);
		expect(result.data).toEqual(mockCreateLag);
	});

	it('should validate required fields correctly', () => {
		const result = CreateLagSchema.safeParse(mockCreateLag);
		expect(result.success).toBe(true);
		expect(result.data).toEqual(mockCreateLag);
	});

	it('should fail validation for missing required fields', () => {
		const invalidInputMissingFields = {};

		const result = CreateLagSchema.safeParse(invalidInputMissingFields);
		expect(result.success).toBe(false);
		expect(result.error?.issues.some((issue) => issue.path.includes('title'))).toBe(true);
	});
});
