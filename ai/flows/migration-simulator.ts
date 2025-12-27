'use server';
/**
 * @fileOverview A multi-city skill migration AI simulator.
 *
 * - migrationSimulator - A function that simulates the impact of workforce migration.
 * - MigrationSimulatorInput - The input type for the migrationSimulator function.
 * - MigrationSimulatorOutput - The return type for the migrationSimulator function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const MigrationSimulatorInputSchema = z.object({
  sourceCity: z.string().describe('The city from which developers are moving.'),
  destinationCity: z.string().describe('The city to which developers are moving.'),
  role: z.string().describe('The role of the developers who are moving.'),
  migrationPercentage: z
    .number()
    .describe('The percentage of developers moving.'),
});
export type MigrationSimulatorInput = z.infer<
  typeof MigrationSimulatorInputSchema
>;

const MigrationSimulatorOutputSchema = z.object({
  simulationSummary: z
    .string()
    .describe(
      'A summary of the simulation, including impacts on skill saturation, salary pressure, and new shortages.'
    ),
  sourceCityImpact: z.string().describe('The specific impact on the source city.'),
  destinationCityImpact: z
    .string()
    .describe('The specific impact on the destination city.'),
  confidenceScore: z
    .number()
    .describe('A confidence score (0-1) for the simulation results.'),
  reasoning: z.string().describe('The reasoning behind the simulation outcome.'),
});
export type MigrationSimulatorOutput = z.infer<
  typeof MigrationSimulatorOutputSchema
>;

export async function migrationSimulator(
  input: MigrationSimulatorInput
): Promise<MigrationSimulatorOutput> {
  return migrationSimulatorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'migrationSimulatorPrompt',
  input: { schema: MigrationSimulatorInputSchema },
  output: { schema: MigrationSimulatorOutputSchema },
  prompt: `You are an expert workforce analyst. Simulate the economic impact of a workforce migration.
  
  Scenario: {{migrationPercentage}}% of {{role}}s move from {{sourceCity}} to {{destinationCity}}.

  Based on typical market dynamics, analyze and predict the following:
  1.  **Source City Impact**: How does losing {{migrationPercentage}}% of {{role}}s affect {{sourceCity}}? Consider changes in skill availability, impact on companies, and salary adjustments for remaining talent.
  2.  **Destination City Impact**: How does an influx of {{role}}s affect {{destinationCity}}? Consider skill saturation, competition for jobs, and potential downward pressure on salaries for that role.
  3.  **Overall Summary**: Provide a high-level summary of the consequences of this migration.
  4.  **Reasoning**: Explain the key factors and assumptions that led to your conclusions (e.g., supply and demand elasticity, typical hiring behavior).
  5.  **Confidence Score**: Provide a confidence score from 0.0 to 1.0 based on the predictability of this scenario.
  
  Generate a structured response with the requested information.`,
});

const migrationSimulatorFlow = ai.defineFlow(
  {
    name: 'migrationSimulatorFlow',
    inputSchema: MigrationSimulatorInputSchema,
    outputSchema: MigrationSimulatorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
