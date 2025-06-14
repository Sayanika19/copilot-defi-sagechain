
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, ArrowDownLeft, ArrowRightLeft, Coins, Droplets, ExternalLink } from "lucide-react";
import { WalletData } from "../WalletConnector";

interface TransactionHistoryProps {
  isConnected: boolean;
  walletData?: WalletData | null;
}

interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'swap' | 'stake' | 'unstake' | 'liquidity_add' | 'liquidity_remove';
  timestamp: string;
  fromToken: string;
  toToken?: string;
  fromAmount: number;
  toAmount?: number;
  value: number;
  txHash: string;
  chain: string;
  status: 'success' | 'pending' | 'failed';
}

const TransactionHistory = ({ isConnected, walletData }: TransactionHistoryProps) => {
  const generateTransactions = (): Transaction[] => {
    if (!walletData?.balance || !isConnected) return [];
    
    return [
      {
        id: '1',
        type: 'buy',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        fromToken: 'USDC',
        toToken: 'ETH',
        fromAmount: 2800,
        toAmount: 1,
        value: 2800,
        txHash: '0x1234...abcd',
        chain: 'Ethereum',
        status: 'success'
      },
      {
        id: '2',
        type: 'stake',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        fromToken: 'ETH',
        fromAmount: 0.5,
        value: 1400,
        txHash: '0x5678...efgh',
        chain: 'Ethereum',
        status: 'success'
      },
      {
        id: '3',
        type: 'swap',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        fromToken: 'USDC',
        toToken: 'AAVE',
        fromAmount: 1000,
        toAmount: 10.12,
        value: 1000,
        txHash: '0x9abc...ijkl',
        chain: 'Polygon',
        status: 'success'
      },
      {
        id: '4',
        type: 'liquidity_add',
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        fromToken: 'ETH/USDC',
        fromAmount: 2500,
        value: 2500,
        txHash: '0xdef0...mnop',
        chain: 'Ethereum',
        status: 'success'
      },
      {
        id: '5',
        type: 'sell',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
        fromToken: 'BTC',
        toToken: 'USDC',
        fromAmount: 0.05,
        toAmount: 2150,
        value: 2150,
        txHash: '0x2468...qrst',
        chain: 'Bitcoin',
        status: 'success'
      }
    ];
  };

  const getTransactionIcon = (type: Transaction['type']) => {
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

  const getTransactionColor = (type: Transaction['type']) => {
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

  const formatTransactionType = (type: Transaction['type']) => {
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

  const transactions = generateTransactions();

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

  return (
    <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              🔁 Transaction History
            </CardTitle>
            <CardDescription className="text-purple-300">
              Recent blockchain transactions and activities
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
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${getTransactionColor(tx.type)}`}>
                    {getTransactionIcon(tx.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-medium">{formatTransactionType(tx.type)}</span>
                      <Badge variant="outline" className="border-purple-600 text-purple-300 text-xs">
                        {tx.chain}
                      </Badge>
                    </div>
                    <div className="text-sm text-purple-300">
                      {tx.type === 'swap' ? (
                        `${tx.fromAmount} ${tx.fromToken} → ${tx.toAmount} ${tx.toToken}`
                      ) : tx.type === 'buy' ? (
                        `${tx.toAmount} ${tx.toToken} for ${tx.fromAmount} ${tx.fromToken}`
                      ) : tx.type === 'sell' ? (
                        `${tx.fromAmount} ${tx.fromToken} for ${tx.toAmount} ${tx.toToken}`
                      ) : (
                        `${tx.fromAmount} ${tx.fromToken}`
                      )}
                    </div>
                    <div className="text-xs text-slate-400">{formatTimestamp(tx.timestamp)}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-white font-medium">${tx.value.toLocaleString()}</div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={tx.status === 'success' ? 'default' : tx.status === 'pending' ? 'secondary' : 'destructive'}
                      className="text-xs"
                    >
                      {tx.status}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto text-purple-400 hover:text-white"
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
            <p className="text-purple-300">No transactions found</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
