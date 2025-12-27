'use server';
/**
 * @fileOverview An AI agent that detects and explains anomalies in skill demand data.
 *
 * - detectSkillAnomalies - A function that identifies significant shifts in skill trends.
 * - DetectSkillAnomaliesInput - The input type for the detectSkillAnomalies function.
 * - DetectSkillAnomaliesOutput - The return type for the detectSkillAnomalies function.
 */

import { ai } from '@/ai/genkit';
import type { TrendData } from '@/lib/types';
import { z } from 'genkit';

const DetectSkillAnomaliesInputSchema = z.object({
  trends: z
    .array(
      z.object({
        month: z.string(),
        'AI Ops': z.number(),
        'Manual QA': z.number(),
      })
    )
    .describe('An array of weekly skill trend data.'),
});
export type DetectSkillAnomaliesInput = z.infer<
  typeof DetectSkillAnomaliesInputSchema
>;

const AnomalySchema = z.object({
  skill: z.string().describe('The skill showing an anomaly.'),
  change: z.string().describe('The percentage change, e.g., +22% or -15%.'),
  explanation: z
    .string()
    .describe(
      'A brief, insightful explanation for why this anomaly is occurring.'
    ),
  type: z.enum(['spike', 'drop', 'emerging', 'divergence', 'declining']).describe('The type of anomaly detected.'),
});

const DetectSkillAnomaliesOutputSchema = z.object({
  anomalies: z
    .array(AnomalySchema)
    .describe('A list of detected skill anomalies or "shocks".'),
});
export type DetectSkillAnomaliesOutput = z.infer<
  typeof DetectSkillAnomaliesOutputSchema
>;

export async function detectSkillAnomalies(
  input: DetectSkillAnomaliesInput
): Promise<DetectSkillAnomaliesOutput> {
  return detectSkillAnomaliesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectSkillAnomaliesPrompt',
  input: { schema: DetectSkillAnomaliesInputSchema },
  output: { schema: DetectSkillAnomaliesOutputSchema },
  prompt: `You are an autonomous workforce intelligence agent. Your task is to detect and explain anomalies in skill demand data. Analyze the following 6-month trend data and identify the most significant changes.

  Determine if the changes are normal seasonal variations or represent a more significant emerging or declining skill trend. Explain your reasoning. Classify the skills accordingly.

  Focus on the most meaningful insight. Analyze the relationship between 'AI Ops' and 'Manual QA'. Explain the divergence you see.
  
  Calculate the percentage change for both skills from the start to the end of the period. Frame the primary anomaly as a "divergence" between these two skills. Classify 'AI Ops' as an 'emerging' trend and 'Manual QA' as a 'declining' trend in your explanation.

  Skill Trend Data:
  {{#each trends}}
  - Month: {{month}}, AI Ops Demand: {{'AI Ops'}}, Manual QA Demand: {{'Manual QA'}}
  {{/each}}
  
  Generate one or two key anomaly insights. For the primary 'divergence' insight, provide a compelling explanation for this market shift, considering automation and the evolution of tech roles. The consistent monthly increase in 'AI Ops' and decrease in 'Manual QA' indicates a structural market shift, not seasonal fluctuation.`,
});

const detectSkillAnomaliesFlow = ai.defineFlow(
  {
    name: 'detectSkillAnomaliesFlow',
    inputSchema: DetectSkillAnomaliesInputSchema,
    outputSchema: DetectSkillAnomaliesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
