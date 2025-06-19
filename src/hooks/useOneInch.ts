
import { useState } from 'react';
import { oneInchApi } from '@/services/oneInchApi';

interface OneInchQuote {
  fromTokenAmount: string;
  toTokenAmount: string;
  fromToken: any;
  toToken: any;
  estimatedGas: number;
  protocols: any[];
}

interface OneInchSwapData {
  tx: {
    from: string;
    to: string;
    data: string;
    value: string;
    gasPrice: string;
    gas: number;
  };
  fromTokenAmount: string;
  toTokenAmount: string;
}

export const useOneInch = () => {
  const [quote, setQuote] = useState<OneInchQuote | null>(null);
  const [swapData, setSwapData] = useState<OneInchSwapData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Token addresses for major cryptocurrencies
  const tokenAddresses: { [key: string]: string } = {
    'ETH': '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
    'USDC': '0xA0b86a33E6417bC6E7bD8E8fF0b1B28b64E5C1C8',
    'USDT': '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    'WBTC': '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    'UNI': '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
    'AAVE': '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
  };

  const getQuote = async (
    fromToken: string,
    toToken: string,
    amount: string
  ) => {
    if (!amount || !fromToken || !toToken) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const fromTokenAddress = tokenAddresses[fromToken];
      const toTokenAddress = tokenAddresses[toToken];
      
      if (!fromTokenAddress || !toTokenAddress) {
        throw new Error('Unsupported token');
      }

      // Convert amount to wei (assuming 18 decimals for simplicity)
      const amountWei = (parseFloat(amount) * 1e18).toString();
      
      const quoteData = await oneInchApi.getQuote(
        fromTokenAddress,
        toTokenAddress,
        amountWei
      );
      
      setQuote(quoteData);
    } catch (err) {
      console.error('1inch quote error:', err);
      setError('Failed to get swap quote');
      // Fallback to mock data for demo
      setQuote({
        fromTokenAmount: (parseFloat(amount) * 1e18).toString(),
        toTokenAmount: (parseFloat(amount) * 0.995 * 1e18).toString(),
        fromToken: { symbol: fromToken },
        toToken: { symbol: toToken },
        estimatedGas: 150000,
        protocols: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  const executeSwap = async (
    fromToken: string,
    toToken: string,
    amount: string,
    userAddress: string,
    slippage: number = 1
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const fromTokenAddress = tokenAddresses[fromToken];
      const toTokenAddress = tokenAddresses[toToken];
      
      if (!fromTokenAddress || !toTokenAddress) {
        throw new Error('Unsupported token');
      }

      // Convert amount to wei
      const amountWei = (parseFloat(amount) * 1e18).toString();
      
      const swapTransaction = await oneInchApi.getSwap(
        fromTokenAddress,
        toTokenAddress,
        amountWei,
        userAddress,
        slippage
      );
      
      setSwapData(swapTransaction);
      
      // In a real implementation, you would execute this transaction via Web3
      if (window.ethereum) {
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [swapTransaction.tx],
        });
        
        console.log('Transaction sent:', txHash);
        return txHash;
      }
      
      return swapTransaction;
    } catch (err) {
      console.error('1inch swap error:', err);
      setError('Failed to execute swap');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getCashOutQuote = async (
    token: string,
    amount: string
  ) => {
    // Cash out means converting to stablecoin (USDC)
    return getQuote(token, 'USDC', amount);
  };

  const executeCashOut = async (
    token: string,
    amount: string,
    userAddress: string
  ) => {
    // Cash out means converting to stablecoin (USDC)
    return executeSwap(token, 'USDC', amount, userAddress);
  };

  return {
    quote,
    swapData,
    isLoading,
    error,
    getQuote,
    executeSwap,
    getCashOutQuote,
    executeCashOut,
    tokenAddresses
  };
};
