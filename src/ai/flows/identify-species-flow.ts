'use server';
/**
 * @fileOverview AI agent to identify plant/animal species from stream frames.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const IdentifySpeciesInputSchema = z.object({
  photoDataUri: z.string().describe("Data URI of the frame to analyze."),
});
export type IdentifySpeciesInput = z.infer<typeof IdentifySpeciesInputSchema>;

const IdentifySpeciesOutputSchema = z.object({
  commonName: z.string().describe('Common name of the species.'),
  scientificName: z.string().describe('Latin scientific name.'),
  status: z.enum(['Common', 'Vulnerable', 'Endangered', 'Unknown']).describe('Conservation status.'),
  funFact: z.string().describe('An interesting biological fact.'),
  ecoContribution: z.number().describe('Estimated carbon offset value points.'),
});
export type IdentifySpeciesOutput = z.infer<typeof IdentifySpeciesOutputSchema>;

const prompt = ai.definePrompt({
  name: 'identifySpeciesPrompt',
  input: { schema: IdentifySpeciesInputSchema },
  output: { schema: IdentifySpeciesOutputSchema },
  prompt: `You are an expert biologist and environmental scientist.
Analyze the following image frame from a nature live stream.
Identify the primary species (plant or animal) visible.
Provide its names, status, a fun fact, and assign a gamified 'ecoContribution' score (1-100).

Frame: {{media url=photoDataUri}}`,
});

const identifySpeciesFlow = ai.defineFlow(
  {
    name: 'identifySpeciesFlow',
    inputSchema: IdentifySpeciesInputSchema,
    outputSchema: IdentifySpeciesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

export async function identifySpecies(input: IdentifySpeciesInput): Promise<IdentifySpeciesOutput> {
  return identifySpeciesFlow(input);
}
