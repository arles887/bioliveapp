'use server';
/**
 * @fileOverview An AI agent for moderating live chat messages in BioLive.
 * This flow evaluates incoming chat messages for offensive, inappropriate, harmful, or spammy content.
 *
 * - aiChatMessageModeration - A function that handles the chat message moderation process.
 * - AiChatMessageModerationInput - The input type for the aiChatMessageModeration function.
 * - AiChatMessageModerationOutput - The return type for the aiChatMessageModeration function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const AiChatMessageModerationInputSchema = z.object({
  message: z.string().describe('The chat message to be moderated.'),
  context: z.string().optional().describe('Optional context about the chat or user.'),
});
export type AiChatMessageModerationInput = z.infer<typeof AiChatMessageModerationInputSchema>;

const AiChatMessageModerationOutputSchema = z.object({
  isSafe: z.boolean().describe('True if the message is safe, false otherwise.'),
  reason: z.string().optional().describe('The reason why the message is not safe, if applicable.'),
});
export type AiChatMessageModerationOutput = z.infer<typeof AiChatMessageModerationOutputSchema>;

const prompt = ai.definePrompt({
  name: 'aiChatMessageModerationPrompt',
  input: { schema: AiChatMessageModerationInputSchema },
  output: { schema: AiChatMessageModerationOutputSchema },
  prompt: `You are an AI chat moderator for BioLive, a live streaming and social media app. Your primary goal is to ensure a safe, positive, and spam-free environment.

Evaluate the following chat message. Determine if it contains any offensive, inappropriate, harmful, or spammy content.

Message: "{{{message}}}"

{{#if context}}
Additional Context: "{{{context}}}"
{{/if}}

Respond ONLY with a JSON object. The object must contain:
- 'isSafe': a boolean (true if the message is safe, false if it is offensive, inappropriate, harmful, or spammy).
- 'reason': a string explaining why the message is NOT safe if 'isSafe' is false. This field should be omitted if 'isSafe' is true.
`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const aiChatMessageModerationFlow = ai.defineFlow(
  {
    name: 'aiChatMessageModerationFlow',
    inputSchema: AiChatMessageModerationInputSchema,
    outputSchema: AiChatMessageModerationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function aiChatMessageModeration(
  input: AiChatMessageModerationInput
): Promise<AiChatMessageModerationOutput> {
  return aiChatMessageModerationFlow(input);
}
