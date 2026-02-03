
'use server';
/**
 * @fileOverview An AI style assistant for SS SMART HAAT.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const StyleAssistantInputSchema = z.object({
  userQuery: z.string().describe('The user question about fashion or a specific product.'),
  context: z.string().optional().describe('Additional context like current season or user preference.'),
});

const StyleAssistantOutputSchema = z.object({
  advice: z.string().describe('Styling advice or product recommendation.'),
  suggestedColors: z.array(z.string()).describe('A list of colors that would work well.'),
  vibe: z.string().describe('The overall aesthetic vibe (e.g., "Minimalist Noir", "Royal Heritage").'),
});

export type StyleAssistantInput = z.infer<typeof StyleAssistantInputSchema>;
export type StyleAssistantOutput = z.infer<typeof StyleAssistantOutputSchema>;

export async function getStyleAdvice(input: StyleAssistantInput): Promise<StyleAssistantOutput> {
  return styleAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'styleAssistantPrompt',
  input: { schema: StyleAssistantInputSchema },
  output: { schema: StyleAssistantOutputSchema },
  prompt: `You are the Lead Stylist for "SS SMART HAAT", an ultra-luxury, high-fashion boutique in Bangladesh.
Your tone is sophisticated, knowledgeable, and exclusive. 
If the user asks in Bengali, reply in a mix of elegant Bengali and English (Banglish), typical of high-fashion circles in Dhaka.

User Question: {{{userQuery}}}
Context: {{{context}}}

Provide a detailed styling recommendation that feels premium.`,
});

const styleAssistantFlow = ai.defineFlow(
  {
    name: 'styleAssistantFlow',
    inputSchema: StyleAssistantInputSchema,
    outputSchema: StyleAssistantOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
