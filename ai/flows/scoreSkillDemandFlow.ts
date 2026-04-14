'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ScoreSkillDemandInputSchema = z.object({
  skill: z.string(),
  city: z.string(),
});

const ScoreSkillDemandOutputSchema = z.object({
  score: z.number().describe('Demand score 0-100'),
  trend: z.enum(['Rising', 'Neutral', 'Decaying']),
  salaryImpact: z.number().describe('Estimated annual salary impact in USD'),
});

export const scoreSkillDemandFlow = ai.defineFlow(
  {
    name: 'scoreSkillDemandFlow',
    inputSchema: ScoreSkillDemandInputSchema,
    outputSchema: ScoreSkillDemandOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      prompt: `Estimate the market demand for the skill "${input.skill}" in "${input.city}". 
      Return:
      - score (0-100)
      - trend (Rising, Neutral, or Decaying)
      - salaryImpact (Value in USD that this skill adds to a yearly salary)`,
      output: { 
        schema: ScoreSkillDemandOutputSchema 
      },
    });

    return output!;
  }
);
