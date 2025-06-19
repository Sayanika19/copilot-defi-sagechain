
import { useState, useEffect } from 'react';
import { coingeckoApi } from '@/services/coingeckoApi';

interface CoinPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  volume_24h: number;
  image?: string;
}

export const useCoinGeckoPrice = () => {
  const [prices, setPrices] = useState<CoinPrice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Get top cryptocurrencies by market cap
      const marketData = await coingeckoApi.getCoinsMarkets('usd', 'market_cap_desc', 20);
      
      const formattedPrices: CoinPrice[] = marketData.map(coin => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        current_price: coin.current_price,
        price_change_percentage_24h: coin.price_change_percentage_24h,
        market_cap: coin.market_cap,
        volume_24h: coin.total_volume,
        image: coin.image
      }));
      
      setPrices(formattedPrices);
    } catch (err) {
      console.error('Error fetching CoinGecko prices:', err);
      setError('Failed to fetch live prices');
      
      // Fallback to mock data
      setPrices([
        { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', current_price: 2500.68, price_change_percentage_24h: 0.04, market_cap: 300000000000, volume_24h: 15000000000 },
        { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', current_price: 104353, price_change_percentage_24h: -0.05, market_cap: 2000000000000, volume_24h: 25000000000 },
        { id: 'usd-coin', symbol: 'USDC', name: 'USD Coin', current_price: 0.999794, price_change_percentage_24h: -0.001, market_cap: 35000000000, volume_24h: 5000000000 },
        { id: 'tether', symbol: 'USDT', name: 'Tether', current_price: 1.0, price_change_percentage_24h: -0.003, market_cap: 140000000000, volume_24h: 45000000000 },
        { id: 'uniswap', symbol: 'UNI', name: 'Uniswap', current_price: 7.58, price_change_percentage_24h: 1.78, market_cap: 7500000000, volume_24h: 150000000 },
        { id: 'aave', symbol: 'AAVE', name: 'Aave', current_price: 251.48, price_change_percentage_24h: -2.53, market_cap: 3750000000, volume_24h: 125000000 }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    
    // Refresh prices every 60 seconds
    const interval = setInterval(fetchPrices, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return { prices, isLoading, error, refetch: fetchPrices };
};
