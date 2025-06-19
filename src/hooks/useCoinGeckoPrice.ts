
import { useState, useEffect } from 'react';

interface CoinPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export const useCoinGeckoPrice = () => {
  const [prices, setPrices] = useState<CoinPrice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum,bitcoin,usd-coin,tether,uniswap,aave&vs_currencies=usd&include_24hr_change=true'
      );
      
      if (response.ok) {
        const data = await response.json();
        
        const formattedPrices: CoinPrice[] = [
          {
            id: 'ethereum',
            symbol: 'ETH',
            name: 'Ethereum',
            current_price: data.ethereum?.usd || 2340.50,
            price_change_percentage_24h: data.ethereum?.usd_24h_change || 2.4
          },
          {
            id: 'bitcoin',
            symbol: 'BTC',
            name: 'Bitcoin',
            current_price: data.bitcoin?.usd || 43250.00,
            price_change_percentage_24h: data.bitcoin?.usd_24h_change || 1.8
          },
          {
            id: 'usd-coin',
            symbol: 'USDC',
            name: 'USD Coin',
            current_price: data['usd-coin']?.usd || 1.00,
            price_change_percentage_24h: data['usd-coin']?.usd_24h_change || 0.0
          },
          {
            id: 'tether',
            symbol: 'USDT',
            name: 'Tether',
            current_price: data.tether?.usd || 1.00,
            price_change_percentage_24h: data.tether?.usd_24h_change || 0.0
          },
          {
            id: 'uniswap',
            symbol: 'UNI',
            name: 'Uniswap',
            current_price: data.uniswap?.usd || 8.45,
            price_change_percentage_24h: data.uniswap?.usd_24h_change || 3.2
          },
          {
            id: 'aave',
            symbol: 'AAVE',
            name: 'Aave',
            current_price: data.aave?.usd || 95.30,
            price_change_percentage_24h: data.aave?.usd_24h_change || 4.1
          }
        ];
        
        setPrices(formattedPrices);
      } else {
        throw new Error('Failed to fetch prices');
      }
    } catch (err) {
      console.error('Error fetching CoinGecko prices:', err);
      setError('Failed to fetch live prices');
      // Fallback to mock data
      setPrices([
        { id: 'ethereum', symbol: 'ETH', name: 'Ethereum', current_price: 2340.50, price_change_percentage_24h: 2.4 },
        { id: 'bitcoin', symbol: 'BTC', name: 'Bitcoin', current_price: 43250.00, price_change_percentage_24h: 1.8 },
        { id: 'usd-coin', symbol: 'USDC', name: 'USD Coin', current_price: 1.00, price_change_percentage_24h: 0.0 },
        { id: 'tether', symbol: 'USDT', name: 'Tether', current_price: 1.00, price_change_percentage_24h: 0.0 },
        { id: 'uniswap', symbol: 'UNI', name: 'Uniswap', current_price: 8.45, price_change_percentage_24h: 3.2 },
        { id: 'aave', symbol: 'AAVE', name: 'Aave', current_price: 95.30, price_change_percentage_24h: 4.1 }
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
