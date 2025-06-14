
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, TrendingUp, TrendingDown, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { WalletData } from "../WalletConnector";

interface Asset {
  symbol: string;
  name: string;
  quantity: number;
  currentPrice: number;
  totalValue: number;
  change24h: number;
  chain: string;
  type: 'native' | 'stablecoin' | 'altcoin' | 'defi';
}

interface AssetTrackingProps {
  walletData?: WalletData | null;
  isConnected: boolean;
}

const AssetTracking = ({ walletData, isConnected }: AssetTrackingProps) => {
  const [hideSmallBalances, setHideSmallBalances] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Generate realistic assets based on wallet data
  const generateAssets = (): Asset[] => {
    if (!isConnected || !walletData?.balance) return [];
    
    const ethAmount = parseFloat(walletData.balance.replace(' ETH', ''));
    const assets: Asset[] = [];

    // Always include ETH
    if (ethAmount > 0) {
      assets.push({
        symbol: 'ETH',
        name: 'Ethereum',
        quantity: ethAmount,
        currentPrice: 2800,
        totalValue: ethAmount * 2800,
        change24h: 4.2,
        chain: 'Ethereum',
        type: 'native'
      });
    }

    // Add other assets based on ETH amount
    if (ethAmount > 1) {
      const usdcAmount = Math.floor(ethAmount * 500);
      assets.push({
        symbol: 'USDC',
        name: 'USD Coin',
        quantity: usdcAmount,
        currentPrice: 1.00,
        totalValue: usdcAmount,
        change24h: 0.1,
        chain: 'Ethereum',
        type: 'stablecoin'
      });
    }

    if (ethAmount > 2) {
      const aaveAmount = ethAmount * 5.2;
      assets.push({
        symbol: 'AAVE',
        name: 'Aave',
        quantity: aaveAmount,
        currentPrice: 98.7,
        totalValue: aaveAmount * 98.7,
        change24h: -2.1,
        chain: 'Ethereum',
        type: 'defi'
      });
    }

    if (ethAmount > 3) {
      const uniAmount = ethAmount * 12.5;
      assets.push({
        symbol: 'UNI',
        name: 'Uniswap',
        quantity: uniAmount,
        currentPrice: 12.8,
        totalValue: uniAmount * 12.8,
        change24h: 1.8,
        chain: 'Ethereum',
        type: 'defi'
      });
    }

    if (ethAmount > 1.5) {
      const maticAmount = ethAmount * 800;
      assets.push({
        symbol: 'MATIC',
        name: 'Polygon',
        quantity: maticAmount,
        currentPrice: 0.85,
        totalValue: maticAmount * 0.85,
        change24h: 3.4,
        chain: 'Polygon',
        type: 'altcoin'
      });
    }

    return assets;
  };

  const assets = generateAssets();
  const totalNetWorth = assets.reduce((sum, asset) => sum + asset.totalValue, 0);

  // Filter assets
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const meetsBalanceFilter = !hideSmallBalances || asset.totalValue >= 10;
    return matchesSearch && meetsBalanceFilter;
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'native': return 'bg-blue-900/30 text-blue-300 border-blue-600';
      case 'stablecoin': return 'bg-green-900/30 text-green-300 border-green-600';
      case 'defi': return 'bg-purple-900/30 text-purple-300 border-purple-600';
      case 'altcoin': return 'bg-orange-900/30 text-orange-300 border-orange-600';
      default: return 'bg-gray-900/30 text-gray-300 border-gray-600';
    }
  };

  if (!isConnected) {
    return (
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            🔎 Asset Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-purple-300">Connect your wallet to track your crypto holdings</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            🔎 Asset Tracking
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setHideSmallBalances(!hideSmallBalances)}
              className="text-purple-300 hover:text-white"
            >
              {hideSmallBalances ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              {hideSmallBalances ? 'Show All' : 'Hide Small'}
            </Button>
          </div>
        </div>
        
        {/* Search and Net Worth */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-purple-400" />
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-purple-800/30 rounded-lg text-white placeholder-purple-400 focus:outline-none focus:border-purple-600"
            />
          </div>
          
          <div className="text-center p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-800/30">
            <p className="text-sm text-purple-300">Total Net Worth</p>
            <p className="text-2xl font-bold text-white">${totalNetWorth.toLocaleString()}</p>
            <p className="text-sm text-green-400">+5.2% (24h)</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {filteredAssets.map((asset, index) => (
            <div key={index} className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{asset.symbol.slice(0, 2)}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{asset.symbol}</span>
                      <Badge variant="outline" className={getTypeColor(asset.type)}>
                        {asset.type}
                      </Badge>
                      <Badge variant="outline" className="border-slate-600 text-slate-300">
                        {asset.chain}
                      </Badge>
                    </div>
                    <div className="text-sm text-purple-300">{asset.name}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-white font-medium">${asset.totalValue.toLocaleString()}</div>
                  <div className="text-sm text-slate-400">
                    {asset.quantity.toFixed(4)} × ${asset.currentPrice.toFixed(2)}
                  </div>
                  <div className={`text-sm flex items-center justify-end ${asset.change24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {asset.change24h > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                    {Math.abs(asset.change24h)}%
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredAssets.length === 0 && (
            <div className="text-center py-8">
              <p className="text-purple-300">No assets found matching your criteria</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetTracking;
