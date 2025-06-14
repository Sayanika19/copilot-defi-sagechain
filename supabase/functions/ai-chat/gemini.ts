
export interface GeminiRequest {
  contents: Array<{
    parts: Array<{
      text: string;
    }>;
    role: string;
  }>;
  generationConfig: {
    temperature: number;
    topP: number;
    maxOutputTokens: number;
  };
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
    finishReason: string;
  }>;
}

export class GeminiService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateStreamingResponse(message: string, intent: string): Promise<ReadableStream> {
    const requestBody: GeminiRequest = {
      contents: [
        {
          parts: [{ text: this.createSystemPrompt(intent) }],
          role: 'user'
        },
        {
          parts: [{ text: 'I understand. I am a DeFi AI assistant.' }],
          role: 'model'
        },
        {
          parts: [{ text: message }],
          role: 'user'
        }
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        maxOutputTokens: 1000,
      },
    };

    console.log('Calling Gemini API for streaming response...');
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?key=${this.apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error('Failed to get AI response');
    }

    return response.body!;
  }

  private createSystemPrompt(intent: string): string {
    return `You are a helpful DeFi AI assistant specialized in blockchain technology, DeFi protocols, and cryptocurrency. You provide accurate, up-to-date information about:
    - DeFi protocols and their risks/benefits
    - Portfolio analysis and recommendations
    - Blockchain technology explanations
    - Transaction guidance
    - Market insights
    
    Current user intent: ${intent}
    
    Be helpful, informative, and always prioritize user safety when discussing financial matters. Keep responses concise and practical.`;
  }
}
