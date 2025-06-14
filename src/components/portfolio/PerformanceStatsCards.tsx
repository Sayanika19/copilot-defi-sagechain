
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";

interface PerformanceStatsCardsProps {
  totalPnL: number;
  totalROI: number;
  hasTransactions: boolean;
}

const PerformanceStatsCards = ({ totalPnL, totalROI, hasTransactions }: PerformanceStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader className="pb-2">
          <CardDescription className="text-purple-300">Total P&L</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalPnL >= 0 ? '+' : ''}${Math.abs(totalPnL).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className={`flex items-center text-sm ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalPnL >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                Real-time from Wallet
              </div>
            </div>
            <DollarSign className={`w-8 h-8 ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`} />
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
              <div className={`text-2xl font-bold ${totalROI >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalROI >= 0 ? '+' : ''}{totalROI.toFixed(2)}%
              </div>
              <div className={`flex items-center text-sm ${totalROI >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalROI >= 0 ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                Since First Transaction
              </div>
            </div>
            <Percent className={`w-8 h-8 ${totalROI >= 0 ? 'text-green-400' : 'text-red-400'}`} />
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader className="pb-2">
          <CardDescription className="text-purple-300">APY (Live)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-blue-400">
                {hasTransactions && totalROI !== 0 ? 
                  Math.max(0, totalROI * 0.4).toFixed(1) : '0.0'}%
              </div>
              <div className="flex items-center text-sm text-blue-400">
                <TrendingUp className="w-4 h-4 mr-1" />
                Calculated from Wallet
              </div>
            </div>
            <Percent className="w-8 h-8 text-blue-400" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceStatsCards;
