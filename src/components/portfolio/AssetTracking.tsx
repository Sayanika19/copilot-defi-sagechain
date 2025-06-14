
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { WalletData } from "../WalletConnector";

interface AssetTrackingProps {
  isConnected: boolean;
  walletData?: WalletData | null;
}

const AssetTracking = ({ isConnected, walletData }: AssetTrackingProps) => {
  const [hideBalances, setHideBalances] = useState(false);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [ethAmount, setEthAmount] = useState(0);

  useEffect(() => {
    if (isConnected && walletData?.balance) {
      // Extract ETH amount from balance string
      const amount = parseFloat(walletData.balance.replace(' ETH', ''));
      const ethPrice = 2000;
      const totalValue = amount * ethPrice;
      
      setEthAmount(amount);
      setPortfolioValue(totalValue);
    } else {
      setEthAmount(0);
      setPortfolioValue(0);
    }
  }, [isConnected, walletData?.balance]);

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
              Your crypto holdings from MetaMask wallet
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
            <p className="text-3xl font-bold text-white">{formatValue(portfolioValue)}</p>
            <div className="flex items-center justify-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400 text-sm">Live MetaMask Data</span>
            </div>
          </div>
        </div>

        {/* Assets List */}
        <div className="space-y-4">
          {ethAmount > 0 ? (
            <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">⟠</div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium">ETH</span>
                    <Badge variant="outline" className="border-purple-600 text-purple-300 text-xs">
                      Ethereum
                    </Badge>
                  </div>
                  <div className="text-sm text-purple-300">Ethereum</div>
                </div>
              </div>
              
              <div className="text-right flex-1 max-w-xs">
                <div className="text-white font-medium">{formatValue(portfolioValue)}</div>
                <div className="text-sm text-slate-400">{formatBalance(ethAmount, 'ETH')}</div>
                <div className="text-xs text-slate-500">$2,000</div>
              </div>
              
              <div className="text-right min-w-[80px]">
                <div className="flex items-center justify-end text-green-400">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  <span className="text-sm">Live</span>
                </div>
                <div className="mt-1">
                  <Progress value={100} className="w-16 h-1" />
                  <span className="text-xs text-slate-400">100%</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-purple-300">No ETH balance found in connected MetaMask wallet</p>
              <p className="text-sm text-slate-400 mt-2">Current balance: {walletData?.balance || '0.0000 ETH'}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetTracking;
