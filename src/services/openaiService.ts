
interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
  choices: {
    message: {
      content: string;
    };
  }[];
}

// Integrated API key directly in the code
const OPENAI_API_KEY = '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';

export const makeOpenAIPrediction = async (
  userMessage: string,
  conversationHistory: OpenAIMessage[] = []
): Promise<string> => {
  const systemPrompt: OpenAIMessage = {
    role: 'system',
    content: `You are a DeFi AI assistant specializing in real-time market predictions and analysis. 
    Provide actionable insights about:
    - Token price movements and trends
    - DeFi protocol risks and opportunities
    - Yield farming strategies
    - Market sentiment analysis
    - Gas fee optimization
    
    Be concise, accurate, and focus on practical DeFi advice. If you detect specific trading intent, provide clear recommendations with risk warnings.`
  };

  const messages: OpenAIMessage[] = [
    systemPrompt,
    ...conversationHistory.slice(-5), // Keep last 5 messages for context
    { role: 'user', content: userMessage }
  ];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        temperature: 0.7,
        max_tokens: 500,
        top_p: 0.9,
        frequency_penalty: 0.3,
        presence_penalty: 0.3
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Response:', errorData);
      throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data: OpenAIResponse = await response.json();
    return data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to get AI prediction. Please try again.');
  }
};
