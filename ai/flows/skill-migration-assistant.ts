'use server';

/**
 * @fileOverview This file implements the Skill Migration Assistant flow.
 *
 * It allows users to input a city and receive information about the skills that will yield the highest salary in that city.
 *
 * @interface SkillMigrationAssistantInput - Defines the input schema for the skill migration assistant flow.
 * @interface SkillMigrationAssistantOutput - Defines the output schema for the skill migration assistant flow.
 * @function skillMigrationAssistant - The main function that triggers the flow and returns the results.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillMigrationAssistantInputSchema = z.object({
  city: z.string().describe('The city for which to find the skills with the highest salary.'),
});
export type SkillMigrationAssistantInput = z.infer<typeof SkillMigrationAssistantInputSchema>;

const SkillMigrationAssistantOutputSchema = z.object({
  topRoles: z.array(z.string()).describe('Top roles in the specified city.'),
  requiredSkills: z.array(z.string()).describe('Skills required for the top roles.'),
  salaryRange: z.string().describe('Salary range for the top roles in the specified city.'),
  competitionLevel: z.string().describe('Competition level for the top roles in the specified city.'),
  roadmap: z.string().describe('A 3-6 month roadmap to acquire the skills for the top roles.'),
});
export type SkillMigrationAssistantOutput = z.infer<typeof SkillMigrationAssistantOutputSchema>;

export async function skillMigrationAssistant(input: SkillMigrationAssistantInput): Promise<SkillMigrationAssistantOutput> {
  return skillMigrationAssistantFlow(input);
}

const skillMigrationAssistantPrompt = ai.definePrompt({
  name: 'skillMigrationAssistantPrompt',
  input: {schema: SkillMigrationAssistantInputSchema},
  output: {schema: SkillMigrationAssistantOutputSchema},
  prompt: `You are a workforce intelligence AI providing decision-oriented advice for career migration. A user wants to move to {{city}}.

Your task is to provide a structured analysis to help them make an informed decision.

Based on general market data, provide the following:

1.  **Top Roles**: Identify the most lucrative and in-demand job roles in {{city}}.
2.  **Required Skills**: List the critical skills needed to secure these top roles.
3.  **Salary Range**: Estimate the typical salary range for these roles in {{city}}.
4.  **Competition Level**: Evaluate the job competition level (e.g., Low, Medium, High) for these roles.
5.  **Actionable Roadmap**: Provide a concise, actionable 3-6 month learning roadmap for a person looking to acquire the suggested skills.
  `,
});

const skillMigrationAssistantFlow = ai.defineFlow(
  {
    name: 'skillMigrationAssistantFlow',
    inputSchema: SkillMigrationAssistantInputSchema,
    outputSchema: SkillMigrationAssistantOutputSchema,
  },
  async input => {
    const {output} = await skillMigrationAssistantPrompt(input);
    return output!;
  }
);
