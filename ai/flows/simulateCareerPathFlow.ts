'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { CareerPath } from '@/types';

const SimulateCareerPathInputSchema = z.object({
  profile: z.any().describe('The user profile object'),
  targetRole: z.string(),
  city: z.string(),
});

const SimulateCareerPathOutputSchema = z.object({
  safe: z.custom<CareerPath>(),
  accelerated: z.custom<CareerPath>(),
  bold: z.custom<CareerPath>(),
});

export const simulateCareerPathFlow = ai.defineFlow(
  {
    name: 'simulateCareerPathFlow',
    inputSchema: SimulateCareerPathInputSchema,
    outputSchema: SimulateCareerPathOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      prompt: `Based on the user's profile and target role: ${input.targetRole} in ${input.city}, 
      simulate three distinct career paths:
      1. Safe: Low risk, steady progression.
      2. Accelerated: Faster growth, moderate risk.
      3. Bold: High risk, high reward, possibly a major pivot.
      
      For each path, provide:
      - timeToTransitionMonths
      - salaryDeltaPct
      - riskScore (0-100)
      - missingSkills (list of strings)
      
      User Profile: ${JSON.stringify(input.profile)}`,
      output: { 
        schema: SimulateCareerPathOutputSchema 
      },
    });

    return output!;
  }
);
