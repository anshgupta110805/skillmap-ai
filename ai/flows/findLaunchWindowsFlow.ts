'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { Opportunity } from '@/types';

const FindLaunchWindowsInputSchema = z.object({
  profile: z.any().describe('The user profile object'),
});

const FindLaunchWindowsOutputSchema = z.array(z.custom<Opportunity>());

export const findLaunchWindowsFlow = ai.defineFlow(
  {
    name: 'findLaunchWindowsFlow',
    inputSchema: FindLaunchWindowsInputSchema,
    outputSchema: FindLaunchWindowsOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      prompt: `Identify the top 5 job opportunities for this user based on their profile. 
      Label these as "Launch Windows" if they are a high-match (matchPct >= 85%).
      For each opportunity, provide:
      - title
      - company
      - matchPct (0-100)
      - isLaunchWindow (boolean)
      - location
      
      User Profile: ${JSON.stringify(input.profile)}`,
      output: { 
        schema: z.array(z.object({
          title: z.string(),
          company: z.string(),
          matchPct: z.number(),
          isLaunchWindow: z.boolean(),
          location: z.string(),
        }))
      },
    });

    return output!.map((opp, index) => ({
      ...opp,
      id: `opp-${index}`,
    }));
  }
);
