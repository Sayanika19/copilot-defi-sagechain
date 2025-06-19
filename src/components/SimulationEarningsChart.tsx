
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface SimulationEarningsChartProps {
  initialAmount: number;
  strategy: string;
  apy: number;
}

const SimulationEarningsChart = ({ initialAmount, strategy, apy }: SimulationEarningsChartProps) => {
  // Generate 12 months of projected earnings data
  const generateProjectionData = () => {
    const data = [];
    let currentAmount = initialAmount;
    
    for (let month = 0; month <= 12; month++) {
      // Compound interest calculation with monthly compounding
      const monthlyRate = apy / 100 / 12;
      currentAmount = month === 0 ? initialAmount : currentAmount * (1 + monthlyRate);
      
      // Add some realistic volatility
      const volatility = Math.random() * 0.1 - 0.05; // ±5% volatility
      const volatileAmount = currentAmount * (1 + volatility);
      
      data.push({
        month: month === 0 ? 'Start' : `Month ${month}`,
        amount: parseFloat(volatileAmount.toFixed(2)),
        earnings: parseFloat((volatileAmount - initialAmount).toFixed(2)),
        monthNumber: month
      });
    }
    
    return data;
  };

  const projectionData = generateProjectionData();
  const finalAmount = projectionData[projectionData.length - 1].amount;
  const totalEarnings = finalAmount - initialAmount;
  const totalReturn = ((finalAmount - initialAmount) / initialAmount) * 100;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  return (
    <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-400" />
          12-Month Projection: {strategy}
        </CardTitle>
        <CardDescription className="text-purple-300">
          Projected earnings based on {apy}% APY with realistic market volatility
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-slate-800/30 rounded-lg border border-purple-800/20">
            <div className="text-center">
              <p className="text-sm text-purple-300">Initial Investment</p>
              <p className="text-xl font-bold text-white">{formatCurrency(initialAmount)}</p>
            </div>
          </div>
          <div className="p-4 bg-slate-800/30 rounded-lg border border-green-800/20">
            <div className="text-center">
              <p className="text-sm text-green-300">Projected Value</p>
              <p className="text-xl font-bold text-green-400">{formatCurrency(finalAmount)}</p>
            </div>
          </div>
          <div className="p-4 bg-slate-800/30 rounded-lg border border-blue-800/20">
            <div className="text-center">
              <p className="text-sm text-blue-300">Total Return</p>
              <p className="text-xl font-bold text-blue-400">+{totalReturn.toFixed(2)}%</p>
            </div>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="month" 
                stroke="#9CA3AF"
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                stroke="#9CA3AF"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name === 'amount' ? 'Portfolio Value' : 'Total Earnings'
                ]}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: '#10B981' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 p-4 bg-purple-900/20 rounded-lg border border-purple-800/30">
          <div className="flex justify-between items-center text-sm">
            <span className="text-purple-300">Projected Total Earnings:</span>
            <span className="text-green-400 font-bold text-lg">{formatCurrency(totalEarnings)}</span>
          </div>
          <p className="text-xs text-purple-300 mt-2">
            * Projections are based on historical data and current market conditions. 
            Actual results may vary due to market volatility and other factors.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulationEarningsChart;
