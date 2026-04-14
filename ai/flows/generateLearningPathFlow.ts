'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { WeeklyPlan } from '@/types';

const GenerateLearningPathInputSchema = z.object({
  skillGaps: z.array(z.string()),
});

const GenerateLearningPathOutputSchema = z.array(z.custom<WeeklyPlan>());

export const generateLearningPathFlow = ai.defineFlow(
  {
    name: 'generateLearningPathFlow',
    inputSchema: GenerateLearningPathInputSchema,
    outputSchema: GenerateLearningPathOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      prompt: `Generate a 12-week learning path to bridge the following skill gaps: ${input.skillGaps.join(', ')}. 
      For each week, provide:
      - week number (1-12)
      - topic
      - resources (at least 2, include type: 'course'|'project'|'certification', title, and a placeholder link)
      
      Ensure the progression is logical.`,
      output: { 
        schema: z.array(z.object({
          week: z.number(),
          topic: z.string(),
          resources: z.array(z.object({
            type: z.enum(['course', 'project', 'certification']),
            title: z.string(),
            link: z.string(),
          })),
        }))
      },
    });

    return output!.map(w => ({ ...w, completed: false }));
  }
);
