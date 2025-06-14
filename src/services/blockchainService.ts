
export interface TokenBalance {
  symbol: string;
  name: string;
  balance: number;
  value: number;
  change: number;
  contractAddress?: string;
  decimals: number;
}

export interface DeFiPosition {
  protocol: string;
  type: string;
  asset: string;
  amount: number;
  apy: number;
  chain: string;
}

export interface WalletAssets {
  totalValue: number;
  change24h: number;
  changePercent: number;
  tokens: TokenBalance[];
  defiPositions: DeFiPosition[];
  activeChains: number;
}

// Common ERC-20 token contracts on Ethereum mainnet
const KNOWN_TOKENS = {
  '0xa0b86a33e6b8b447b4d4d48b3bfa58b2b7b45b78': { symbol: 'USDC', name: 'USD Coin', decimals: 6 },
  '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9': { symbol: 'AAVE', name: 'Aave', decimals: 18 },
  '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': { symbol: 'UNI', name: 'Uniswap', decimals: 18 },
};

export class BlockchainService {
  private ethPrice = 2800; // Mock ETH price - in real app, fetch from price API

  async getWalletAssets(address: string): Promise<WalletAssets> {
    try {
      console.log('Fetching wallet assets for:', address);
      
      // Get ETH balance
      const ethBalance = await this.getETHBalance(address);
      const ethValue = ethBalance * this.ethPrice;
      
      // Get ERC-20 token balances
      const tokenBalances = await this.getTokenBalances(address);
      
      // Calculate total portfolio value
      const totalTokenValue = tokenBalances.reduce((sum, token) => sum + token.value, 0);
      const totalValue = ethValue + totalTokenValue;
      
      // Create tokens array with ETH first
      const tokens: TokenBalance[] = [
        {
          symbol: 'ETH',
          name: 'Ethereum',
          balance: ethBalance,
          value: ethValue,
          change: 4.2,
          decimals: 18
        },
        ...tokenBalances
      ];

      // Mock DeFi positions (in real app, query protocols like Aave, Compound, etc.)
      const defiPositions: DeFiPosition[] = [
        {
          protocol: 'Aave V3',
          type: 'Lending',
          asset: 'USDC',
          amount: 1500,
          apy: 4.2,
          chain: 'Ethereum'
        },
        {
          protocol: 'Uniswap V3',
          type: 'LP',
          asset: 'ETH/USDC',
          amount: Math.floor(ethValue * 0.3),
          apy: 12.5,
          chain: 'Ethereum'
        }
      ];

      return {
        totalValue,
        change24h: totalValue * 0.025, // Mock 2.5% change
        changePercent: 2.5,
        tokens,
        defiPositions,
        activeChains: 2 // Ethereum + detected chains
      };
    } catch (error) {
      console.error('Error fetching wallet assets:', error);
      return this.getMockAssets();
    }
  }

  private async getETHBalance(address: string): Promise<number> {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest']
        });
        
        const balanceInWei = parseInt(balance, 16);
        return balanceInWei / Math.pow(10, 18);
      }
    } catch (error) {
      console.error('Error fetching ETH balance:', error);
    }
    return 0;
  }

  private async getTokenBalances(address: string): Promise<TokenBalance[]> {
    const tokens: TokenBalance[] = [];
    
    // In a real application, you would:
    // 1. Query token balances using web3 or ethers.js
    // 2. Use APIs like Alchemy, Moralis, or CoinGecko for token prices
    // 3. Query multiple chains (Polygon, Arbitrum, etc.)
    
    // For now, return mock data based on known tokens
    try {
      for (const [contractAddress, tokenInfo] of Object.entries(KNOWN_TOKENS)) {
        const balance = await this.getTokenBalance(address, contractAddress, tokenInfo.decimals);
        if (balance > 0) {
          const mockPrice = this.getMockTokenPrice(tokenInfo.symbol);
          tokens.push({
            symbol: tokenInfo.symbol,
            name: tokenInfo.name,
            balance,
            value: balance * mockPrice,
            change: Math.random() * 10 - 5, // Random change between -5% and +5%
            contractAddress,
            decimals: tokenInfo.decimals
          });
        }
      }
    } catch (error) {
      console.error('Error fetching token balances:', error);
    }

    return tokens;
  }

  private async getTokenBalance(address: string, contractAddress: string, decimals: number): Promise<number> {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        // ERC-20 balanceOf function call
        const data = `0x70a08231000000000000000000000000${address.slice(2)}`;
        
        const result = await window.ethereum.request({
          method: 'eth_call',
          params: [{
            to: contractAddress,
            data: data
          }, 'latest']
        });

        if (result && result !== '0x') {
          const balance = parseInt(result, 16);
          return balance / Math.pow(10, decimals);
        }
      }
    } catch (error) {
      console.error(`Error fetching token balance for ${contractAddress}:`, error);
    }
    
    // Return mock balance for demo
    return Math.random() * 1000;
  }

  private getMockTokenPrice(symbol: string): number {
    const prices: { [key: string]: number } = {
      'USDC': 1.00,
      'AAVE': 98.75,
      'UNI': 12.80
    };
    return prices[symbol] || 1;
  }

  private getMockAssets(): WalletAssets {
    return {
      totalValue: 0,
      change24h: 0,
      changePercent: 0,
      tokens: [],
      defiPositions: [],
      activeChains: 0
    };
  }

  async getTransactionHistory(address: string): Promise<any[]> {
    // In a real app, fetch from Etherscan API or similar
    console.log('Fetching transaction history for:', address);
    
    return [
      {
        action: 'Received ETH',
        amount: '0.5 ETH',
        protocol: 'Transfer',
        time: '1 hour ago',
        type: 'receive',
        hash: '0x123...'
      },
      {
        action: 'Swapped ETH → USDC',
        amount: '$1,200',
        protocol: 'Uniswap',
        time: '2 hours ago',
        type: 'swap',
        hash: '0x456...'
      }
    ];
  }
}

export const blockchainService = new BlockchainService();
