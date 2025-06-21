import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Users, Activity, Zap, Shield, Brain, ArrowUpDown } from "lucide-react";
import PortfolioPerformanceChart from "./PortfolioPerformanceChart";
import { WalletData } from "./WalletConnector";
import { useNavigate } from "react-router-dom";

interface DashboardProps {
  isConnected: boolean;
  walletData?: WalletData | null;
}

const Dashboard = ({ isConnected, walletData }: DashboardProps) => {
  const navigate = useNavigate();

  // Calculate portfolio value based on actual MetaMask wallet balance
  const getPortfolioValue = () => {
    if (!walletData?.balance || !isConnected) return 0;
    const ethAmount = parseFloat(walletData.balance.replace(' ETH', ''));
    const ethPrice = 2000; // Current ETH price
    return Math.round(ethAmount * ethPrice);
  };

  // Calculate active positions based on wallet value
  const getActivePositions = () => {
    if (!walletData?.balance || !isConnected) return 0;
    const ethAmount = parseFloat(walletData.balance.replace(' ETH', ''));
    
    // Return 1 if wallet has ETH, 0 if empty
    return ethAmount > 0 ? 1 : 0;
  };

  // Calculate risk score based on wallet value
  const getRiskScore = () => {
    if (!walletData?.balance || !isConnected) return { score: 'Unknown', color: 'text-gray-400' };
    const ethAmount = parseFloat(walletData.balance.replace(' ETH', ''));
    const portfolioValue = getPortfolioValue();
    
    if (portfolioValue === 0) {
      return { score: 'No Risk', color: 'text-blue-400' };
    } else if (portfolioValue > 10000) {
      return { score: 'Low', color: 'text-green-400' };
    } else if (portfolioValue > 1000) {
      return { score: 'Medium', color: 'text-yellow-400' };
    } else {
      return { score: 'High', color: 'text-red-400' };
    }
  };

  const portfolioValue = getPortfolioValue();
  const portfolioChange = portfolioValue > 0 ? 0.1 : 0; // Small positive change for non-zero portfolios
  const activePositions = getActivePositions();
  const riskScore = getRiskScore();

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'swap':
        navigate('/?tab=trading');
        break;
      case 'liquidity':
        navigate('/?tab=lending');
        break;
      case 'lend':
        navigate('/?tab=lending');
        break;
      case 'stake':
        navigate('/?tab=lending');
        break;
      default:
        break;
    }
  };

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
                <div className={`flex items-center text-sm ${portfolioChange > 0 ? 'text-green-400' : portfolioValue === 0 ? 'text-gray-400' : 'text-red-400'}`}>
                  {portfolioChange > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : portfolioValue === 0 ? null : <TrendingDown className="w-4 h-4 mr-1" />}
                  {portfolioValue === 0 ? 'Empty wallet' : `${Math.abs(portfolioChange).toFixed(1)}%`}
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
                <div className="text-2xl font-bold text-white">{activePositions}</div>
                <div className="text-sm text-purple-300">
                  {isConnected ? 'From MetaMask' : 'Connect wallet'}
                </div>
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
                <div className={`text-2xl font-bold ${riskScore.color}`}>{riskScore.score}</div>
                <div className="text-sm text-purple-300">
                  {isConnected ? 'Live from wallet' : 'Connect wallet'}
                </div>
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
              <button 
                onClick={() => handleQuickAction('swap')}
                className="p-4 bg-purple-600/20 border border-purple-600/30 rounded-lg hover:bg-purple-600/30 transition-all"
              >
                <ArrowUpDown className="w-6 h-6 text-purple-400 mb-2" />
                <div className="text-white font-medium text-sm">Swap Tokens</div>
              </button>
              <button 
                onClick={() => handleQuickAction('liquidity')}
                className="p-4 bg-blue-600/20 border border-blue-600/30 rounded-lg hover:bg-blue-600/30 transition-all"
              >
                <TrendingUp className="w-6 h-6 text-blue-400 mb-2" />
                <div className="text-white font-medium text-sm">Add Liquidity</div>
              </button>
              <button 
                onClick={() => handleQuickAction('lend')}
                className="p-4 bg-green-600/20 border border-green-600/30 rounded-lg hover:bg-green-600/30 transition-all"
              >
                <DollarSign className="w-6 h-6 text-green-400 mb-2" />
                <div className="text-white font-medium text-sm">Lend Assets</div>
              </button>
              <button 
                onClick={() => handleQuickAction('stake')}
                className="p-4 bg-orange-600/20 border border-orange-600/30 rounded-lg hover:bg-orange-600/30 transition-all"
              >
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
              {portfolioValue === 0 ? (
                <div className="p-3 bg-blue-900/20 rounded-lg border border-blue-800/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm font-medium">Fund Your Wallet</span>
                    <Badge className="bg-blue-600/20 text-blue-300">High Priority</Badge>
                  </div>
                  <p className="text-blue-300 text-xs">
                    Add ETH to your MetaMask wallet to start exploring DeFi opportunities.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-purple-900/20 rounded-lg border border-purple-800/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm font-medium">Portfolio Diversification</span>
                    <Badge className="bg-purple-600/20 text-purple-300">Medium Priority</Badge>
                  </div>
                  <p className="text-purple-300 text-xs">
                    Consider diversifying your ETH holdings into stable yield farming opportunities.
                  </p>
                </div>
              )}
              
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
              <div className="text-2xl font-bold text-blue-400">$2,000</div>
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
