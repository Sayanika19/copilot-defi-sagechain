
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { WalletData } from "../WalletConnector";

interface AssetTrackingProps {
  isConnected: boolean;
  walletData?: WalletData | null;
}

const AssetTracking = ({ isConnected, walletData }: AssetTrackingProps) => {
  const [hideBalances, setHideBalances] = useState(false);

  const generateAssets = () => {
    if (!walletData?.balance || !isConnected) return [];
    
    const ethAmount = parseFloat(walletData.balance.replace(' ETH', ''));
    const ethPrice = 2800;
    const portfolioValue = ethAmount * ethPrice;
    
    return [
      {
        symbol: 'ETH',
        name: 'Ethereum',
        balance: ethAmount,
        value: ethAmount * ethPrice,
        price: ethPrice,
        change24h: 4.2,
        chain: 'Ethereum',
        allocation: (ethAmount * ethPrice / portfolioValue) * 100,
        logo: '⟠'
      },
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        balance: portfolioValue > 5000 ? 0.085 : 0,
        value: portfolioValue > 5000 ? 0.085 * 43000 : 0,
        price: 43000,
        change24h: 2.1,
        chain: 'Bitcoin',
        allocation: portfolioValue > 5000 ? 15 : 0,
        logo: '₿'
      },
      {
        symbol: 'USDC',
        name: 'USD Coin',
        balance: portfolioValue > 1000 ? portfolioValue * 0.2 : 0,
        value: portfolioValue > 1000 ? portfolioValue * 0.2 : 0,
        price: 1.00,
        change24h: 0.1,
        chain: 'Polygon',
        allocation: portfolioValue > 1000 ? 20 : 0,
        logo: '💵'
      },
      {
        symbol: 'BNB',
        name: 'BNB',
        balance: portfolioValue > 3000 ? 8.5 : 0,
        value: portfolioValue > 3000 ? 8.5 * 310 : 0,
        price: 310,
        change24h: -1.5,
        chain: 'BNB Chain',
        allocation: portfolioValue > 3000 ? 10 : 0,
        logo: '🔶'
      }
    ].filter(asset => asset.balance > 0);
  };

  const assets = generateAssets();
  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

  const formatValue = (value: number) => {
    if (hideBalances) return '****';
    return `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatBalance = (balance: number, symbol: string) => {
    if (hideBalances) return '****';
    return `${balance.toFixed(4)} ${symbol}`;
  };

  if (!isConnected) {
    return (
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            🔎 Asset Tracking
          </CardTitle>
          <CardDescription className="text-purple-300">
            Connect your wallet to view your crypto holdings
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              🔎 Asset Tracking
            </CardTitle>
            <CardDescription className="text-purple-300">
              Your crypto holdings across multiple chains
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setHideBalances(!hideBalances)}
            className="text-purple-300 hover:text-white"
          >
            {hideBalances ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Total Net Worth */}
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-800/30">
          <div className="text-center">
            <p className="text-sm text-purple-300 mb-1">Total Net Worth</p>
            <p className="text-3xl font-bold text-white">{formatValue(totalValue)}</p>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400 text-sm">+2.8% (24h)</span>
            </div>
          </div>
        </div>

        {/* Assets List */}
        <div className="space-y-4">
          {assets.map((asset, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">{asset.logo}</div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">{asset.symbol}</span>
                    <Badge variant="outline" className="border-purple-600 text-purple-300 text-xs">
                      {asset.chain}
                    </Badge>
                  </div>
                  <div className="text-sm text-purple-300">{asset.name}</div>
                </div>
              </div>
              
              <div className="text-right flex-1 max-w-xs">
                <div className="text-white font-medium">{formatValue(asset.value)}</div>
                <div className="text-sm text-slate-400">{formatBalance(asset.balance, asset.symbol)}</div>
                <div className="text-xs text-slate-500">${asset.price.toLocaleString()}</div>
              </div>
              
              <div className="text-right min-w-[80px]">
                <div className={`flex items-center justify-end ${asset.change24h > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {asset.change24h > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
                  <span className="text-sm">{Math.abs(asset.change24h)}%</span>
                </div>
                <div className="mt-1">
                  <Progress value={asset.allocation} className="w-16 h-1" />
                  <span className="text-xs text-slate-400">{asset.allocation.toFixed(1)}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {assets.length === 0 && (
          <div className="text-center py-8">
            <p className="text-purple-300">No assets found in connected wallet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssetTracking;
