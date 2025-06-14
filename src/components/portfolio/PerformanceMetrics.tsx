
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WalletData } from "../WalletConnector";
import { useBlockchainData } from "../../hooks/useBlockchainData";
import { useEffect, useState } from "react";
import { 
  calculateRealPnLFromWallet, 
  generateHistoricalFromRealData, 
  generateRealPnLBreakdown,
  calculateAPYFromTransactions,
  HistoricalDataPoint,
  PnLBreakdownData
} from "../../utils/portfolioCalculations";
import PerformanceStatsCards from "./PerformanceStatsCards";
import PortfolioPerformanceChart from "./PortfolioPerformanceChart";
import PnLBreakdownChart from "./PnLBreakdownChart";

interface PerformanceMetricsProps {
  isConnected: boolean;
  walletData?: WalletData | null;
}

const PerformanceMetrics = ({ isConnected, walletData }: PerformanceMetricsProps) => {
  const { data, isLoading, fetchBlockchainData } = useBlockchainData();
  const [totalPnL, setTotalPnL] = useState(0);
  const [totalROI, setTotalROI] = useState(0);
  const [apy, setAPY] = useState(0);
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [pnlData, setPnlData] = useState<PnLBreakdownData[]>([]);

  useEffect(() => {
    if (isConnected && walletData?.address) {
      console.log('Fetching real-time data for wallet:', walletData.address);
      fetchBlockchainData(walletData.address, 'balance');
      fetchBlockchainData(walletData.address, 'transactions');
      fetchBlockchainData(walletData.address, 'tokens');
    }
  }, [isConnected, walletData?.address]);

  useEffect(() => {
    if (data.transactions?.transactions && data.balance?.total_value_usd) {
      processWalletData();
    }
  }, [data.transactions, data.balance, data.tokens]);

  const processWalletData = () => {
    const transactions = data.transactions?.transactions || [];
    const currentValue = parseFloat(data.balance?.total_value_usd || '0');
    
    console.log('Processing wallet data:', {
      transactionCount: transactions.length,
      currentValue,
      sampleTransaction: transactions[0]
    });

    if (transactions.length === 0) {
      // If no transactions, show neutral values
      setTotalPnL(0);
      setTotalROI(0);
      setAPY(0);
      setHistoricalData([]);
      setPnlData([]);
      return;
    }

    if (currentValue === 0) {
      // If no current value, show conservative estimates
      setTotalPnL(-1000);
      setTotalROI(-10);
      setAPY(0);
      setHistoricalData([]);
      setPnlData([]);
      return;
    }

    const { totalPnL: pnl, totalROI: roi, totalCostBasis } = calculateRealPnLFromWallet(transactions, currentValue);
    const calculatedAPY = calculateAPYFromTransactions(transactions, roi);
    
    console.log('Calculated metrics:', { pnl, roi, calculatedAPY, totalCostBasis });
    
    setTotalPnL(pnl);
    setTotalROI(roi);
    setAPY(calculatedAPY);

    const historicalPoints = generateHistoricalFromRealData(transactions, currentValue, totalCostBasis);
    setHistoricalData(historicalPoints);

    const pnlBreakdown = generateRealPnLBreakdown(transactions, currentValue, totalCostBasis);
    setPnlData(pnlBreakdown);

    console.log('Updated portfolio metrics from real wallet data');
  };

  if (!isConnected) {
    return (
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            📊 Performance Metrics
          </CardTitle>
          <CardDescription className="text-purple-300">
            Connect your wallet to view real-time performance data from blockchain
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            📊 Performance Metrics
          </CardTitle>
          <CardDescription className="text-purple-300">
            Loading real-time performance data from connected wallet...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const hasTransactions = data.transactions?.transactions?.length > 0;

  return (
    <div className="space-y-6">
      <PerformanceStatsCards 
        totalPnL={totalPnL}
        totalROI={totalROI}
        apy={apy}
        hasTransactions={hasTransactions}
      />

      <PortfolioPerformanceChart 
        historicalData={historicalData}
        hasTransactions={hasTransactions}
      />

      <PnLBreakdownChart 
        pnlData={pnlData}
        hasTransactions={hasTransactions}
      />
    </div>
  );
};

export default PerformanceMetrics;
