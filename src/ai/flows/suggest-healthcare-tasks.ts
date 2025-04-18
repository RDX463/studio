'use server';
/**
 * @fileOverview An AI agent that suggests healthcare tasks based on the user's profession details.
 *
 * - suggestHealthcareTasks - A function that suggests healthcare tasks.
 * - SuggestHealthcareTasksInput - The input type for the suggestHealthcareTasks function.
 * - SuggestHealthcareTasksOutput - The return type for the suggestHealthcareTasks function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestHealthcareTasksInputSchema = z.object({
  profession: z.string().describe('The user\'s profession.'),
  professionDetails: z.string().describe('Details about the user\'s profession, including typical tasks and work environment.'),
});
export type SuggestHealthcareTasksInput = z.infer<typeof SuggestHealthcareTasksInputSchema>;

const SuggestHealthcareTasksOutputSchema = z.object({
  tasks: z.array(z.string()).describe('An array of suggested healthcare tasks tailored to the user\'s profession.'),
});
export type SuggestHealthcareTasksOutput = z.infer<typeof SuggestHealthcareTasksOutputSchema>;

export async function suggestHealthcareTasks(input: SuggestHealthcareTasksInput): Promise<SuggestHealthcareTasksOutput> {
  return suggestHealthcareTasksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestHealthcareTasksPrompt',
  input: {
    schema: z.object({
      profession: z.string().describe('The user\'s profession.'),
      professionDetails: z.string().describe('Details about the user\'s profession, including typical tasks and work environment.'),
    }),
  },
  output: {
    schema: z.object({
      tasks: z.array(z.string()).describe('An array of suggested healthcare tasks tailored to the user\'s profession.'),
    }),
  },
  prompt: `You are a helpful AI assistant that suggests healthcare tasks based on the user's profession.

  Given the following profession and details about the profession, suggest 5 healthcare tasks that the user should do. Only provide the tasks and nothing else.  Use a numbered list.

  Profession: {{{profession}}}
  Profession Details: {{{professionDetails}}}
  `,
});

const suggestHealthcareTasksFlow = ai.defineFlow<
  typeof SuggestHealthcareTasksInputSchema,
  typeof SuggestHealthcareTasksOutputSchema
>(
  {
    name: 'suggestHealthcareTasksFlow',
    inputSchema: SuggestHealthcareTasksInputSchema,
    outputSchema: SuggestHealthcareTasksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
