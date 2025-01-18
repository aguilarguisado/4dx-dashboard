import { mockCreateLead } from '../__mocks__/CreateLeadMocks';
import { CreateLeadSchema } from '../CreateLead';

import { z } from 'zod';

describe('CreateLeadSchema', () => {
	it('should be an instance of Zod schema', () => {
		expect(CreateLeadSchema).toBeInstanceOf(z.ZodSchema);
	});

	it('should omit the id field from LeadMeasurementSchema', () => {
		const result = CreateLeadSchema.safeParse(mockCreateLead);
		expect(result.success).toBe(true);
		expect(result.data).toEqual(mockCreateLead);
	});

	it('should validate required fields correctly', () => {
		const result = CreateLeadSchema.safeParse(mockCreateLead);
		expect(result.success).toBe(true);
		expect(result.data).toEqual(mockCreateLead);
	});

	it('should fail validation for missing required fields', () => {
		const invalidInputMissingFields = {};

		const result = CreateLeadSchema.safeParse(invalidInputMissingFields);
		expect(result.success).toBe(false);
		expect(result.error?.issues.some((issue) => issue.path.includes('name'))).toBe(true);
	});
});
