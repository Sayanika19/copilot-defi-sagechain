
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, Activity, Zap, Shield } from "lucide-react";

interface DashboardProps {
  isConnected: boolean;
}

const Dashboard = ({ isConnected }: DashboardProps) => {
  const mockData = {
    totalValue: "$24,847.32",
    change24h: "+12.4%",
    activePositions: 8,
    totalRewards: "$1,247.83"
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Dashboard</h2>
        <p className="text-purple-300">Overview of your DeFi portfolio and activities</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Total Portfolio Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{isConnected ? mockData.totalValue : '$0.00'}</div>
            <p className="text-xs text-green-400 flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" />
              {isConnected ? mockData.change24h : '0%'} from yesterday
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Active Positions</CardTitle>
            <Activity className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{isConnected ? mockData.activePositions : 0}</div>
            <p className="text-xs text-blue-400 mt-1">Across 4 protocols</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Total Rewards</CardTitle>
            <Zap className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{isConnected ? mockData.totalRewards : '$0.00'}</div>
            <p className="text-xs text-yellow-400 mt-1">This month</p>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-300">Risk Score</CardTitle>
            <Shield className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">Medium</div>
            <p className="text-xs text-purple-400 mt-1">Well diversified</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Recent Transactions</CardTitle>
            <CardDescription className="text-purple-300">Your latest DeFi activities</CardDescription>
          </CardHeader>
          <CardContent>
            {isConnected ? (
              <div className="space-y-4">
                {[
                  { action: 'Supplied USDC', amount: '$2,500', protocol: 'Aave', time: '2 hours ago', type: 'supply' },
                  { action: 'Claimed rewards', amount: '$47.32', protocol: 'Compound', time: '1 day ago', type: 'reward' },
                  { action: 'Swapped ETH → USDT', amount: '$1,200', protocol: 'Uniswap', time: '2 days ago', type: 'swap' },
                ].map((tx, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-slate-800/30 rounded-lg">
                    <div>
                      <p className="text-white font-medium">{tx.action}</p>
                      <p className="text-sm text-purple-300">{tx.protocol} • {tx.time}</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${
                        tx.type === 'reward' ? 'text-green-400' : 'text-white'
                      }`}>{tx.amount}</p>
                      <Badge variant="outline" className="text-xs border-purple-800/30">
                        {tx.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-purple-300">Connect your wallet to see transactions</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Market Opportunities</CardTitle>
            <CardDescription className="text-purple-300">AI-recommended actions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { 
                  title: 'High Yield Alert', 
                  description: 'USDC lending on Aave shows 8.2% APY', 
                  priority: 'high' 
                },
                { 
                  title: 'Arbitrage Opportunity', 
                  description: 'ETH price difference across DEXs', 
                  priority: 'medium' 
                },
                { 
                  title: 'Governance Proposal', 
                  description: 'Vote on Compound proposal #127', 
                  priority: 'low' 
                },
              ].map((opportunity, index) => (
                <div key={index} className="p-3 bg-slate-800/30 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-white font-medium">{opportunity.title}</p>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            opportunity.priority === 'high' 
                              ? 'border-red-500 text-red-400' 
                              : opportunity.priority === 'medium'
                              ? 'border-yellow-500 text-yellow-400'
                              : 'border-green-500 text-green-400'
                          }`}
                        >
                          {opportunity.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-purple-300 mt-1">{opportunity.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
