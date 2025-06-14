
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { useMemo } from "react";

const chartConfig = {
  value: {
    label: "Portfolio Value",
    color: "hsl(260, 100%, 80%)",
  },
};

interface PortfolioPerformanceChartProps {
  walletData?: {
    address: string;
    balance: string;
    walletType: string;
  } | null;
  isConnected?: boolean;
}

const PortfolioPerformanceChart = ({ walletData, isConnected }: PortfolioPerformanceChartProps) => {
  // Generate realistic portfolio data based on wallet balance
  const portfolioData = useMemo(() => {
    const baseData = [
      { date: '2025-05-17', displayDate: '5/17/2025' },
      { date: '2025-05-18', displayDate: '5/18/2025' },
      { date: '2025-05-19', displayDate: '5/19/2025' },
      { date: '2025-05-20', displayDate: '5/20/2025' },
      { date: '2025-05-21', displayDate: '5/21/2025' },
      { date: '2025-05-22', displayDate: '5/22/2025' },
      { date: '2025-05-23', displayDate: '5/23/2025' },
      { date: '2025-05-24', displayDate: '5/24/2025' },
      { date: '2025-05-25', displayDate: '5/25/2025' },
      { date: '2025-05-26', displayDate: '5/26/2025' },
      { date: '2025-05-27', displayDate: '5/27/2025' },
      { date: '2025-05-28', displayDate: '5/28/2025' },
      { date: '2025-05-29', displayDate: '5/29/2025' },
      { date: '2025-05-30', displayDate: '5/30/2025' },
      { date: '2025-05-31', displayDate: '5/31/2025' },
      { date: '2025-06-01', displayDate: '6/1/2025' },
      { date: '2025-06-02', displayDate: '6/2/2025' },
      { date: '2025-06-03', displayDate: '6/3/2025' },
      { date: '2025-06-04', displayDate: '6/4/2025' },
      { date: '2025-06-05', displayDate: '6/5/2025' },
      { date: '2025-06-06', displayDate: '6/6/2025' },
      { date: '2025-06-07', displayDate: '6/7/2025' },
      { date: '2025-06-08', displayDate: '6/8/2025' },
      { date: '2025-06-09', displayDate: '6/9/2025' },
      { date: '2025-06-10', displayDate: '6/10/2025' },
      { date: '2025-06-11', displayDate: '6/11/2025' },
      { date: '2025-06-12', displayDate: '6/12/2025' },
      { date: '2025-06-13', displayDate: '6/13/2025' },
      { date: '2025-06-14', displayDate: '6/14/2025' },
    ];

    if (!isConnected || !walletData?.balance) {
      // Return static demo data when not connected
      return baseData.map((item, index) => ({
        ...item,
        value: 10000 + (index * 150) + Math.random() * 500 - 250
      }));
    }

    // Calculate current portfolio value based on wallet balance
    const ethAmount = parseFloat(walletData.balance.replace(' ETH', ''));
    const ethPrice = 2800; // Mock ETH price
    const currentValue = ethAmount * ethPrice;
    
    // Generate historical data based on current value
    return baseData.map((item, index) => {
      const isToday = index === baseData.length - 1;
      if (isToday) {
        return { ...item, value: Math.round(currentValue) };
      }
      
      // Generate realistic historical values leading up to current value
      const daysSinceStart = index;
      const totalDays = baseData.length - 1;
      const progressRatio = daysSinceStart / totalDays;
      
      // Start from 70-85% of current value and trend upward with some volatility
      const startValue = currentValue * (0.70 + Math.random() * 0.15);
      const valueIncrease = (currentValue - startValue) * progressRatio;
      const volatility = currentValue * 0.05 * (Math.random() - 0.5); // ±5% volatility
      
      return {
        ...item,
        value: Math.round(startValue + valueIncrease + volatility)
      };
    });
  }, [walletData, isConnected]);

  return (
    <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white">
          Portfolio Performance
          {isConnected && walletData && (
            <span className="text-sm font-normal text-purple-300 ml-2">
              (Connected: {walletData.walletType})
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={portfolioData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
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
              domain={['dataMin - 1000', 'dataMax + 1000']}
            />
            <ChartTooltip 
              content={<ChartTooltipContent />}
              labelFormatter={(value) => `Date: ${value}`}
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
      </CardContent>
    </Card>
  );
};

export default PortfolioPerformanceChart;
