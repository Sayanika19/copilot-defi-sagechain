
import { WalletData } from "./WalletConnector";
import AssetTracking from "./portfolio/AssetTracking";
import PerformanceMetrics from "./portfolio/PerformanceMetrics";
import TransactionHistory from "./portfolio/TransactionHistory";
import InvestmentPositions from "./portfolio/InvestmentPositions";
import AssetAllocationChart from "./AssetAllocationChart";

interface PortfolioOverviewProps {
  isConnected: boolean;
  walletData?: WalletData | null;
}

const PortfolioOverview = ({ isConnected, walletData }: PortfolioOverviewProps) => {
  return (
    <div className="space-y-6">
      {/* Asset Tracking Section */}
      <AssetTracking walletData={walletData} isConnected={isConnected} />
      
      {/* Performance Metrics Section */}
      <PerformanceMetrics walletData={walletData} isConnected={isConnected} />
      
      {/* Asset Allocation Chart */}
      <AssetAllocationChart walletData={walletData} isConnected={isConnected} />
      
      {/* Investment Positions Section */}
      <InvestmentPositions walletData={walletData} isConnected={isConnected} />
      
      {/* Transaction History Section */}
      <TransactionHistory walletData={walletData} isConnected={isConnected} />
    </div>
  );
};

export default PortfolioOverview;
