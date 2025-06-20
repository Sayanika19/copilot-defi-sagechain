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
    intent: data.intent || 'general_question',
    walletData: data.walletData || null
  };
};

export const createSystemPrompt = (intent: string, walletData?: any): string => {
  let systemPrompt = `You are a helpful DeFi AI assistant specialized in blockchain technology, DeFi protocols, and cryptocurrency. You provide accurate, up-to-date information about:
  - DeFi protocols and their risks/benefits
  - Portfolio analysis and recommendations
  - Blockchain technology explanations
  - Transaction guidance
  - Market insights
  
  Current user intent: ${intent}`;

  if (walletData) {
    systemPrompt += `
    
  IMPORTANT: The user has connected their wallet with the following information:
  - Wallet Address: ${walletData.address}
  - Current Balance: ${walletData.balance}
  - Wallet Type: ${walletData.walletType}
  ${walletData.tokens ? `- Token Holdings: ${JSON.stringify(walletData.tokens, null, 2)}` : ''}
  
  When asked about portfolio balance or holdings, use this ACTUAL wallet data to provide specific, accurate information about their assets. Do not say you cannot access their data - you have been provided with their current wallet information.`;
  }

  systemPrompt += `
  
  Be helpful, informative, and always prioritize user safety when discussing financial matters.`;

  return systemPrompt;
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
