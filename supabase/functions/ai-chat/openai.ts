
import { OpenAIRequest, OpenAIResponse } from './types.ts';
import { createSystemPrompt } from './utils.ts';

export class OpenAIService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(message: string, intent: string): Promise<string> {
    const requestBody: OpenAIRequest = {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: createSystemPrompt(intent)
        },
        {
          role: 'user',
          content: message
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    };

    console.log('Calling OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error('Failed to get AI response');
    }

    const data: OpenAIResponse = await response.json();
    return data.choices[0]?.message?.content || 'I apologize, but I could not generate a response at this time.';
  }
}
