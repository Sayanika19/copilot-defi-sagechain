
import { useState } from 'react';
import { paraswapApi } from '@/services/paraswapApi';

interface SwapQuote {
  srcAmount: string;
  destAmount: string;
  srcToken: string;
  destToken: string;
  gasCost: string;
  gasCostUSD: string;
  priceRoute: any;
}

export const useParaSwap = () => {
  const [quote, setQuote] = useState<SwapQuote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getQuote = async (
    srcToken: string, 
    destToken: string, 
    amount: string
  ) => {
    if (!amount || !srcToken || !destToken) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Convert amount to wei (assuming 18 decimals for simplicity)
      const amountWei = (parseFloat(amount) * 1e18).toString();
      
      const priceData = await paraswapApi.getPrice(srcToken, destToken, amountWei);
      
      const swapQuote: SwapQuote = {
        srcAmount: amount,
        destAmount: (parseFloat(priceData.priceRoute.destAmount) / 1e18).toFixed(6),
        srcToken,
        destToken,
        gasCost: (parseFloat(priceData.priceRoute.gasCost) / 1e18).toFixed(6),
        gasCostUSD: priceData.priceRoute.gasCostUSD,
        priceRoute: priceData.priceRoute
      };
      
      setQuote(swapQuote);
    } catch (err) {
      console.error('ParaSwap quote error:', err);
      setError('Failed to get swap quote');
      // Fallback to mock data for demo
      setQuote({
        srcAmount: amount,
        destAmount: (parseFloat(amount) * 0.995).toFixed(6),
        srcToken,
        destToken,
        gasCost: '0.003',
        gasCostUSD: '7.50',
        priceRoute: null
      });
    } finally {
      setIsLoading(false);
    }
  };

  const executeSwap = async (userAddress: string, slippage: number = 1) => {
    if (!quote?.priceRoute) {
      throw new Error('No quote available');
    }

    try {
      const transaction = await paraswapApi.buildTransaction(
        quote.priceRoute,
        userAddress,
        slippage
      );
      
      // In a real implementation, you would execute this transaction via Web3
      console.log('Transaction built:', transaction);
      return transaction;
    } catch (err) {
      console.error('Swap execution error:', err);
      throw new Error('Failed to execute swap');
    }
  };

  return {
    quote,
    isLoading,
    error,
    getQuote,
    executeSwap
  };
};
