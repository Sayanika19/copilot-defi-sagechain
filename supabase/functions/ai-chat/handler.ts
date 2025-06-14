
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
        
        console.log('Raw chunk from Gemini:', text);
        
        // Process each line in the chunk
        const lines = text.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          try {
            // Try to parse as JSON
            const jsonResponse = JSON.parse(line);
            console.log('Parsed JSON response:', JSON.stringify(jsonResponse, null, 2));
            
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
          } catch (parseError) {
            // If it's not valid JSON, skip it
            console.log('Skipping non-JSON content:', line.substring(0, 100));
          }
        }
      },
      
      flush(controller) {
        // Send completion signal
        console.log('Stream completed - sending [DONE] signal');
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
