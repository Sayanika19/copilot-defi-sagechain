
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('AI Chat function called');
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'No authorization header provided' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Extract the token from the authorization header
    const token = authHeader.replace('Bearer ', '');
    console.log('Token extracted:', token.substring(0, 20) + '...');

    // Verify the user with the token
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Authentication failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid user authentication' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('User authenticated:', user.email);

    // Parse request body
    const { message, conversationId, intent } = await req.json();
    console.log('Request data:', { message, conversationId, intent, userId: user.id });

    if (!message) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Check rate limiting
    const rateLimitResult = await checkRateLimit(supabase, user.id);
    if (!rateLimitResult.allowed) {
      console.log('Rate limit exceeded for user:', user.id);
      return new Response(
        JSON.stringify({ error: 'Rate limit exceeded. Please try again in an hour.' }),
        { 
          status: 429, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get or create conversation
    let currentConversationId = conversationId;
    if (!currentConversationId) {
      console.log('Creating new conversation for user:', user.id);
      const { data: newConversation, error: conversationError } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          title: message.substring(0, 50) + (message.length > 50 ? '...' : '')
        })
        .select()
        .single();

      if (conversationError) {
        console.error('Error creating conversation:', conversationError);
        return new Response(
          JSON.stringify({ error: 'Failed to create conversation' }),
          { 
            status: 500, 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      currentConversationId = newConversation.id;
      console.log('New conversation created:', currentConversationId);
    }

    // Save user message
    const { error: messageError } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: currentConversationId,
        user_id: user.id,
        type: 'user',
        content: message,
        intent: intent
      });

    if (messageError) {
      console.error('Error saving user message:', messageError);
      return new Response(
        JSON.stringify({ error: 'Failed to save message' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Get OpenAI API key
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('OpenAI API key not configured');
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Call OpenAI API
    console.log('Calling OpenAI API...');
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a helpful DeFi AI assistant specialized in blockchain technology, DeFi protocols, and cryptocurrency. You provide accurate, up-to-date information about:
            - DeFi protocols and their risks/benefits
            - Portfolio analysis and recommendations
            - Blockchain technology explanations
            - Transaction guidance
            - Market insights
            
            Current user intent: ${intent}
            
            Be helpful, informative, and always prioritize user safety when discussing financial matters.`
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', openaiResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to get AI response' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const openaiData = await openaiResponse.json();
    const aiMessage = openaiData.choices[0]?.message?.content || 'I apologize, but I could not generate a response at this time.';

    console.log('AI response generated successfully');

    // Save AI response
    const { error: aiMessageError } = await supabase
      .from('chat_messages')
      .insert({
        conversation_id: currentConversationId,
        user_id: user.id,
        type: 'ai',
        content: aiMessage,
        intent: intent,
        requires_web3: intent === 'stake_token' || intent === 'swap_token'
      });

    if (aiMessageError) {
      console.error('Error saving AI message:', aiMessageError);
    }

    // Update conversation timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', currentConversationId);

    return new Response(
      JSON.stringify({
        response: aiMessage,
        conversationId: currentConversationId,
        requiresWeb3: intent === 'stake_token' || intent === 'swap_token'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Unexpected error in AI chat function:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});

async function checkRateLimit(supabase: any, userId: string): Promise<{ allowed: boolean }> {
  try {
    const windowStart = new Date();
    windowStart.setHours(windowStart.getHours() - 1);

    // Check current rate limit
    const { data: rateLimitData, error } = await supabase
      .from('rate_limits')
      .select('request_count')
      .eq('user_id', userId)
      .eq('endpoint', 'ai-chat')
      .gte('window_start', windowStart.toISOString())
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Rate limit check error:', error);
      return { allowed: true }; // Allow on error to avoid blocking users
    }

    const currentCount = rateLimitData?.request_count || 0;
    const limit = 50; // 50 requests per hour

    if (currentCount >= limit) {
      return { allowed: false };
    }

    // Update or insert rate limit record
    const { error: upsertError } = await supabase
      .from('rate_limits')
      .upsert({
        user_id: userId,
        endpoint: 'ai-chat',
        request_count: currentCount + 1,
        window_start: new Date().toISOString()
      }, {
        onConflict: 'user_id,endpoint'
      });

    if (upsertError) {
      console.error('Rate limit update error:', upsertError);
    }

    return { allowed: true };
  } catch (error) {
    console.error('Rate limit function error:', error);
    return { allowed: true }; // Allow on error
  }
}
