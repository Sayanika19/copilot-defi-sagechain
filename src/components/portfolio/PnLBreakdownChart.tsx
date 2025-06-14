
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, Cell } from "recharts";
import { PnLBreakdownData } from "../../utils/portfolioCalculations";

interface PnLBreakdownChartProps {
  pnlData: PnLBreakdownData[];
  hasTransactions: boolean;
}

const PnLBreakdownChart = ({ pnlData, hasTransactions }: PnLBreakdownChartProps) => {
  const chartConfig = {
    pnl: {
      label: "P&L",
      color: "hsl(142, 76%, 36%)",
    },
  };

  return (
    <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white">P&L Breakdown</CardTitle>
        <CardDescription className="text-purple-300">
          Live profit and loss from connected wallet transactions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] w-full">
          {pnlData.length > 0 ? (
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
          ) : (
            <div className="flex items-center justify-center h-full text-purple-300">
              {!hasTransactions ? 'No transaction data in connected wallet' : 'Calculating P&L from wallet data...'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PnLBreakdownChart;
