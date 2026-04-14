'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { MigrationResult } from '@/types';

const RunMigrationSimInputSchema = z.object({
  currentCity: z.string(),
  targetCity: z.string(),
  role: z.string(),
});

const RunMigrationSimOutputSchema = z.custom<MigrationResult>();

export const runMigrationSimFlow = ai.defineFlow(
  {
    name: 'runMigrationSimFlow',
    inputSchema: RunMigrationSimInputSchema,
    outputSchema: RunMigrationSimOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      prompt: `Analyze a career migration from ${input.currentCity} to ${input.targetCity} for a ${input.role} role. 
      Calculate:
      - salaryAdjustmentPct (expected change in salary)
      - costOfLivingDeltaPct (difference in living costs)
      - topHiringCompanies (list 3-5 companies)
      - demandScore (0-100)
      
      Return the data as a MigrationResult object.`,
      output: { 
        schema: RunMigrationSimInputSchema.extend({
          salaryAdjustmentPct: z.number(),
          costOfLivingDeltaPct: z.number(),
          topHiringCompanies: z.array(z.string()),
          demandScore: z.number(),
        }) 
      },
    });

    return {
      currentCity: input.currentCity,
      targetCity: input.targetCity,
      role: input.role,
      salaryAdjustmentPct: output!.salaryAdjustmentPct,
      costOfLivingDeltaPct: output!.costOfLivingDeltaPct,
      topHiringCompanies: output!.topHiringCompanies,
      demandScore: output!.demandScore,
    };
  }
);
