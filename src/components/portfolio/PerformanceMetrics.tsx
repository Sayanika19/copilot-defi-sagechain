
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Cell } from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";
import { WalletData } from "../WalletConnector";

interface PerformanceMetricsProps {
  isConnected: boolean;
  walletData?: WalletData | null;
}

const PerformanceMetrics = ({ isConnected, walletData }: PerformanceMetricsProps) => {
  const generateHistoricalData = () => {
    if (!walletData?.balance || !isConnected) return [];
    
    const ethAmount = parseFloat(walletData.balance.replace(' ETH', ''));
    const currentValue = ethAmount * 2800;
    
    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const variance = (Math.random() - 0.5) * 0.1; // ±5% variance
      const value = currentValue * (0.95 + variance + (i / 29) * 0.1); // Slight upward trend
      
      return {
        date: date.toISOString().split('T')[0],
        value: Math.round(value),
        pnl: Math.round(value - currentValue * 0.95),
        roi: ((value - currentValue * 0.95) / (currentValue * 0.95)) * 100
      };
    });
  };

  const generatePnLData = () => {
    if (!isConnected) return [];
    
    return [
      { period: 'Today', pnl: 324.12, percentage: 2.65 },
      { period: '7D', pnl: 1250.84, percentage: 8.92 },
      { period: '30D', pnl: 2840.56, percentage: 18.43 },
      { period: '90D', pnl: 4120.32, percentage: 24.71 },
      { period: '1Y', pnl: 8950.67, percentage: 42.15 }
    ];
  };

  const historicalData = generateHistoricalData();
  const pnlData = generatePnLData();
  const currentValue = isConnected && walletData ? parseFloat(walletData.balance.replace(' ETH', '')) * 2800 : 0;
  const totalPnL = pnlData.length > 0 ? pnlData[pnlData.length - 1].pnl : 0;
  const totalROI = pnlData.length > 0 ? pnlData[pnlData.length - 1].percentage : 0;

  const chartConfig = {
    value: {
      label: "Portfolio Value",
      color: "hsl(260, 100%, 80%)",
    },
    pnl: {
      label: "P&L",
      color: "hsl(142, 76%, 36%)",
    },
  };

  if (!isConnected) {
    return (
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            📊 Performance Metrics
          </CardTitle>
          <CardDescription className="text-purple-300">
            Connect your wallet to view performance data
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Value Chart */}
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            📊 Portfolio Performance
          </CardTitle>
          <CardDescription className="text-purple-300">
            Historical portfolio value over the last 30 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <AreaChart data={historicalData}>
                <defs>
                  <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(260, 100%, 80%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(260, 100%, 80%)" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(260, 20%, 70%)', fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(260, 20%, 70%)', fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(260, 100%, 80%)"
                  strokeWidth={2}
                  fill="url(#valueGradient)"
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value, name) => [`$${Number(value).toLocaleString()}`, 'Portfolio Value']}
                />
              </AreaChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardDescription className="text-purple-300">Total P&L</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-400">
                  +${totalPnL.toLocaleString()}
                </div>
                <div className="flex items-center text-sm text-green-400">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  All Time
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardDescription className="text-purple-300">ROI</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-green-400">
                  +{totalROI.toFixed(2)}%
                </div>
                <div className="flex items-center text-sm text-green-400">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Since Inception
                </div>
              </div>
              <Percent className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
          <CardHeader className="pb-2">
            <CardDescription className="text-purple-300">APY (Estimated)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-blue-400">
                  12.5%
                </div>
                <div className="flex items-center text-sm text-blue-400">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Annual Yield
                </div>
              </div>
              <Percent className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* P&L Breakdown */}
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">P&L Breakdown</CardTitle>
          <CardDescription className="text-purple-300">
            Profit and loss across different time periods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] w-full">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <BarChart data={pnlData}>
                <XAxis 
                  dataKey="period" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(260, 20%, 70%)', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(260, 20%, 70%)', fontSize: 12 }}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(1)}k`}
                />
                <Bar dataKey="pnl" radius={[4, 4, 0, 0]}>
                  {pnlData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.pnl > 0 ? 'hsl(142, 76%, 36%)' : 'hsl(0, 84%, 60%)'} />
                  ))}
                </Bar>
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value, name) => [`$${Number(value).toLocaleString()}`, 'P&L']}
                />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMetrics;
