
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft, Coins, Droplets, ExternalLink } from "lucide-react";
import { WalletData } from "../WalletConnector";
import { useBlockchainData } from "../../hooks/useBlockchainData";
import { useEffect } from "react";

interface TransactionHistoryProps {
  isConnected: boolean;
  walletData?: WalletData | null;
}

const TransactionHistory = ({ isConnected, walletData }: TransactionHistoryProps) => {
  const { data, isLoading, fetchBlockchainData } = useBlockchainData();

  useEffect(() => {
    if (isConnected && walletData?.address) {
      fetchBlockchainData(walletData.address, 'transactions');
    }
  }, [isConnected, walletData?.address]);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'buy':
        return <ArrowDownLeft className="w-4 h-4 text-green-400" />;
      case 'sell':
        return <ArrowUpRight className="w-4 h-4 text-red-400" />;
      case 'swap':
        return <ArrowRightLeft className="w-4 h-4 text-blue-400" />;
      case 'stake':
      case 'unstake':
        return <Coins className="w-4 h-4 text-purple-400" />;
      case 'liquidity_add':
      case 'liquidity_remove':
        return <Droplets className="w-4 h-4 text-cyan-400" />;
      default:
        return <ArrowRightLeft className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'buy':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'sell':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'swap':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'stake':
      case 'unstake':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'liquidity_add':
      case 'liquidity_remove':
        return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatTransactionType = (type: string) => {
    switch (type) {
      case 'buy':
        return 'Buy';
      case 'sell':
        return 'Sell';
      case 'swap':
        return 'Swap';
      case 'stake':
        return 'Stake';
      case 'unstake':
        return 'Unstake';
      case 'liquidity_add':
        return 'Add Liquidity';
      case 'liquidity_remove':
        return 'Remove Liquidity';
      default:
        return 'Transaction';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = diffInMs / (1000 * 60 * 60);
    const diffInDays = diffInHours / 24;

    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else if (diffInDays < 7) {
      return `${Math.floor(diffInDays)}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const transactions = data.transactions?.transactions || [];

  if (!isConnected) {
    return (
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            🔁 Transaction History
          </CardTitle>
          <CardDescription className="text-purple-300">
            Connect your wallet to view transaction history
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
            🔁 Transaction History
          </CardTitle>
          <CardDescription className="text-purple-300">
            Loading transaction history...
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              🔁 Transaction History
            </CardTitle>
            <CardDescription className="text-purple-300">
              Real-time blockchain transactions and activities
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" className="border-purple-600 text-purple-400">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map((tx: any) => (
              <div key={tx.hash} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${getTransactionColor(tx.type)}`}>
                    {getTransactionIcon(tx.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{formatTransactionType(tx.type)}</span>
                      <Badge variant="outline" className="border-purple-600 text-purple-300 text-xs">
                        Ethereum
                      </Badge>
                    </div>
                    <div className="text-sm text-purple-300">
                      {tx.type === 'swap' ? (
                        `${tx.amount} ${tx.from_token} → ${tx.to_token}`
                      ) : (
                        `${tx.amount} ${tx.from_token}`
                      )}
                    </div>
                    <div className="text-xs text-slate-400">{formatTimestamp(tx.timestamp)}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-white font-medium">Live Data</div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="default" className="text-xs">
                      confirmed
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto text-purple-400 hover:text-white"
                      onClick={() => window.open(`https://etherscan.io/tx/${tx.hash}`, '_blank')}
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-purple-300">No transactions found in connected wallet</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
