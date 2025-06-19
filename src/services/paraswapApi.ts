
interface ParaSwapPrice {
  priceRoute: {
    amount: string;
    srcToken: string;
    srcDecimals: number;
    destToken: string;
    destDecimals: number;
    destAmount: string;
    bestRoute: any[];
    gasCost: string;
    gasCostUSD: string;
  };
}

interface ParaSwapTransaction {
  from: string;
  to: string;
  value: string;
  data: string;
  gasPrice: string;
  gas: string;
}

const PARASWAP_API_BASE = 'https://apiv5.paraswap.io';

export const paraswapApi = {
  // Get price quote for token swap
  async getPrice(
    srcToken: string,
    destToken: string,
    amount: string,
    network: number = 1 // Ethereum mainnet
  ): Promise<ParaSwapPrice> {
    const url = `${PARASWAP_API_BASE}/prices?srcToken=${srcToken}&destToken=${destToken}&amount=${amount}&network=${network}&side=SELL`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`ParaSwap API error: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Build transaction for token swap
  async buildTransaction(
    priceRoute: any,
    userAddress: string,
    slippage: number = 1 // 1% slippage
  ): Promise<ParaSwapTransaction> {
    const url = `${PARASWAP_API_BASE}/transactions/1`;
    
    const body = {
      priceRoute,
      srcToken: priceRoute.srcToken,
      destToken: priceRoute.destToken,
      srcAmount: priceRoute.amount,
      destAmount: priceRoute.destAmount,
      userAddress,
      slippage: slippage * 100, // Convert to basis points
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`ParaSwap transaction build error: ${response.statusText}`);
    }

    return response.json();
  },

  // Get supported tokens list
  async getTokens(network: number = 1): Promise<any[]> {
    const url = `${PARASWAP_API_BASE}/tokens/${network}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`ParaSwap tokens API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.tokens;
  }
};
