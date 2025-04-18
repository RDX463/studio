'use server';
/**
 * @fileOverview An AI agent that suggests a due date for a given task,
 * considering the user's profession.
 *
 * - suggestDueDate - A function that suggests a due date for a task.
 * - SuggestDueDateInput - The input type for the suggestDueDate function.
 * - SuggestDueDateOutput - The return type for the suggestDueDate function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SuggestDueDateInputSchema = z.object({
  task: z.string().describe('The task for which to suggest a due date.'),
  profession: z.string().optional().describe('The user\'s profession.'),
  professionDetails: z.string().optional().describe('Details about the user\'s profession, including typical tasks and work hours.'),
});
export type SuggestDueDateInput = z.infer<typeof SuggestDueDateInputSchema>;

const SuggestDueDateOutputSchema = z.object({
  dueDate: z.string().describe('The suggested due date for the task in ISO format (YYYY-MM-DD).'),
});
export type SuggestDueDateOutput = z.infer<typeof SuggestDueDateOutputSchema>;

export async function suggestDueDate(input: SuggestDueDateInput): Promise<SuggestDueDateOutput> {
  return suggestDueDateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestDueDatePrompt',
  input: {
    schema: z.object({
      task: z.string().describe('The task for which to suggest a due date.'),
      profession: z.string().optional().describe('The user\'s profession.'),
      professionDetails: z.string().optional().describe('Details about the user\'s profession, including typical tasks and work hours.'),
    }),
  },
  output: {
    schema: z.object({
      dueDate: z.string().describe('The suggested due date for the task in ISO format (YYYY-MM-DD).'),
    }),
  },
  prompt: `You are a helpful AI assistant that suggests a due date for a given task.

  Given the following task, suggest a due date in ISO format (YYYY-MM-DD).  Take into account how long the task will take.  Consider the user's profession when suggesting a due date.
  Profession: {{{profession}}}
  Profession Details: {{{professionDetails}}}

  Task: {{{task}}}`,
});

const suggestDueDateFlow = ai.defineFlow<
  typeof SuggestDueDateInputSchema,
  typeof SuggestDueDateOutputSchema
>(
  {
    name: 'suggestDueDateFlow',
    inputSchema: SuggestDueDateInputSchema,
    outputSchema: SuggestDueDateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
