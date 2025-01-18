import { ScoreboardHistorySchema, ScoreboardHistoryTypeSchema } from '../../models/ScoreboardHistory';
import { mockCreateScoreboardHistoryWIG } from '../__mocks__/CreateScoreboardHistoryMocks';
import { CreateScoreboardHistorySchema } from '../CreateScoreboardHistory';

describe('CreateScoreboardHistorySchema', () => {
	const validData = mockCreateScoreboardHistoryWIG;

	it('should validate valid data', () => {
		expect(() => CreateScoreboardHistorySchema.parse(validData)).not.toThrow();
	});

	it('should fail validation if wigId is missing', () => {
		const invalidData = { ...validData, wigId: undefined };
		expect(() => CreateScoreboardHistorySchema.parse(invalidData)).toThrow();
	});

	it('should fail validation if containerId is missing', () => {
		const invalidData = { ...validData, containerId: undefined };
		expect(() => CreateScoreboardHistorySchema.parse(invalidData)).toThrow();
	});

	it('should fail validation if scoreboardId is missing', () => {
		const invalidData = { ...validData, scoreboardId: undefined };
		expect(() => CreateScoreboardHistorySchema.parse(invalidData)).toThrow();
	});

	it('should fail validation if containerType is invalid', () => {
		const invalidData = { ...validData, containerType: 'invalidType' };
		expect(() => CreateScoreboardHistorySchema.parse(invalidData)).toThrow();
	});

	it('should fail validation if date is missing', () => {
		const invalidData = { ...validData, date: undefined };
		expect(() => CreateScoreboardHistorySchema.parse(invalidData)).toThrow();
	});

	it('should fail validation if value is missing', () => {
		const invalidData = { ...validData, value: undefined };
		expect(() => CreateScoreboardHistorySchema.parse(invalidData)).toThrow();
	});

	it('should validate without comment', () => {
		const dataWithoutComment = { ...validData, comment: undefined };
		expect(() => CreateScoreboardHistorySchema.parse(dataWithoutComment)).not.toThrow();
	});
});

describe('ScoreboardHistorySchema', () => {
	const validData = {
		id: 'id123',
		organizationId: 'org123',
		wigId: 'wig123',
		containerId: 'container123',
		scoreboardId: 'scoreboard123',
		containerType: 'wig',
		date: new Date(),
		value: 100,
		comment: 'Test comment',
	};

	it('should validate valid data', () => {
		expect(() => ScoreboardHistorySchema.parse(validData)).not.toThrow();
	});

	it('should fail validation if organizationId is missing', () => {
		const invalidData = { ...validData, organizationId: undefined };
		expect(() => ScoreboardHistorySchema.parse(invalidData)).toThrow();
	});

	it('should fail validation if wigId is missing', () => {
		const invalidData = { ...validData, wigId: undefined };
		expect(() => ScoreboardHistorySchema.parse(invalidData)).toThrow();
	});

	it('should fail validation if containerId is missing', () => {
		const invalidData = { ...validData, containerId: undefined };
		expect(() => ScoreboardHistorySchema.parse(invalidData)).toThrow();
	});

	it('should fail validation if scoreboardId is missing', () => {
		const invalidData = { ...validData, scoreboardId: undefined };
		expect(() => ScoreboardHistorySchema.parse(invalidData)).toThrow();
	});

	it('should fail validation if containerType is invalid', () => {
		const invalidData = { ...validData, containerType: 'invalidType' };
		expect(() => ScoreboardHistorySchema.parse(invalidData)).toThrow();
	});

	it('should fail validation if date is missing', () => {
		const invalidData = { ...validData, date: undefined };
		expect(() => ScoreboardHistorySchema.parse(invalidData)).toThrow();
	});

	it('should fail validation if value is missing', () => {
		const invalidData = { ...validData, value: undefined };
		expect(() => ScoreboardHistorySchema.parse(invalidData)).toThrow();
	});

	it('should validate without comment', () => {
		const dataWithoutComment = { ...validData, comment: undefined };
		expect(() => ScoreboardHistorySchema.parse(dataWithoutComment)).not.toThrow();
	});
});

describe('ScoreboardHistoryTypeSchema', () => {
	it('should validate valid types', () => {
		expect(() => ScoreboardHistoryTypeSchema.parse('wig')).not.toThrow();
		expect(() => ScoreboardHistoryTypeSchema.parse('lead')).not.toThrow();
		expect(() => ScoreboardHistoryTypeSchema.parse('lag')).not.toThrow();
	});

	it('should fail validation if type is invalid', () => {
		expect(() => ScoreboardHistoryTypeSchema.parse('invalidType')).toThrow();
	});
});
