
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Users, Activity, Zap, Shield, Brain } from "lucide-react";
import PortfolioPerformanceChart from "./PortfolioPerformanceChart";
import { WalletData } from "./WalletConnector";

interface DashboardProps {
  isConnected: boolean;
  walletData?: WalletData | null;
}

const Dashboard = ({ isConnected, walletData }: DashboardProps) => {
  // Calculate portfolio value based on wallet data
  const getPortfolioValue = () => {
    if (!walletData?.balance || !isConnected) return 12500;
    const ethAmount = parseFloat(walletData.balance.replace(' ETH', ''));
    const ethPrice = 2800; // Mock ETH price
    return Math.round(ethAmount * ethPrice);
  };

  const portfolioValue = getPortfolioValue();
  const portfolioChange = isConnected ? ((portfolioValue - 10000) / 10000 * 100) : 8.5;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-white">
          Welcome to SageChain
          {isConnected && walletData && (
            <span className="block text-lg font-normal text-purple-300 mt-2">
              Connected: {walletData.address.slice(0, 6)}...{walletData.address.slice(-4)}
            </span>
          )}
        </h2>
        <p className="text-purple-300 max-w-2xl mx-auto">
          Your AI-powered multi-chain DeFi companion. Optimize your portfolio, simulate strategies, and make informed decisions across multiple blockchains.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardDescription className="text-purple-300">Portfolio Value</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">
                  ${portfolioValue.toLocaleString()}
                </div>
                <div className={`flex items-center text-sm ${portfolioChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {portfolioChange > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  {Math.abs(portfolioChange).toFixed(1)}%
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardDescription className="text-purple-300">Active Positions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">{isConnected ? '7' : '0'}</div>
                <div className="text-sm text-green-400">+2 this week</div>
              </div>
              <Activity className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardDescription className="text-purple-300">AI Recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">3</div>
                <div className="text-sm text-blue-400">New insights</div>
              </div>
              <Brain className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardDescription className="text-purple-300">Risk Score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-white">Medium</div>
                <div className="text-sm text-yellow-400">Balanced</div>
              </div>
              <Shield className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Performance Chart */}
      <PortfolioPerformanceChart walletData={walletData} isConnected={isConnected} />

      {/* Quick Actions & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-purple-300">
              Common DeFi operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 bg-purple-600/20 border border-purple-600/30 rounded-lg hover:bg-purple-600/30 transition-all">
                <Zap className="w-6 h-6 text-purple-400 mb-2" />
                <div className="text-white font-medium text-sm">Swap Tokens</div>
              </button>
              <button className="p-4 bg-blue-600/20 border border-blue-600/30 rounded-lg hover:bg-blue-600/30 transition-all">
                <TrendingUp className="w-6 h-6 text-blue-400 mb-2" />
                <div className="text-white font-medium text-sm">Add Liquidity</div>
              </button>
              <button className="p-4 bg-green-600/20 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-all">
                <DollarSign className="w-6 h-6 text-green-400 mb-2" />
                <div className="text-white font-medium text-sm">Lend Assets</div>
              </button>
              <button className="p-4 bg-orange-600/20 border border-orange-600/30 rounded-lg hover:bg-orange-600/30 transition-all">
                <Activity className="w-6 h-6 text-orange-400 mb-2" />
                <div className="text-white font-medium text-sm">Stake Tokens</div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-400" />
              AI Insights
            </CardTitle>
            <CardDescription className="text-purple-300">
              Personalized recommendations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-purple-900/20 rounded-lg border border-purple-800/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">Portfolio Rebalancing</span>
                  <Badge className="bg-purple-600/20 text-purple-300">High Priority</Badge>
                </div>
                <p className="text-purple-300 text-xs">
                  Consider diversifying your ETH holdings into stable yield farming opportunities.
                </p>
              </div>
              
              <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-800/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">Gas Optimization</span>
                  <Badge className="bg-blue-600/20 text-blue-300">Medium</Badge>
                </div>
                <p className="text-blue-300 text-xs">
                  Current gas fees are 15% below average. Good time for transactions.
                </p>
              </div>
              
              <div className="p-3 bg-green-900/20 rounded-lg border border-green-800/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">Yield Opportunity</span>
                  <Badge className="bg-green-600/20 text-green-300">Low Risk</Badge>
                </div>
                <p className="text-green-300 text-xs">
                  AAVE lending pool offering 4.2% APY on USDC with minimal risk.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Market Overview */}
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Market Overview</CardTitle>
          <CardDescription className="text-purple-300">
            Cross-chain market sentiment and trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">Bullish</div>
              <div className="text-sm text-purple-300">Overall Sentiment</div>
              <div className="mt-2">
                <Badge className="bg-green-600/20 text-green-300">+12.5%</Badge>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">$2,847</div>
              <div className="text-sm text-purple-300">ETH Price</div>
              <div className="mt-2">
                <Badge className="bg-blue-600/20 text-blue-300">+4.2%</Badge>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">23 Gwei</div>
              <div className="text-sm text-purple-300">Average Gas</div>
              <div className="mt-2">
                <Badge className="bg-purple-600/20 text-purple-300">Normal</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
