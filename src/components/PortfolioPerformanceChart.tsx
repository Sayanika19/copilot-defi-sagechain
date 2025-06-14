
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

const chartConfig = {
  value: {
    label: "Portfolio Value",
    color: "hsl(260, 100%, 80%)",
  },
};

// Static data for portfolio performance
const staticPortfolioData = [
  { date: '2025-05-17', value: 10000, displayDate: '5/17/2025' },
  { date: '2025-05-18', value: 10250, displayDate: '5/18/2025' },
  { date: '2025-05-19', value: 10150, displayDate: '5/19/2025' },
  { date: '2025-05-20', value: 10400, displayDate: '5/20/2025' },
  { date: '2025-05-21', value: 10600, displayDate: '5/21/2025' },
  { date: '2025-05-22', value: 10350, displayDate: '5/22/2025' },
  { date: '2025-05-23', value: 10800, displayDate: '5/23/2025' },
  { date: '2025-05-24', value: 11200, displayDate: '5/24/2025' },
  { date: '2025-05-25', value: 10950, displayDate: '5/25/2025' },
  { date: '2025-05-26', value: 11400, displayDate: '5/26/2025' },
  { date: '2025-05-27', value: 11650, displayDate: '5/27/2025' },
  { date: '2025-05-28', value: 11300, displayDate: '5/28/2025' },
  { date: '2025-05-29', value: 11800, displayDate: '5/29/2025' },
  { date: '2025-05-30', value: 12100, displayDate: '5/30/2025' },
  { date: '2025-05-31', value: 11850, displayDate: '5/31/2025' },
  { date: '2025-06-01', value: 12300, displayDate: '6/1/2025' },
  { date: '2025-06-02', value: 12550, displayDate: '6/2/2025' },
  { date: '2025-06-03', value: 12200, displayDate: '6/3/2025' },
  { date: '2025-06-04', value: 12700, displayDate: '6/4/2025' },
  { date: '2025-06-05', value: 12950, displayDate: '6/5/2025' },
  { date: '2025-06-06', value: 12600, displayDate: '6/6/2025' },
  { date: '2025-06-07', value: 13100, displayDate: '6/7/2025' },
  { date: '2025-06-08', value: 13350, displayDate: '6/8/2025' },
  { date: '2025-06-09', value: 13000, displayDate: '6/9/2025' },
  { date: '2025-06-10', value: 13500, displayDate: '6/10/2025' },
  { date: '2025-06-11', value: 13750, displayDate: '6/11/2025' },
  { date: '2025-06-12', value: 13400, displayDate: '6/12/2025' },
  { date: '2025-06-13', value: 13900, displayDate: '6/13/2025' },
  { date: '2025-06-14', value: 14200, displayDate: '6/14/2025' },
];

const PortfolioPerformanceChart = () => {
  return (
    <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white">Portfolio Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart data={staticPortfolioData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
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
