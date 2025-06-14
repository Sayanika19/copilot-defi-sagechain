
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BlockchainRequest {
  walletAddress: string;
  chain?: string;
  dataType: 'balance' | 'tokens' | 'transactions' | 'nfts';
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
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
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid user' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check rate limiting
    const now = new Date();
    const windowStart = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour window

    const { data: rateLimit } = await supabaseClient
      .from('rate_limits')
      .select('request_count')
      .eq('user_id', user.id)
      .eq('endpoint', 'blockchain-data')
      .gte('window_start', windowStart.toISOString())
      .single();

    if (rateLimit && rateLimit.request_count >= 100) { // 100 requests per hour
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
        endpoint: 'blockchain-data',
        request_count: (rateLimit?.request_count || 0) + 1,
        window_start: windowStart.toISOString(),
      });

    const { walletAddress, chain = 'ethereum', dataType }: BlockchainRequest = await req.json();

    // Validate wallet address format (basic validation)
    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return new Response(JSON.stringify({ error: 'Invalid wallet address format' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Mock blockchain data for now - in production, you'd integrate with Alchemy/Moralis
    // This is a placeholder structure for the actual implementation
    const mockData = {
      balance: {
        address: walletAddress,
        chain: chain,
        balances: [
          { token: 'ETH', balance: '2.45', value_usd: '4900.00' },
          { token: 'USDC', balance: '1250.00', value_usd: '1250.00' },
          { token: 'AAVE', balance: '15.5', value_usd: '2325.00' }
        ],
        total_value_usd: '8475.00'
      },
      tokens: {
        address: walletAddress,
        chain: chain,
        tokens: [
          {
            symbol: 'ETH',
            name: 'Ethereum',
            balance: '2.45',
            price_usd: '2000.00',
            value_usd: '4900.00'
          },
          {
            symbol: 'USDC',
            name: 'USD Coin',
            balance: '1250.00',
            price_usd: '1.00',
            value_usd: '1250.00'
          }
        ]
      },
      transactions: {
        address: walletAddress,
        chain: chain,
        transactions: [
          {
            hash: '0x123...abc',
            type: 'swap',
            from_token: 'ETH',
            to_token: 'USDC',
            amount: '0.5',
            timestamp: new Date().toISOString()
          }
        ]
      },
      nfts: {
        address: walletAddress,
        chain: chain,
        nfts: []
      }
    };

    const responseData = mockData[dataType] || { error: 'Invalid data type' };

    console.log(`Blockchain data request - User: ${user.id}, Address: ${walletAddress}, Type: ${dataType}`);

    return new Response(JSON.stringify(responseData), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in blockchain-data function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
