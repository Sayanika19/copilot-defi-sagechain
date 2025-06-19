
import { useState, useEffect } from 'react';
import { WalletData } from '@/components/WalletConnector';

interface TokenBalance {
  [key: string]: number;
}

export const useWalletBalance = (walletData: WalletData | null) => {
  const [balances, setBalances] = useState<TokenBalance>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRealTimeBalance = async (address: string) => {
    if (!address) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Using Alchemy API for real-time balance fetching
      const response = await fetch(`https://eth-mainnet.g.alchemy.com/v2/demo/getTokenBalances`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jsonrpc: '2.0',
          method: 'alchemy_getTokenBalances',
          params: [address],
          id: 1,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // For demo purposes, we'll use mock data but in real implementation
        // you would parse the actual response
        const mockBalances = {
          ETH: 2.5479,
          BTC: 0.0342,
          USDC: 1250.75,
          USDT: 850.20,
          UNI: 45.8,
          AAVE: 8.2
        };
        setBalances(mockBalances);
      } else {
        throw new Error('Failed to fetch balance');
      }
    } catch (err) {
      console.error('Error fetching real-time balance:', err);
      // Fallback to wallet data
      if (walletData?.tokens) {
        setBalances(walletData.tokens);
      }
      setError('Failed to fetch real-time balance');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (walletData?.address) {
      fetchRealTimeBalance(walletData.address);
      
      // Refresh balance every 30 seconds
      const interval = setInterval(() => {
        fetchRealTimeBalance(walletData.address);
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [walletData?.address]);

  return { balances, isLoading, error, refetch: () => fetchRealTimeBalance(walletData?.address || '') };
};
