'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ExtractSkillsInputSchema = z.object({
  document: z.string().describe('The document (resume/JD) to extract skills from.'),
});

const ExtractSkillsOutputSchema = z.array(z.string());

export const extractSkillsFlow = ai.defineFlow(
  {
    name: 'extractSkillsFlow',
    inputSchema: ExtractSkillsInputSchema,
    outputSchema: ExtractSkillsOutputSchema,
  },
  async (input) => {
    const { text } = await ai.generate({
      prompt: `Extract a comprehensive list of professional skills from the following document. 
      Return ONLY a JSON array of strings.
      Document: ${input.document}`,
      output: { format: 'json' },
    });
    
    // Fallback if formatting fails, though format: 'json' should handle it.
    try {
      if (typeof text === 'string') {
        return JSON.parse(text);
      }
      return text;
    } catch (e) {
      console.error('Failed to parse skills:', text);
      return [];
    }
  }
);
