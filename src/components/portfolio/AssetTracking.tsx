
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { WalletData } from "../WalletConnector";
import { useBlockchainData } from "../../hooks/useBlockchainData";

interface AssetTrackingProps {
  isConnected: boolean;
  walletData?: WalletData | null;
}

const AssetTracking = ({ isConnected, walletData }: AssetTrackingProps) => {
  const [hideBalances, setHideBalances] = useState(false);
  const { data, isLoading, fetchBlockchainData } = useBlockchainData();

  useEffect(() => {
    if (isConnected && walletData?.address) {
      fetchBlockchainData(walletData.address, 'tokens');
      fetchBlockchainData(walletData.address, 'balance');
    }
  }, [isConnected, walletData?.address]);

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

  if (isLoading) {
    return (
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            🔎 Asset Tracking
          </CardTitle>
          <CardDescription className="text-purple-300">
            Loading your crypto holdings...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const assets = data.tokens?.tokens || [];
  const totalValue = data.balance?.total_value_usd ? parseFloat(data.balance.total_value_usd) : 0;

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
              <span className="text-green-400 text-sm">Live Data</span>
            </div>
          </div>
        </div>

        {/* Assets List */}
        <div className="space-y-4">
          {assets.map((asset: any, index: number) => {
            const value = parseFloat(asset.value_usd || '0');
            const balance = parseFloat(asset.balance || '0');
            const price = parseFloat(asset.price_usd || '0');
            const allocation = totalValue > 0 ? (value / totalValue) * 100 : 0;

            return (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl">
                    {asset.symbol === 'ETH' ? '⟠' : 
                     asset.symbol === 'BTC' ? '₿' : 
                     asset.symbol === 'USDC' ? '💵' : 
                     asset.symbol === 'BNB' ? '🔶' : '🪙'}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{asset.symbol}</span>
                      <Badge variant="outline" className="border-purple-600 text-purple-300 text-xs">
                        Ethereum
                      </Badge>
                    </div>
                    <div className="text-sm text-purple-300">{asset.name}</div>
                  </div>
                </div>
                
                <div className="text-right flex-1 max-w-xs">
                  <div className="text-white font-medium">{formatValue(value)}</div>
                  <div className="text-sm text-slate-400">{formatBalance(balance, asset.symbol)}</div>
                  <div className="text-xs text-slate-500">${price.toLocaleString()}</div>
                </div>
                
                <div className="text-right min-w-[80px]">
                  <div className="flex items-center justify-end text-green-400">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    <span className="text-sm">Live</span>
                  </div>
                  <div className="mt-1">
                    <Progress value={allocation} className="w-16 h-1" />
                    <span className="text-xs text-slate-400">{allocation.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {assets.length === 0 && !isLoading && (
          <div className="text-center py-8">
            <p className="text-purple-300">No assets found in connected wallet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssetTracking;
