
import { ChatRequest, ChatResponse } from './types.ts';
import { validateRequest, createErrorResponse, createSuccessResponse } from './utils.ts';
import { OpenAIService } from './openai.ts';

export const handleChatRequest = async (req: Request): Promise<Response> => {
  try {
    console.log('AI Chat function called - no auth required');

    // Parse and validate request
    const body = await req.json();
    console.log('Request data:', body);
    
    const { message, intent } = validateRequest(body);

    // Get OpenAI API key
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('OpenAI API key not configured');
      return createErrorResponse('AI service is temporarily unavailable');
    }

    // Generate AI response
    const openaiService = new OpenAIService(openaiApiKey);
    const aiMessage = await openaiService.generateResponse(message, intent);

    console.log('AI response generated successfully');

    // Determine if Web3 functionality is required
    const requiresWeb3 = intent === 'stake_token' || intent === 'swap_token';

    return createSuccessResponse(aiMessage, requiresWeb3);

  } catch (error) {
    console.error('Error in chat handler:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Message is required and must be a string') {
        return createErrorResponse(error.message, 400);
      }
      if (error.message === 'Failed to get AI response') {
        return createErrorResponse('Failed to get AI response');
      }
    }
    
    return createErrorResponse('An unexpected error occurred');
  }
};
