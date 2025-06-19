
import { useState } from 'react';

interface SwapQuote {
  fromAmount: string;
  toAmount: string;
  estimatedGas: string;
  priceImpact: string;
}

export const useUniswapQuote = () => {
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getQuote = async (
    fromToken: string,
    toToken: string,
    amount: string
  ) => {
    if (!amount || !fromToken || !toToken) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // For demo purposes, we'll simulate a quote
      // In real implementation, you would use Uniswap SDK or ParaSwap API
      const mockQuote: SwapQuote = {
        fromAmount: amount,
        toAmount: (parseFloat(amount) * 0.995).toFixed(6), // 0.5% slippage
        estimatedGas: '0.003',
        priceImpact: '0.5%'
      };
      
      setQuote(mockQuote);
    } catch (err) {
      console.error('Error getting swap quote:', err);
      setError('Failed to get swap quote');
    } finally {
      setIsLoading(false);
    }
  };

  return { quote, isLoading, error, getQuote };
};
