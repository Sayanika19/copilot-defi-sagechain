
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Bar, BarChart } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useMemo } from "react";
import { WalletData } from "../WalletConnector";

interface PerformanceMetricsProps {
  walletData?: WalletData | null;
  isConnected: boolean;
}

const chartConfig = {
  value: {
    label: "Portfolio Value",
    color: "hsl(260, 100%, 80%)",
  },
  pnl: {
    label: "P&L",
    color: "hsl(120, 100%, 70%)",
  },
};

const PerformanceMetrics = ({ walletData, isConnected }: PerformanceMetricsProps) => {
  // Generate performance data
  const performanceData = useMemo(() => {
    const baseData = Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      return {
        date: date.toISOString().split('T')[0],
        displayDate: date.toLocaleDateString(),
      };
    });

    if (!isConnected || !walletData?.balance) {
      return baseData.map((item, index) => ({
        ...item,
        value: 10000 + (index * 150) + Math.random() * 500 - 250,
        pnl: (index * 15) + Math.random() * 100 - 50,
      }));
    }

    const ethAmount = parseFloat(walletData.balance.replace(' ETH', ''));
    const currentValue = ethAmount * 2800;
    
    return baseData.map((item, index) => {
      const isToday = index === baseData.length - 1;
      if (isToday) {
        return { 
          ...item, 
          value: Math.round(currentValue),
          pnl: Math.round(currentValue * 0.15)
        };
      }
      
      const daysSinceStart = index;
      const totalDays = baseData.length - 1;
      const progressRatio = daysSinceStart / totalDays;
      
      const startValue = currentValue * 0.75;
      const valueIncrease = (currentValue - startValue) * progressRatio;
      const volatility = currentValue * 0.03 * (Math.random() - 0.5);
      
      const value = Math.round(startValue + valueIncrease + volatility);
      const pnl = Math.round((value - startValue) * 0.8);
      
      return { ...item, value, pnl };
    });
  }, [walletData, isConnected]);

  const currentValue = performanceData[performanceData.length - 1]?.value || 0;
  const startValue = performanceData[0]?.value || 0;
  const totalPnL = currentValue - startValue;
  const totalReturn = startValue > 0 ? ((currentValue - startValue) / startValue) * 100 : 0;
  
  // Calculate APY (annualized)
  const daysTracked = 30;
  const dailyReturn = totalReturn / daysTracked;
  const apy = ((1 + dailyReturn / 100) ** 365 - 1) * 100;

  if (!isConnected) {
    return (
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            📊 Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-purple-300">Connect your wallet to view performance metrics</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          📊 Performance Metrics
        </CardTitle>
        
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="p-3 bg-slate-800/30 rounded-lg">
            <p className="text-xs text-purple-300">Total P&L</p>
            <div className={`text-lg font-bold flex items-center gap-1 ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalPnL >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              ${Math.abs(totalPnL).toLocaleString()}
            </div>
          </div>
          
          <div className="p-3 bg-slate-800/30 rounded-lg">
            <p className="text-xs text-purple-300">Total Return</p>
            <div className={`text-lg font-bold ${totalReturn >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalReturn >= 0 ? '+' : ''}{totalReturn.toFixed(2)}%
            </div>
          </div>
          
          <div className="p-3 bg-slate-800/30 rounded-lg">
            <p className="text-xs text-purple-300">Est. APY</p>
            <div className={`text-lg font-bold ${apy >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {apy >= 0 ? '+' : ''}{apy.toFixed(1)}%
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="portfolio" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
            <TabsTrigger value="portfolio" className="text-purple-300 data-[state=active]:text-white">Portfolio Value</TabsTrigger>
            <TabsTrigger value="pnl" className="text-purple-300 data-[state=active]:text-white">P&L Chart</TabsTrigger>
          </TabsList>
          
          <TabsContent value="portfolio" className="mt-6">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(260, 100%, 80%)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(260, 100%, 80%)" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="displayDate" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(260, 100%, 80%)"
                  strokeWidth={2}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ChartContainer>
          </TabsContent>
          
          <TabsContent value="pnl" className="mt-6">
            <ChartContainer config={chartConfig} className="h-[300px] w-full">
              <BarChart data={performanceData}>
                <XAxis 
                  dataKey="displayDate" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'P&L']}
                />
                <Bar
                  dataKey="pnl"
                  fill={(entry: any) => entry.pnl >= 0 ? 'hsl(120, 100%, 70%)' : 'hsl(0, 100%, 70%)'}
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
