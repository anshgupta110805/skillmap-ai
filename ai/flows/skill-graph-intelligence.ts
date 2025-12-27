'use server';
/**
 * @fileOverview An AI agent for skill graph intelligence.
 *
 * - skillGraphIntelligence - A function that explores skill relationships.
 * - SkillGraphIntelligenceInput - The input type for the skillGraphIntelligence function.
 * - SkillGraphIntelligenceOutput - The return type for the skillGraphIntelligence function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SkillGraphIntelligenceInputSchema = z.object({
  skill: z.string().describe('The central skill to explore.'),
});
export type SkillGraphIntelligenceInput = z.infer<
  typeof SkillGraphIntelligenceInputSchema
>;

const SkillRelationshipSchema = z.object({
  skill: z.string().describe('The related skill.'),
  relationship: z
    .string()
    .describe('The nature of the relationship (e.g., "is a prerequisite for", "is often used with", "is a specialization of").'),
    reasoning: z.string().describe("Explanation of why this relationship exists."),
});

const SkillGraphIntelligenceOutputSchema = z.object({
  directRelationships: z
    .array(SkillRelationshipSchema)
    .describe('Skills directly related to the input skill.'),
  indirectOpportunities: z
    .array(
      z.object({
        opportunity: z
          .string()
          .describe('An emerging role or technology.'),
        reasoning: z
          .string()
          .describe(
            'The chain of reasoning connecting the input skill to this opportunity.'
          ),
      })
    )
    .describe(
      'Indirect opportunities or future demand implied by the input skill.'
    ),
});
export type SkillGraphIntelligenceOutput = z.infer<
  typeof SkillGraphIntelligenceOutputSchema
>;

export async function skillGraphIntelligence(
  input: SkillGraphIntelligenceInput
): Promise<SkillGraphIntelligenceOutput> {
  return skillGraphIntelligenceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'skillGraphIntelligencePrompt',
  input: { schema: SkillGraphIntelligenceInputSchema },
  output: { schema: SkillGraphIntelligenceOutputSchema },
  prompt: `You are a knowledge graph AI specializing in workforce intelligence. Analyze the skill "{{skill}}" and its position within the tech ecosystem.

  Based on your knowledge of how skills, roles, and technologies are connected, provide the following:

  1.  **Direct Relationships**: Identify skills that are directly related to "{{skill}}". For each, describe the nature of the relationship (e.g., prerequisite, complementary, specialization).
  2.  **Indirect Opportunities**: Extrapolate from the direct relationships to identify emerging roles or future trends where "{{skill}}" could be valuable. Explain the chain of reasoning for each indirect opportunity. For example, "Growth in Skill A implies future demand for Skill B, which is used in Role C."

  Generate a structured response based on this analysis.`,
});

const skillGraphIntelligenceFlow = ai.defineFlow(
  {
    name: 'skillGraphIntelligenceFlow',
    inputSchema: SkillGraphIntelligenceInputSchema,
    outputSchema: SkillGraphIntelligenceOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
