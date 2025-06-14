
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, XAxis, YAxis } from "recharts";
import { HistoricalDataPoint } from "../../utils/portfolioCalculations";

interface PortfolioPerformanceChartProps {
  historicalData: HistoricalDataPoint[];
  hasTransactions: boolean;
}

const PortfolioPerformanceChart = ({ historicalData, hasTransactions }: PortfolioPerformanceChartProps) => {
  const chartConfig = {
    value: {
      label: "Portfolio Value",
      color: "hsl(260, 100%, 80%)",
    },
  };

  return (
    <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white">Portfolio Performance</CardTitle>
        <CardDescription className="text-purple-300">
          Live portfolio value based on connected wallet transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          {historicalData.length > 0 ? (
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
          ) : (
            <div className="flex items-center justify-center h-full text-purple-300">
              {!hasTransactions ? 'No transaction history in connected wallet' : 'Loading wallet performance data...'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PortfolioPerformanceChart;
