// This file holds the Genkit flow for providing personalized career route recommendations.

'use server';

/**
 * @fileOverview A career path recommendation AI agent.
 *
 * - recommendCareerRoute - A function that handles the career path recommendation process.
 * - RecommendCareerRouteInput - The input type for the recommendCareerRoute function.
 * - RecommendCareerRouteOutput - The return type for the recommendCareerRoute function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendCareerRouteInputSchema = z.object({
  skills: z.array(z.string()).describe('List of existing skills.'),
  experienceLevel: z
    .enum(['entry', 'mid', 'senior'])
    .describe('Experience level (entry, mid, senior).'),
  city: z.string().describe('Current city of residence.'),
  targetRole: z.string().describe('Desired target role.'),
});

export type RecommendCareerRouteInput = z.infer<typeof RecommendCareerRouteInputSchema>;

const RecommendCareerRouteOutputSchema = z.object({
  eligibleRoles: z.array(z.string()).describe('List of roles the user is currently qualified for based on their existing skills.'),
  missingSkills: z.array(z.string()).describe('A list of critical skills the user needs to acquire for the target role.'),
  priorityLearningOrder: z.array(z.string()).describe('The recommended order in which the user should learn the missing skills for maximum efficiency.'),
  timeToJobEstimate: z.string().describe('A realistic, estimated time in weeks to become job-ready for the target role after acquiring the missing skills.'),
  freeLearningLinks: z.array(z.string()).describe('A list of publicly available, high-quality links to free learning resources for the missing skills.'),
  placementProbability: z.number().describe('The probability (from 0.0 to 1.0) of securing the target role within the estimated time frame, assuming the user acquires the missing skills.'),
  confidence: z.number().describe('Your confidence level (from 0.0 to 1.0) in this overall assessment, based on the quality and completeness of the data available.'),
  reasoning: z.string().describe('A step-by-step explanation of how you arrived at this conclusion. Detail the factors considered, such as skill gaps, market demand in the specified city, and typical learning curves.'),
});


export type RecommendCareerRouteOutput = z.infer<typeof RecommendCareerRouteOutputSchema>;

export async function recommendCareerRoute(
  input: RecommendCareerRouteInput
): Promise<RecommendCareerRouteOutput> {
  return recommendCareerRouteFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendCareerRoutePrompt',
  input: {schema: RecommendCareerRouteInputSchema},
  output: {schema: RecommendCareerRouteOutputSchema},
  prompt: `You are a sophisticated AI career advisor that provides probability-based outcomes. Your primary function is to give users a realistic and data-driven roadmap for their career transitions.

Based on the user's profile below, provide a personalized career route recommendation.

**User Profile:**
- **Existing Skills:** {{#each skills}} {{this}}{{#unless @last}},{{/unless}}{{/each}}
- **Experience Level:** {{experienceLevel}}
- **Current City:** {{city}}
- **Target Role:** {{targetRole}}

**Your Task:**
Analyze the user's profile against general knowledge of the job market, skill requirements for the target role, and demand dynamics in the specified city.

Then, generate the following outputs:

1.  **Eligible Roles**: Identify roles the user might already be qualified for.
2.  **Missing Skills**: Pinpoint the essential skills the user lacks for their target role.
3.  **Priority Learning Order**: Strategically order the missing skills for learning.
4.  **Time-to-Job Estimate**: Estimate the time needed to become job-ready.
5.  **Free Learning Links**: Provide links to free, high-quality learning resources.
6.  **Placement Probability**: This is critical. Estimate the probability (0.0 to 1.0) of the user securing the target role within the estimated timeframe AFTER they acquire the necessary skills. Your calculation should implicitly consider factors like the demand for the target role in the user's city and the competitiveness of the skills involved.
7.  **Confidence Score**: Rate your confidence (0.0 to 1.0) in this entire assessment.
8.  **Reasoning**: Provide a clear, step-by-step explanation for your recommendations. Explain how you arrived at the placement probability, mentioning the key factors (e.g., "The high demand for '{{targetRole}}' in {{city}} increases the probability, but the high saturation of the 'XYZ' skill slightly reduces it."). Avoid making deterministic promises.`,
});

const recommendCareerRouteFlow = ai.defineFlow(
  {
    name: 'recommendCareerRouteFlow',
    inputSchema: RecommendCareerRouteInputSchema,
    outputSchema: RecommendCareerRouteOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
