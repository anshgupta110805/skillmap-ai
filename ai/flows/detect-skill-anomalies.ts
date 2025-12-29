'use server';
/**
 * @fileOverview An AI agent that detects and explains anomalies in skill demand data for any set of skills.
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
      z.record(z.string(), z.number()) // Dynamic key-value pairs for skill names and their values
    )
    .describe('An array of weekly skill trend data with dynamic skill names.'),
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
  prompt: `You are an autonomous workforce intelligence agent. Your task is to detect and explain anomalies in skill demand data. Analyze the following trend data and identify the most significant changes.

  Determine if the changes are normal seasonal variations or represent a more significant emerging or declining skill trend. Explain your reasoning. Classify the skills accordingly.

  Focus on the most meaningful insights. Identify any divergences, spikes, drops, or emerging/declining trends among the skills.
  
  Calculate the percentage changes for skills from the start to the end of the period. Identify which skills are showing significant changes and classify them appropriately (emerging, declining, spike, drop, divergence).

  Skill Trend Data:
  {{#each trends}}
  - {{#each this}} {{@key}}: {{this}} {{/each}}
  {{/each}}
  
  Generate key anomaly insights based on the most significant changes you observe. Provide compelling explanations for these market shifts, considering automation and the evolution of tech roles.`,
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
