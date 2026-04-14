'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CopilotChatInputSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string(),
  })),
  pageContext: z.string().optional(),
});

export const copilotChatFlow = ai.streamFlow(
  {
    name: 'copilotChatFlow',
    inputSchema: CopilotChatInputSchema,
  },
  async (input, { sendChunk }) => {
    const { stream } = ai.generateStream({
      prompt: input.messages,
      system: `You are the SkillMapper AI Copilot. You are helpful, professional, and concise. 
      You help users navigate their career, understand their skills, and optimize their growth.
      Current Page Context: ${input.pageContext || 'General'}`,
    });

    for await (const chunk of stream) {
      sendChunk(chunk.text);
    }
  }
);
