
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ChatRequest {
  message: string;
  conversationId?: string;
  intent?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('AI Chat function called');
    
    const authHeader = req.headers.get('Authorization');
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader) {
      console.error('No authorization header');
      return new Response(JSON.stringify({ error: 'No authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Get the user from the auth header
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    console.log('User auth result:', { user: !!user, error: userError });
    
    if (userError || !user) {
      console.error('Invalid user:', userError);
      return new Response(JSON.stringify({ error: 'Invalid user' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('User authenticated:', user.id);

    // Check rate limiting
    const now = new Date();
    const windowStart = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour window

    const { data: rateLimit } = await supabaseClient
      .from('rate_limits')
      .select('request_count')
      .eq('user_id', user.id)
      .eq('endpoint', 'ai-chat')
      .gte('window_start', windowStart.toISOString())
      .single();

    if (rateLimit && rateLimit.request_count >= 50) { // 50 requests per hour
      console.log('Rate limit exceeded for user:', user.id);
      return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Update rate limiting
    await supabaseClient
      .from('rate_limits')
      .upsert({
        user_id: user.id,
        endpoint: 'ai-chat',
        request_count: (rateLimit?.request_count || 0) + 1,
        window_start: windowStart.toISOString(),
      });

    const { message, conversationId, intent }: ChatRequest = await req.json();
    console.log('Request body:', { message: message.substring(0, 50), conversationId, intent });

    // Create or get conversation
    let currentConversationId = conversationId;
    if (!currentConversationId) {
      const { data: conversation, error: convError } = await supabaseClient
        .from('conversations')
        .insert({
          user_id: user.id,
          title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        })
        .select('id')
        .single();

      if (convError) {
        console.error('Error creating conversation:', convError);
        return new Response(JSON.stringify({ error: 'Failed to create conversation' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      currentConversationId = conversation.id;
      console.log('Created new conversation:', currentConversationId);
    }

    // Save user message to database
    await supabaseClient.from('chat_messages').insert({
      conversation_id: currentConversationId,
      user_id: user.id,
      type: 'user',
      content: message,
      intent: intent,
    });

    // Call OpenAI API
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      console.error('OpenAI API key not configured');
      return new Response(JSON.stringify({ error: 'OpenAI API key not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate contextual system prompt based on intent
    let systemPrompt = "You are a helpful DeFi AI assistant. ";
    const lowercaseMessage = message.toLowerCase();
    
    if (lowercaseMessage.includes('balance') || lowercaseMessage.includes('portfolio')) {
      systemPrompt += "The user wants to check their portfolio balance. Ask for their wallet address if not provided, and explain what information you can show them.";
    } else if (lowercaseMessage.includes('swap') || lowercaseMessage.includes('exchange')) {
      systemPrompt += "The user wants to swap tokens. Provide a step-by-step guide and include important disclaimers about slippage, gas fees, and market volatility.";
    } else if (lowercaseMessage.includes('stake') || lowercaseMessage.includes('staking')) {
      systemPrompt += "The user wants to stake tokens. Explain the staking process, rewards, risks, and lock-up periods. Include disclaimers about smart contract risks.";
    } else if (lowercaseMessage.includes('safest') || lowercaseMessage.includes('best protocol')) {
      systemPrompt += "The user wants to compare DeFi protocols. Focus on security, TVL, audit history, and risk factors. Be objective and mention that this is not financial advice.";
    } else if (lowercaseMessage.includes('explain') || lowercaseMessage.includes('what is')) {
      systemPrompt += "The user wants to understand a DeFi concept. Provide clear, educational explanations with examples. Break down complex topics into digestible parts.";
    } else {
      systemPrompt += "Provide helpful, accurate information about DeFi and blockchain technology. Be conversational and ask follow-up questions when appropriate.";
    }

    systemPrompt += " Always be conversational, helpful, and include appropriate disclaimers for financial actions. Keep responses concise but informative.";

    console.log('Calling OpenAI API');
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error('OpenAI API error:', errorText);
      return new Response(JSON.stringify({ error: 'OpenAI API error' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const openaiData = await openaiResponse.json();
    const aiResponse = openaiData.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    // Determine if response requires Web3 action
    const requiresWeb3 = ['swap', 'stake', 'balance', 'check'].some(keyword => 
      lowercaseMessage.includes(keyword)
    );

    // Add Web3 disclaimer if needed
    let finalResponse = aiResponse;
    if (requiresWeb3) {
      finalResponse += "\n\n⚠️ **Disclaimer**: This action requires Web3 execution. Please ensure you understand the risks and have sufficient gas fees. Always verify transaction details before confirming.";
    }

    // Save AI response to database
    await supabaseClient.from('chat_messages').insert({
      conversation_id: currentConversationId,
      user_id: user.id,
      type: 'ai',
      content: finalResponse,
      intent: intent,
      requires_web3: requiresWeb3,
    });

    console.log('AI response generated successfully');
    return new Response(JSON.stringify({ 
      response: finalResponse, 
      conversationId: currentConversationId,
      requiresWeb3 
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-chat function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
