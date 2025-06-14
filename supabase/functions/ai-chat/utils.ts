
import { ChatRequest } from './types.ts';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const validateRequest = (data: any): ChatRequest => {
  if (!data.message || typeof data.message !== 'string') {
    throw new Error('Message is required and must be a string');
  }
  
  return {
    message: data.message,
    intent: data.intent || 'general_question'
  };
};

export const createSystemPrompt = (intent: string): string => {
  return `You are a helpful DeFi AI assistant specialized in blockchain technology, DeFi protocols, and cryptocurrency. You provide accurate, up-to-date information about:
  - DeFi protocols and their risks/benefits
  - Portfolio analysis and recommendations
  - Blockchain technology explanations
  - Transaction guidance
  - Market insights
  
  Current user intent: ${intent}
  
  Be helpful, informative, and always prioritize user safety when discussing financial matters.`;
};

export const createErrorResponse = (message: string, status: number = 500) => {
  return new Response(
    JSON.stringify({ error: message }),
    { 
      status, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
};

export const createSuccessResponse = (response: string, requiresWeb3: boolean = false) => {
  return new Response(
    JSON.stringify({
      response,
      requiresWeb3
    }),
    { 
      status: 200, 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
    }
  );
};
