
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const chartConfig = {
  value: {
    label: "Portfolio Value",
    color: "hsl(260, 100%, 80%)",
  },
};

const generateMockData = () => {
  const data = [];
  const startDate = new Date('2025-05-17');
  const endDate = new Date('2025-06-14');
  
  let currentValue = 10000;
  
  for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
    // Add some volatility to the data
    const change = (Math.random() - 0.5) * 1000;
    currentValue = Math.max(8000, Math.min(16000, currentValue + change));
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(currentValue),
      displayDate: date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })
    });
  }
  
  return data;
};

const PortfolioPerformanceChart = () => {
  const data = generateMockData();

  return (
    <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white">Portfolio Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
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
