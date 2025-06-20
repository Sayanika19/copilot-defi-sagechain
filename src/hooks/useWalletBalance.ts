
import { useState, useEffect } from 'react';
import { WalletData } from '@/components/WalletConnector';

interface TokenBalance {
  [key: string]: number;
}

interface TokenPrice {
  [key: string]: number;
}

export const useWalletBalance = (walletData: WalletData | null) => {
  const [balances, setBalances] = useState<TokenBalance>({});
  const [prices, setPrices] = useState<TokenPrice>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTokenPrices = async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin,usd-coin,tether,uniswap,aave&vs_currencies=usd'
      );
      const data = await response.json();
      
      setPrices({
        ETH: data.ethereum?.usd || 0,
        BTC: data.bitcoin?.usd || 0,
        USDC: data['usd-coin']?.usd || 1,
        USDT: data.tether?.usd || 1,
        UNI: data.uniswap?.usd || 0,
        AAVE: data.aave?.usd || 0
      });
    } catch (err) {
      console.error('Error fetching token prices:', err);
    }
  };

  const fetchRealTimeBalance = async (address: string) => {
    if (!address) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch ETH balance
      if (window.ethereum) {
        const ethBalance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest']
        });
        
        const balanceInEth = parseInt(ethBalance, 16) / Math.pow(10, 18);
        
        // For demo purposes, we'll simulate token balances based on ETH balance
        // In a real implementation, you'd fetch actual token balances from the blockchain
        const simulatedBalances = {
          ETH: balanceInEth,
          BTC: balanceInEth * 0.013, // Simulated BTC based on ETH ratio
          USDC: balanceInEth * 2500, // Simulated USDC
          USDT: balanceInEth * 1200, // Simulated USDT
          UNI: balanceInEth * 18, // Simulated UNI
          AAVE: balanceInEth * 3.2 // Simulated AAVE
        };
        
        setBalances(simulatedBalances);
      }

      // Fetch current token prices
      await fetchTokenPrices();

    } catch (err) {
      console.error('Error fetching real-time balance:', err);
      setError('Failed to fetch real-time balance');
      
      // Fallback to wallet data if available
      if (walletData?.tokens) {
        setBalances(walletData.tokens);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (walletData?.address) {
      fetchRealTimeBalance(walletData.address);
      
      // Refresh balance and prices every 30 seconds
      const interval = setInterval(() => {
        fetchRealTimeBalance(walletData.address);
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [walletData?.address]);

  const getTotalPortfolioValue = () => {
    return Object.entries(balances).reduce((total, [token, amount]) => {
      const price = prices[token] || 0;
      return total + (amount * price);
    }, 0);
  };

  return { 
    balances, 
    prices,
    totalValue: getTotalPortfolioValue(),
    isLoading, 
    error, 
    refetch: () => fetchRealTimeBalance(walletData?.address || '') 
  };
};
