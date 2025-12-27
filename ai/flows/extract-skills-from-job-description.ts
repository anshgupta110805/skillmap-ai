'use server';
/**
 * @fileOverview Extracts skills from a job description using Genkit.
 *
 * - extractSkillsFromJobDescription - A function that extracts skills from a job description.
 * - ExtractSkillsFromJobDescriptionInput - The input type for the extractSkillsFromJobDescription function.
 * - ExtractSkillsFromJobDescriptionOutput - The return type for the extractSkillsFromJobDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractSkillsFromJobDescriptionInputSchema = z.object({
  jobDescription: z.string().describe('The job description to extract skills from.'),
});
export type ExtractSkillsFromJobDescriptionInput = z.infer<
  typeof ExtractSkillsFromJobDescriptionInputSchema
>;

const ExtractSkillsFromJobDescriptionOutputSchema = z.object({
  skills: z
    .array(z.string())
    .describe('An array of skills extracted from the job description.'),
});
export type ExtractSkillsFromJobDescriptionOutput = z.infer<
  typeof ExtractSkillsFromJobDescriptionOutputSchema
>;

export async function extractSkillsFromJobDescription(
  input: ExtractSkillsFromJobDescriptionInput
): Promise<ExtractSkillsFromJobDescriptionOutput> {
  return extractSkillsFromJobDescriptionFlow(input);
}

const extractSkillsPrompt = ai.definePrompt({
  name: 'extractSkillsPrompt',
  input: {schema: ExtractSkillsFromJobDescriptionInputSchema},
  output: {schema: ExtractSkillsFromJobDescriptionOutputSchema},
  prompt: `You are an expert in identifying skills required for a job.
  Given a job description, extract the relevant skills and return them as a list.
  Job Description: {{{jobDescription}}}`,
});

const extractSkillsFromJobDescriptionFlow = ai.defineFlow(
  {
    name: 'extractSkillsFromJobDescriptionFlow',
    inputSchema: ExtractSkillsFromJobDescriptionInputSchema,
    outputSchema: ExtractSkillsFromJobDescriptionOutputSchema,
  },
  async input => {
    const {output} = await extractSkillsPrompt(input);
    return output!;
  }
);
