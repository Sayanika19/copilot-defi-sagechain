
interface CoinGeckoPrice {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

interface SimplePriceResponse {
  [key: string]: {
    usd: number;
    usd_24h_change: number;
  };
}

const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

export const coingeckoApi = {
  // Get simple price data for multiple coins
  async getSimplePrices(
    coinIds: string[],
    vsCurrency: string = 'usd',
    include24hChange: boolean = true
  ): Promise<SimplePriceResponse> {
    const ids = coinIds.join(',');
    const include24h = include24hChange ? '&include_24hr_change=true' : '';
    const url = `${COINGECKO_API_BASE}/simple/price?ids=${ids}&vs_currencies=${vsCurrency}${include24h}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Get detailed market data for coins
  async getCoinsMarkets(
    vsCurrency: string = 'usd',
    order: string = 'market_cap_desc',
    perPage: number = 100,
    page: number = 1,
    sparkline: boolean = false
  ): Promise<CoinGeckoPrice[]> {
    const url = `${COINGECKO_API_BASE}/coins/markets?vs_currency=${vsCurrency}&order=${order}&per_page=${perPage}&page=${page}&sparkline=${sparkline}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`CoinGecko markets API error: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Get trending coins
  async getTrendingCoins(): Promise<any> {
    const url = `${COINGECKO_API_BASE}/search/trending`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`CoinGecko trending API error: ${response.statusText}`);
    }
    
    return response.json();
  },

  // Get global market data
  async getGlobalData(): Promise<any> {
    const url = `${COINGECKO_API_BASE}/global`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`CoinGecko global API error: ${response.statusText}`);
    }
    
    return response.json();
  }
};
