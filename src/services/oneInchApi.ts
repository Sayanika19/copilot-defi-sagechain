
interface OneInchToken {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI: string;
}

interface OneInchQuote {
  fromToken: OneInchToken;
  toToken: OneInchToken;
  toTokenAmount: string;
  fromTokenAmount: string;
  protocols: any[];
  estimatedGas: number;
}

interface OneInchSwap {
  fromToken: OneInchToken;
  toToken: OneInchToken;
  toTokenAmount: string;
  fromTokenAmount: string;
  protocols: any[];
  tx: {
    from: string;
    to: string;
    data: string;
    value: string;
    gasPrice: string;
    gas: number;
  };
}

const ONE_INCH_API_KEY = "3pAulSfGvU4fvxxUMva801cNvI5ABone";
const ONE_INCH_BASE_URL = "https://api.1inch.dev";
const CHAIN_ID = 1; // Ethereum mainnet

export const oneInchApi = {
  // Get list of supported tokens
  async getTokens(): Promise<{ [address: string]: OneInchToken }> {
    const response = await fetch(`${ONE_INCH_BASE_URL}/token/v1.2/${CHAIN_ID}`, {
      headers: {
        'Authorization': `Bearer ${ONE_INCH_API_KEY}`,
        'accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`1inch tokens API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.tokens;
  },

  // Get quote for token swap
  async getQuote(
    fromTokenAddress: string,
    toTokenAddress: string,
    amount: string
  ): Promise<OneInchQuote> {
    const params = new URLSearchParams({
      src: fromTokenAddress,
      dst: toTokenAddress,
      amount: amount,
    });

    const response = await fetch(
      `${ONE_INCH_BASE_URL}/swap/v6.0/${CHAIN_ID}/quote?${params}`,
      {
        headers: {
          'Authorization': `Bearer ${ONE_INCH_API_KEY}`,
          'accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`1inch quote API error: ${response.statusText}`);
    }

    return response.json();
  },

  // Build swap transaction
  async getSwap(
    fromTokenAddress: string,
    toTokenAddress: string,
    amount: string,
    fromAddress: string,
    slippage: number = 1
  ): Promise<OneInchSwap> {
    const params = new URLSearchParams({
      src: fromTokenAddress,
      dst: toTokenAddress,
      amount: amount,
      from: fromAddress,
      slippage: slippage.toString(),
    });

    const response = await fetch(
      `${ONE_INCH_BASE_URL}/swap/v6.0/${CHAIN_ID}/swap?${params}`,
      {
        headers: {
          'Authorization': `Bearer ${ONE_INCH_API_KEY}`,
          'accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`1inch swap API error: ${response.statusText}`);
    }

    return response.json();
  },

  // Get token allowance
  async getAllowance(
    tokenAddress: string,
    walletAddress: string
  ): Promise<string> {
    const params = new URLSearchParams({
      tokenAddress: tokenAddress,
      walletAddress: walletAddress,
    });

    const response = await fetch(
      `${ONE_INCH_BASE_URL}/token/v1.2/${CHAIN_ID}/allowance?${params}`,
      {
        headers: {
          'Authorization': `Bearer ${ONE_INCH_API_KEY}`,
          'accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`1inch allowance API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.allowance;
  },

  // Get approve transaction
  async getApprove(
    tokenAddress: string,
    amount?: string
  ): Promise<{ data: string; gasPrice: string; to: string; value: string }> {
    const params = new URLSearchParams({
      tokenAddress: tokenAddress,
      ...(amount && { amount }),
    });

    const response = await fetch(
      `${ONE_INCH_BASE_URL}/token/v1.2/${CHAIN_ID}/approve/transaction?${params}`,
      {
        headers: {
          'Authorization': `Bearer ${ONE_INCH_API_KEY}`,
          'accept': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`1inch approve API error: ${response.statusText}`);
    }

    return response.json();
  }
};
