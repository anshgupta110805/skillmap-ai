'use server';
/**
 * @fileOverview An AI agent that provides institutional policy advice.
 *
 * - policyAdvisor - A function that suggests policy or curriculum actions.
 * - PolicyAdvisorInput - The input type for the policyAdvisor function.
 * - PolicyAdvisorOutput - The return type for the policyAdvisor function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const PolicyAdvisorInputSchema = z.object({
  region: z.string().describe('The geographical region for policy advice (e.g., a city or state).'),
  goal: z.string().describe('The primary goal for the policy (e.g., "Boost tech sector growth", "Reduce youth unemployment").'),
});
export type PolicyAdvisorInput = z.infer<typeof PolicyAdvisorInputSchema>;

const PolicyRecommendationSchema = z.object({
    recommendation: z.string().describe("A specific, actionable policy recommendation."),
    rationale: z.string().describe("The reasoning and expected impact of the recommendation."),
    implementationSteps: z.array(z.string()).describe("A short list of high-level implementation steps."),
});

const PolicyAdvisorOutputSchema = z.object({
  recommendations: z.array(PolicyRecommendationSchema).describe('A list of policy recommendations.'),
   explanation: z.string().describe('The data sources and reasoning steps used to generate the recommendations.'),
   confidence: z.number().describe('The confidence level of the recommendations (0-1).')
});
export type PolicyAdvisorOutput = z.infer<typeof PolicyAdvisorOutputSchema>;

export async function policyAdvisor(input: PolicyAdvisorInput): Promise<PolicyAdvisorOutput> {
  return policyAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'policyAdvisorPrompt',
  input: { schema: PolicyAdvisorInputSchema },
  output: { schema: PolicyAdvisorOutputSchema },
  prompt: `You are an AI policy advisor for governments and universities. Your task is to analyze regional workforce data and suggest policy or curriculum actions.

  Region: {{region}}
  Goal: {{goal}}

  Based on general knowledge of skill demand, economic trends, and educational systems, generate a set of actionable policy recommendations. For each recommendation, provide a clear rationale and high-level implementation steps. Also provide an overall explanation of your reasoning and a confidence score.`,
});

const policyAdvisorFlow = ai.defineFlow(
  {
    name: 'policyAdvisorFlow',
    inputSchema: PolicyAdvisorInputSchema,
    outputSchema: PolicyAdvisorOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
