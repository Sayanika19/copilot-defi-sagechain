
import { ChatRequest, ChatResponse } from './types.ts';
import { validateRequest, createErrorResponse, corsHeaders } from './utils.ts';
import { GeminiService } from './gemini.ts';

export const handleChatRequest = async (req: Request): Promise<Response> => {
  try {
    console.log('AI Chat function called - no auth required');

    // Parse and validate request
    const body = await req.json();
    console.log('Request data:', body);
    
    const { message, intent, walletData } = body;

    if (!message || typeof message !== 'string') {
      return createErrorResponse('Message is required and must be a string', 400);
    }

    // Get Gemini API key
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      console.error('Gemini API key not configured');
      return createErrorResponse('AI service is temporarily unavailable');
    }

    // Create context-aware prompt with wallet data
    let contextualMessage = message;
    if (walletData && intent === 'check_balance') {
      const walletInfo = `
User's Connected Wallet Information:
- Address: ${walletData.address}
- Balance: ${walletData.balance}
- Wallet Type: ${walletData.walletType}
${walletData.tokens ? `- Token Holdings: ${JSON.stringify(walletData.tokens, null, 2)}` : ''}

User Question: ${message}

Please provide a detailed analysis of their portfolio based on the actual wallet data above. Include specific balance information, token breakdown, and relevant insights.`;
      
      contextualMessage = walletInfo;
    } else if (walletData) {
      contextualMessage = `User has connected wallet: ${walletData.address} with balance: ${walletData.balance}. User question: ${message}`;
    }

    // Generate streaming AI response
    const geminiService = new GeminiService(geminiApiKey);
    const stream = await geminiService.generateStreamingResponse(contextualMessage, intent);

    console.log('Gemini streaming response initiated');

    // Create a readable stream to handle the Gemini response
    const readableStream = new ReadableStream({
      async start(controller) {
        const reader = stream.getReader();
        let buffer = '';
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              console.log('Gemini stream completed');
              break;
            }

            const chunk = new TextDecoder().decode(value);
            buffer += chunk;

            // Try to extract complete JSON objects from buffer
            let startIndex = 0;
            let braceCount = 0;
            let inString = false;
            let escaped = false;

            for (let i = 0; i < buffer.length; i++) {
              const char = buffer[i];
              
              if (!escaped && char === '"') {
                inString = !inString;
              } else if (!inString) {
                if (char === '{') {
                  if (braceCount === 0) startIndex = i;
                  braceCount++;
                } else if (char === '}') {
                  braceCount--;
                  if (braceCount === 0) {
                    // Found complete JSON object
                    const jsonStr = buffer.slice(startIndex, i + 1);
                    try {
                      const jsonResponse = JSON.parse(jsonStr);
                      console.log('Successfully parsed JSON object');
                      
                      // Extract text content from Gemini's response structure
                      if (jsonResponse.candidates && jsonResponse.candidates.length > 0) {
                        const candidate = jsonResponse.candidates[0];
                        if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                          const part = candidate.content.parts[0];
                          if (part.text) {
                            console.log('Sending content to frontend:', part.text);
                            // Send the content in server-sent events format
                            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content: part.text })}\n\n`));
                          }
                        }
                      }
                      
                      // Remove processed JSON from buffer
                      buffer = buffer.slice(i + 1);
                      i = -1; // Reset loop
                      startIndex = 0;
                    } catch (parseError) {
                      console.log('Failed to parse extracted JSON:', parseError);
                    }
                  }
                }
              }
              
              escaped = !escaped && char === '\\';
            }
          }
        } catch (error) {
          console.error('Error reading Gemini stream:', error);
        } finally {
          reader.releaseLock();
          // Send completion signal
          console.log('Stream completed - sending [DONE] signal');
          controller.enqueue(new TextEncoder().encode(`data: [DONE]\n\n`));
          controller.close();
        }
      }
    });

    return new Response(readableStream, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

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
