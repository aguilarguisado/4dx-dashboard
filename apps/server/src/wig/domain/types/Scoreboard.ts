import { buildZodI18N } from 'i18n';
import { z } from 'zod';

const ScoreboardVisualizationTypeSchema = z.enum(['progress', 'series']);

// Progress scoreboard config
export const ProgressScoreboardConfigSchema = z
	.object({
		current: z.number(),
		init: z.number(),
		target: z.number(),
		caption: z.string().optional(),
		unit: z.string().optional(),
	})
	.refine((data) => data.init < data.target, {
		message: buildZodI18N('scoreboard.validation.error.init_lower_target'),
		path: ['init', 'target'],
	});

export const ScoreboardEntrySchema = z.object({
	label: z.date(),
	value: z.number(),
});

export const SeriesScoreboardTypeSchema = z.enum(['line', 'bar']);

// Series scoreboard config
export const SeriesScoreboardConfigSchema = z.object({
	label: z.string().optional(),
	type: SeriesScoreboardTypeSchema,
	reference: z.number().optional(),
});

const ScoreboardConfigTypeSchema = z.union([ProgressScoreboardConfigSchema, SeriesScoreboardConfigSchema]);

export const ScoreboardSchema = z.object({
	id: z.string(),
	visualizationType: ScoreboardVisualizationTypeSchema,
	config: ScoreboardConfigTypeSchema,
	data: z.array(ScoreboardEntrySchema).optional(),
});

export type ScoreboardVisualizationType = z.infer<typeof ScoreboardVisualizationTypeSchema>;
export type ProgressScoreboardConfig = z.infer<typeof ProgressScoreboardConfigSchema>;
export type ScoreboardEntry = z.infer<typeof ScoreboardEntrySchema>;
export type SeriesScoreboardConfig = z.infer<typeof SeriesScoreboardConfigSchema>;
export type SeriesScoreboardType = z.infer<typeof SeriesScoreboardTypeSchema>;
export type ScoreboardConfigType = z.infer<typeof ScoreboardConfigTypeSchema>;
export type Scoreboard = z.infer<typeof ScoreboardSchema>;

export const validateScoreboard = (data: Scoreboard): z.ZodIssue[] | null => {
	const configSchemas = {
		progress: ProgressScoreboardConfigSchema,
		series: SeriesScoreboardConfigSchema,
	};
	const validationResult = ScoreboardSchema.safeParse(data);
	if (!validationResult.success) {
		return validationResult.error.issues;
	}

	const { visualizationType, config } = data;
	const configSchema = configSchemas[visualizationType];
	const configValidationResult = configSchema.safeParse(config);
	if (!configValidationResult.success) {
		return configValidationResult.error.issues;
	}

	return null; // Valid
};
