
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, ArrowDownRight, Repeat, Coins, RefreshCw, ExternalLink } from "lucide-react";
import { useState } from "react";
import { WalletData } from "../WalletConnector";

interface Transaction {
  id: string;
  type: 'buy' | 'sell' | 'swap' | 'stake' | 'unstake' | 'lp_add' | 'lp_remove';
  fromToken?: string;
  toToken?: string;
  amount: number;
  value: number;
  timestamp: Date;
  hash: string;
  chain: string;
  protocol?: string;
  status: 'completed' | 'pending' | 'failed';
}

interface TransactionHistoryProps {
  walletData?: WalletData | null;
  isConnected: boolean;
}

const TransactionHistory = ({ walletData, isConnected }: TransactionHistoryProps) => {
  const [activeFilter, setActiveFilter] = useState('all');

  // Generate realistic transaction history
  const generateTransactions = (): Transaction[] => {
    if (!isConnected || !walletData?.balance) return [];

    const ethAmount = parseFloat(walletData.balance.replace(' ETH', ''));
    const transactions: Transaction[] = [];

    // Generate transactions based on wallet value
    const numTransactions = Math.min(Math.floor(ethAmount * 10), 50);

    for (let i = 0; i < numTransactions; i++) {
      const date = new Date();
      date.setHours(date.getHours() - i * 6);

      const transactionTypes: Transaction['type'][] = ['buy', 'sell', 'swap', 'stake', 'unstake', 'lp_add'];
      const type = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];

      let transaction: Transaction;

      switch (type) {
        case 'buy':
          transaction = {
            id: `tx_${i}`,
            type: 'buy',
            toToken: 'ETH',
            amount: Math.random() * 2,
            value: (Math.random() * 2) * 2800,
            timestamp: date,
            hash: `0x${Math.random().toString(16).substr(2, 64)}`,
            chain: 'Ethereum',
            status: 'completed'
          };
          break;
        case 'sell':
          transaction = {
            id: `tx_${i}`,
            type: 'sell',
            fromToken: 'ETH',
            amount: Math.random() * 1,
            value: (Math.random() * 1) * 2800,
            timestamp: date,
            hash: `0x${Math.random().toString(16).substr(2, 64)}`,
            chain: 'Ethereum',
            status: 'completed'
          };
          break;
        case 'swap':
          const tokens = ['ETH', 'USDC', 'AAVE', 'UNI'];
          const fromToken = tokens[Math.floor(Math.random() * tokens.length)];
          let toToken = tokens[Math.floor(Math.random() * tokens.length)];
          while (toToken === fromToken) {
            toToken = tokens[Math.floor(Math.random() * tokens.length)];
          }
          transaction = {
            id: `tx_${i}`,
            type: 'swap',
            fromToken,
            toToken,
            amount: Math.random() * 5,
            value: (Math.random() * 5) * 100,
            timestamp: date,
            hash: `0x${Math.random().toString(16).substr(2, 64)}`,
            chain: Math.random() > 0.7 ? 'Polygon' : 'Ethereum',
            protocol: 'Uniswap V3',
            status: 'completed'
          };
          break;
        default:
          transaction = {
            id: `tx_${i}`,
            type,
            fromToken: 'ETH',
            toToken: type === 'stake' ? 'stETH' : 'ETH',
            amount: Math.random() * 3,
            value: (Math.random() * 3) * 2800,
            timestamp: date,
            hash: `0x${Math.random().toString(16).substr(2, 64)}`,
            chain: 'Ethereum',
            protocol: type.includes('lp') ? 'Uniswap V3' : 'Lido',
            status: 'completed'
          };
      }

      transactions.push(transaction);
    }

    return transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const transactions = generateTransactions();

  const filteredTransactions = transactions.filter(tx => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'trades') return ['buy', 'sell', 'swap'].includes(tx.type);
    if (activeFilter === 'defi') return ['stake', 'unstake', 'lp_add', 'lp_remove'].includes(tx.type);
    return tx.type === activeFilter;
  });

  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'buy': return <ArrowDownRight className="w-4 h-4 text-green-400" />;
      case 'sell': return <ArrowUpRight className="w-4 h-4 text-red-400" />;
      case 'swap': return <Repeat className="w-4 h-4 text-blue-400" />;
      case 'stake': return <Coins className="w-4 h-4 text-purple-400" />;
      case 'unstake': return <RefreshCw className="w-4 h-4 text-orange-400" />;
      default: return <Coins className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTransactionDescription = (tx: Transaction) => {
    switch (tx.type) {
      case 'buy':
        return `Buy ${tx.amount.toFixed(4)} ${tx.toToken}`;
      case 'sell':
        return `Sell ${tx.amount.toFixed(4)} ${tx.fromToken}`;
      case 'swap':
        return `Swap ${tx.amount.toFixed(4)} ${tx.fromToken} → ${tx.toToken}`;
      case 'stake':
        return `Stake ${tx.amount.toFixed(4)} ${tx.fromToken}`;
      case 'unstake':
        return `Unstake ${tx.amount.toFixed(4)} ${tx.fromToken}`;
      case 'lp_add':
        return `Add LP ${tx.fromToken}/${tx.toToken}`;
      case 'lp_remove':
        return `Remove LP ${tx.fromToken}/${tx.toToken}`;
      default:
        return 'Unknown transaction';
    }
  };

  if (!isConnected) {
    return (
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            🔁 Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-purple-300">Connect your wallet to view transaction history</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            🔁 Transaction History
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-purple-300 hover:text-white">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Filter Tabs */}
        <Tabs value={activeFilter} onValueChange={setActiveFilter} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800/50">
            <TabsTrigger value="all" className="text-purple-300 data-[state=active]:text-white">All</TabsTrigger>
            <TabsTrigger value="trades" className="text-purple-300 data-[state=active]:text-white">Trades</TabsTrigger>
            <TabsTrigger value="defi" className="text-purple-300 data-[state=active]:text-white">DeFi</TabsTrigger>
            <TabsTrigger value="stake" className="text-purple-300 data-[state=active]:text-white">Staking</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {filteredTransactions.map((tx) => (
            <div key={tx.id} className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50 hover:border-purple-600/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {getTransactionIcon(tx.type)}
                  <div>
                    <div className="text-white text-sm font-medium">
                      {getTransactionDescription(tx)}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="border-slate-600 text-slate-300 text-xs">
                        {tx.chain}
                      </Badge>
                      {tx.protocol && (
                        <Badge variant="outline" className="border-purple-600 text-purple-300 text-xs">
                          {tx.protocol}
                        </Badge>
                      )}
                      <span className="text-xs text-slate-400">
                        {tx.timestamp.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-white font-medium">${tx.value.toLocaleString()}</div>
                  <div className="flex items-center gap-1">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        tx.status === 'completed' ? 'border-green-600 text-green-300' :
                        tx.status === 'pending' ? 'border-yellow-600 text-yellow-300' :
                        'border-red-600 text-red-300'
                      }`}
                    >
                      {tx.status}
                    </Badge>
                    <Button variant="ghost" size="sm" className="p-1 h-6 w-6">
                      <ExternalLink className="w-3 h-3 text-purple-400" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-purple-300">No transactions found for the selected filter</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
