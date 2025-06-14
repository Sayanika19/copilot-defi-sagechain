
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, Wallet, DollarSign, PieChart, AlertTriangle } from "lucide-react";
import { WalletData } from "./WalletConnector";
import AssetAllocationChart from "./AssetAllocationChart";

interface PortfolioOverviewProps {
  isConnected: boolean;
  walletData?: WalletData | null;
}

const PortfolioOverview = ({ isConnected, walletData }: PortfolioOverviewProps) => {
  // Calculate values based on real wallet data
  const getPortfolioValue = () => {
    if (!walletData?.balance) return 0;
    const ethAmount = parseFloat(walletData.balance.replace(' ETH', ''));
    const ethPrice = 2800; // Mock ETH price
    return ethAmount * ethPrice;
  };

  const mockPortfolio = {
    totalValue: getPortfolioValue(),
    change24h: 324.12,
    changePercent: 2.65,
    assets: [
      { 
        symbol: 'ETH', 
        name: 'Ethereum', 
        balance: walletData ? parseFloat(walletData.balance.replace(' ETH', '')) : 0, 
        value: getPortfolioValue() * 0.65, 
        change: 4.2, 
        chain: 'Ethereum' 
      },
      { symbol: 'USDC', name: 'USD Coin', balance: 2500, value: 2500.00, change: 0.1, chain: 'Polygon' },
      { symbol: 'AAVE', name: 'Aave', balance: 12.5, value: 1234.56, change: -2.1, chain: 'Ethereum' },
      { symbol: 'UNI', name: 'Uniswap', balance: 45.2, value: 578.15, change: 1.8, chain: 'Arbitrum' },
    ],
    defiPositions: [
      { protocol: 'Aave V3', type: 'Lending', asset: 'USDC', amount: 1500, apy: 4.2, chain: 'Polygon' },
      { protocol: 'Uniswap V3', type: 'LP', asset: 'ETH/USDC', amount: 2340, apy: 12.5, chain: 'Ethereum' },
    ]
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
                  ${mockPortfolio.totalValue.toLocaleString()}
                </div>
                <div className={`flex items-center text-sm ${mockPortfolio.changePercent > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {mockPortfolio.changePercent > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                  ${Math.abs(mockPortfolio.change24h).toFixed(2)} ({Math.abs(mockPortfolio.changePercent)}%)
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
                <div className="text-2xl font-bold text-white">4</div>
                <div className="text-sm text-purple-300">Networks Connected</div>
              </div>
              <div className="flex flex-col space-y-1">
                <Badge variant="secondary" className="bg-purple-900/30 text-purple-300 text-xs">Ethereum</Badge>
                <Badge variant="secondary" className="bg-blue-900/30 text-blue-300 text-xs">Polygon</Badge>
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
                <div className="text-2xl font-bold text-white">{mockPortfolio.defiPositions.length}</div>
                <div className="text-sm text-purple-300">Active Positions</div>
              </div>
              <PieChart className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Asset Allocation Chart */}
      <AssetAllocationChart />

      {/* Assets Table */}
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Assets</CardTitle>
          <CardDescription className="text-purple-300">Your cross-chain token holdings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockPortfolio.assets.map((asset, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">{asset.symbol.slice(0, 2)}</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">{asset.symbol}</div>
                    <div className="text-sm text-purple-300">{asset.name}</div>
                  </div>
                  <Badge variant="outline" className="border-purple-600 text-purple-300">
                    {asset.chain}
                  </Badge>
                </div>
                
                <div className="text-right">
                  <div className="text-white font-medium">${asset.value.toLocaleString()}</div>
                  <div className="text-sm text-slate-400">{asset.balance} {asset.symbol}</div>
                </div>
                
                <div className={`text-right ${asset.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  <div className="flex items-center">
                    {asset.change > 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                    {Math.abs(asset.change)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* DeFi Positions */}
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">DeFi Positions</CardTitle>
          <CardDescription className="text-purple-300">Your active lending and liquidity positions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockPortfolio.defiPositions.map((position, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xs">{position.protocol.slice(0, 2)}</span>
                  </div>
                  <div>
                    <div className="text-white font-medium">{position.protocol}</div>
                    <div className="text-sm text-purple-300">{position.type} • {position.asset}</div>
                  </div>
                  <Badge variant="outline" className="border-blue-600 text-blue-300">
                    {position.chain}
                  </Badge>
                </div>
                
                <div className="text-right">
                  <div className="text-white font-medium">${position.amount.toLocaleString()}</div>
                  <div className="text-sm text-green-400">{position.apy}% APY</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PortfolioOverview;
