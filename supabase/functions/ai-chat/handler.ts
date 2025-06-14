
import { ChatRequest, ChatResponse } from './types.ts';
import { validateRequest, createErrorResponse, corsHeaders } from './utils.ts';
import { GeminiService } from './gemini.ts';

export const handleChatRequest = async (req: Request): Promise<Response> => {
  try {
    console.log('AI Chat function called - no auth required');

    // Parse and validate request
    const body = await req.json();
    console.log('Request data:', body);
    
    const { message, intent } = validateRequest(body);

    // Get Gemini API key
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      console.error('Gemini API key not configured');
      return createErrorResponse('AI service is temporarily unavailable');
    }

    // Generate streaming AI response
    const geminiService = new GeminiService(geminiApiKey);
    const stream = await geminiService.generateStreamingResponse(message, intent);

    console.log('Gemini streaming response initiated');

    // Create a TransformStream to process the Gemini response
    const transformStream = new TransformStream({
      transform(chunk, controller) {
        const decoder = new TextDecoder();
        const text = decoder.decode(chunk);
        
        // Split by lines and process each line
        const lines = text.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          // Skip empty lines and non-JSON lines
          if (!line.trim() || line.trim() === 'data: [DONE]') continue;
          
          try {
            // Try to parse as JSON directly (Gemini format)
            let jsonData;
            if (line.startsWith('data: ')) {
              jsonData = JSON.parse(line.slice(6));
            } else if (line.trim().startsWith('{')) {
              jsonData = JSON.parse(line.trim());
            } else {
              continue;
            }
            
            // Extract content from Gemini response structure
            if (jsonData.candidates && jsonData.candidates.length > 0) {
              const candidate = jsonData.candidates[0];
              if (candidate.content && candidate.content.parts && candidate.content.parts.length > 0) {
                const content = candidate.content.parts[0].text;
                if (content) {
                  console.log('Streaming content chunk:', content);
                  controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ content })}\n\n`));
                }
              }
            }
          } catch (e) {
            console.log('Skipping invalid JSON line:', line.substring(0, 100));
          }
        }
      },
      
      flush(controller) {
        // Send final message to indicate stream completion
        controller.enqueue(new TextEncoder().encode(`data: [DONE]\n\n`));
      }
    });

    return new Response(stream.pipeThrough(transformStream), {
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
