
import { useState, useEffect } from 'react';
import { WalletData } from '@/components/WalletConnector';
import { blockchainService, WalletAssets } from '@/services/blockchainService';

export const useWalletData = (walletData: WalletData | null) => {
  const [assets, setAssets] = useState<WalletAssets | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!walletData?.address) {
      setAssets(null);
      setTransactions([]);
      return;
    }

    const fetchWalletData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Fetching real-time wallet data for:', walletData.address);
        
        // Fetch assets and transactions in parallel
        const [assetsData, transactionsData] = await Promise.all([
          blockchainService.getWalletAssets(walletData.address),
          blockchainService.getTransactionHistory(walletData.address)
        ]);

        setAssets(assetsData);
        setTransactions(transactionsData);
      } catch (err) {
        console.error('Error fetching wallet data:', err);
        setError('Failed to fetch wallet data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletData();

    // Set up periodic refresh every 30 seconds
    const interval = setInterval(fetchWalletData, 30000);

    return () => clearInterval(interval);
  }, [walletData?.address]);

  return {
    assets,
    transactions,
    isLoading,
    error,
    refetch: () => {
      if (walletData?.address) {
        setIsLoading(true);
        blockchainService.getWalletAssets(walletData.address)
          .then(setAssets)
          .catch(err => setError('Failed to refresh data'))
          .finally(() => setIsLoading(false));
      }
    }
  };
};
