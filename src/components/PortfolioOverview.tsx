
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Wallet, DollarSign, PieChart, AlertTriangle } from "lucide-react";
import { WalletData } from "./WalletConnector";
import AssetAllocationChart from "./AssetAllocationChart";
import AssetTracking from "./portfolio/AssetTracking";
import PerformanceMetrics from "./portfolio/PerformanceMetrics";
import TransactionHistory from "./portfolio/TransactionHistory";
import InvestmentPositions from "./portfolio/InvestmentPositions";

interface PortfolioOverviewProps {
  isConnected: boolean;
  walletData?: WalletData | null;
}

const PortfolioOverview = ({ isConnected, walletData }: PortfolioOverviewProps) => {
  // Calculate values based on real wallet data
  const getPortfolioValue = () => {
    if (!walletData?.balance || !isConnected) return 0;
    const ethAmount = parseFloat(walletData.balance.replace(' ETH', ''));
    const ethPrice = 2800; // Mock ETH price
    return ethAmount * ethPrice;
  };

  const portfolioData = {
    totalValue: getPortfolioValue(),
    change24h: isConnected ? 324.12 : 0,
    changePercent: isConnected ? 2.65 : 0,
  };

  const getActiveChains = () => {
    if (!isConnected) return 0;
    // Simple calculation based on portfolio size
    const portfolioValue = getPortfolioValue();
    if (portfolioValue > 5000) return 3;
    if (portfolioValue > 1000) return 2;
    return 1;
  };

  const getActivePositions = () => {
    if (!isConnected) return 0;
    const portfolioValue = getPortfolioValue();
    if (portfolioValue > 5000) return 4;
    if (portfolioValue > 3000) return 3;
    if (portfolioValue > 1000) return 2;
    return 1;
  };

  if (!isConnected) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
          <CardHeader className="text-center py-12">
            <Wallet className="w-16 h-16 text-purple-400 mx-auto mb-4" />
            <CardTitle className="text-white text-xl">Connect Your Wallet</CardTitle>
            <CardDescription className="text-purple-300">
              Connect your wallet to view your multi-chain portfolio and start using AI-powered DeFi tools
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Info Header */}
      {walletData && (
        <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-300">Connected Wallet</p>
                <p className="text-white font-mono">{walletData.address}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-purple-300">Native Balance</p>
                <p className="text-white font-medium">{walletData.balance}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardDescription className="text-purple-300">Total Portfolio Value</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">
                  ${portfolioData.totalValue.toLocaleString()}
                </div>
                <div className={`flex items-center text-sm ${portfolioData.changePercent > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {portfolioData.changePercent > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  ${Math.abs(portfolioData.change24h).toFixed(2)} ({Math.abs(portfolioData.changePercent)}%)
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardDescription className="text-purple-300">Active Chains</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{getActiveChains()}</div>
                <div className="text-sm text-purple-300">Networks Connected</div>
              </div>
              <div className="flex flex-col space-y-1">
                <Badge variant="secondary" className="bg-purple-900/30 text-purple-300 text-xs">Ethereum</Badge>
                {getActiveChains() > 1 && (
                  <Badge variant="secondary" className="bg-blue-900/30 text-blue-300 text-xs">Polygon</Badge>
                )}
                {getActiveChains() > 2 && (
                  <Badge variant="secondary" className="bg-yellow-900/30 text-yellow-300 text-xs">BNB Chain</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardDescription className="text-purple-300">DeFi Positions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{getActivePositions()}</div>
                <div className="text-sm text-purple-300">Active Positions</div>
              </div>
              <PieChart className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Asset Tracking */}
      <AssetTracking isConnected={isConnected} walletData={walletData} />

      {/* Asset Allocation Chart */}
      <AssetAllocationChart walletData={walletData} isConnected={isConnected} />

      {/* Performance Metrics */}
      <PerformanceMetrics isConnected={isConnected} walletData={walletData} />

      {/* Transaction History */}
      <TransactionHistory isConnected={isConnected} walletData={walletData} />

      {/* Investment Positions */}
      <InvestmentPositions isConnected={isConnected} walletData={walletData} />

      {/* Risk Alerts */}
      <Card className="bg-black/40 border-orange-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-400" />
            Risk Alerts
          </CardTitle>
          <CardDescription className="text-orange-300">Monitor your portfolio risks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-orange-900/20 rounded-lg border border-orange-800/30">
              <div className="flex items-center space-x-3">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                <div>
                  <div className="text-white text-sm font-medium">High Gas Fees on Ethereum</div>
                  <div className="text-orange-300 text-xs">Current: 45 gwei • Consider L2 alternatives</div>
                </div>
              </div>
              <Badge variant="outline" className="border-orange-600 text-orange-300">
                Medium
              </Badge>
            </div>
            
            {portfolioData.totalValue > 8000 && (
              <div className="flex items-center justify-between p-3 bg-blue-900/20 rounded-lg border border-blue-800/30">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="text-white text-sm font-medium">Rebalancing Opportunity</div>
                    <div className="text-blue-300 text-xs">ETH allocation above target • Consider taking profits</div>
                  </div>
                </div>
                <Badge variant="outline" className="border-blue-600 text-blue-300">
                  Info
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioOverview;
