
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, ArrowUpDown, Shield, Zap, TrendingUp, Plus, Minus, Clock, CheckCircle } from "lucide-react";
import { useLendingData } from "@/hooks/useLendingData";

const BorrowingLending = () => {
  const {
    chains,
    assets,
    positions,
    transactions,
    isLoading,
    createLendingPosition,
    createTransaction
  } = useLendingData();

  const [selectedAsset, setSelectedAsset] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [selectedFromChain, setSelectedFromChain] = useState<string>("");
  const [selectedToChain, setSelectedToChain] = useState<string>("");

  const handleLend = async () => {
    if (!selectedAsset || !amount) return;
    
    const asset = assets.find(a => a.id === selectedAsset);
    if (!asset) return;

    const success = await createLendingPosition(
      selectedAsset,
      'lend',
      parseFloat(amount),
      asset.lending_apy
    );

    if (success) {
      setAmount("");
      setSelectedAsset("");
    }
  };

  const handleBorrow = async () => {
    if (!selectedAsset || !amount) return;
    
    const asset = assets.find(a => a.id === selectedAsset);
    if (!asset) return;

    const success = await createLendingPosition(
      selectedAsset,
      'borrow',
      parseFloat(amount),
      asset.borrowing_apy
    );

    if (success) {
      setAmount("");
      setSelectedAsset("");
    }
  };

  const handleCrossChainDeposit = async () => {
    if (!selectedAsset || !amount || !selectedFromChain || !selectedToChain) return;

    const success = await createTransaction(
      'deposit',
      selectedAsset,
      parseFloat(amount),
      selectedFromChain,
      selectedToChain
    );

    if (success) {
      setAmount("");
      setSelectedAsset("");
      setSelectedFromChain("");
      setSelectedToChain("");
    }
  };

  const handleRedeem = async (positionId: string, redeemAmount: string) => {
    const position = positions.find(p => p.id === positionId);
    if (!position) return;

    const success = await createTransaction(
      'redeem',
      position.asset_id,
      parseFloat(redeemAmount)
    );

    if (success) {
      // Refresh positions after redemption
    }
  };

  const getChainBadgeColor = (chainName: string) => {
    const colors: { [key: string]: string } = {
      'Ethereum': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Polygon': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Arbitrum': 'bg-blue-600/20 text-blue-300 border-blue-600/30',
      'Optimism': 'bg-red-500/20 text-red-400 border-red-500/30',
      'Binance Smart Chain': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
    };
    return colors[chainName] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Cross-Chain Borrowing & Lending</h2>
        <p className="text-purple-300">Lend, borrow, and manage assets across multiple blockchains</p>
      </div>

      {/* Main Trading Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Trading Actions */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                Lending & Borrowing Operations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="lend" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-purple-900/20">
                  <TabsTrigger value="lend" className="data-[state=active]:bg-green-600">Lend</TabsTrigger>
                  <TabsTrigger value="borrow" className="data-[state=active]:bg-blue-600">Borrow</TabsTrigger>
                  <TabsTrigger value="deposit" className="data-[state=active]:bg-purple-600">Cross-Chain Deposit</TabsTrigger>
                  <TabsTrigger value="redeem" className="data-[state=active]:bg-orange-600">Redeem</TabsTrigger>
                </TabsList>

                <TabsContent value="lend" className="space-y-4 mt-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="asset-select" className="text-white">Select Asset</Label>
                      <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                        <SelectTrigger className="bg-black/20 border-purple-600/30 text-white">
                          <SelectValue placeholder="Choose an asset to lend" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-purple-600/30">
                          {assets.map((asset) => (
                            <SelectItem key={asset.id} value={asset.id} className="text-white hover:bg-purple-600/20">
                              <div className="flex items-center justify-between w-full">
                                <span>{asset.token_symbol} - {asset.token_name}</span>
                                <Badge className="bg-green-500/20 text-green-400 ml-2">
                                  {asset.lending_apy}% APY
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="amount" className="text-white">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount to lend"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-black/20 border-purple-600/30 text-white"
                      />
                    </div>

                    <Button 
                      onClick={handleLend}
                      disabled={!selectedAsset || !amount || isLoading}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {isLoading ? "Processing..." : "Start Lending"}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="borrow" className="space-y-4 mt-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="borrow-asset" className="text-white">Select Asset</Label>
                      <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                        <SelectTrigger className="bg-black/20 border-purple-600/30 text-white">
                          <SelectValue placeholder="Choose an asset to borrow" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-purple-600/30">
                          {assets.map((asset) => (
                            <SelectItem key={asset.id} value={asset.id} className="text-white hover:bg-purple-600/20">
                              <div className="flex items-center justify-between w-full">
                                <span>{asset.token_symbol} - {asset.token_name}</span>
                                <Badge className="bg-red-500/20 text-red-400 ml-2">
                                  {asset.borrowing_apy}% APY
                                </Badge>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="borrow-amount" className="text-white">Amount</Label>
                      <Input
                        id="borrow-amount"
                        type="number"
                        placeholder="Enter amount to borrow"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-black/20 border-purple-600/30 text-white"
                      />
                    </div>

                    <Button 
                      onClick={handleBorrow}
                      disabled={!selectedAsset || !amount || isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      <Minus className="w-4 h-4 mr-2" />
                      {isLoading ? "Processing..." : "Start Borrowing"}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="deposit" className="space-y-4 mt-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white">From Chain</Label>
                        <Select value={selectedFromChain} onValueChange={setSelectedFromChain}>
                          <SelectTrigger className="bg-black/20 border-purple-600/30 text-white">
                            <SelectValue placeholder="Source chain" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/90 border-purple-600/30">
                            {chains.map((chain) => (
                              <SelectItem key={chain.id} value={chain.id} className="text-white">
                                {chain.chain_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-white">To Chain</Label>
                        <Select value={selectedToChain} onValueChange={setSelectedToChain}>
                          <SelectTrigger className="bg-black/20 border-purple-600/30 text-white">
                            <SelectValue placeholder="Destination chain" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/90 border-purple-600/30">
                            {chains.filter(c => c.id !== selectedFromChain).map((chain) => (
                              <SelectItem key={chain.id} value={chain.id} className="text-white">
                                {chain.chain_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label className="text-white">Asset & Amount</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                          <SelectTrigger className="bg-black/20 border-purple-600/30 text-white">
                            <SelectValue placeholder="Select asset" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/90 border-purple-600/30">
                            {assets.map((asset) => (
                              <SelectItem key={asset.id} value={asset.id} className="text-white">
                                {asset.token_symbol}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          placeholder="Amount"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="bg-black/20 border-purple-600/30 text-white"
                        />
                      </div>
                    </div>

                    <Button 
                      onClick={handleCrossChainDeposit}
                      disabled={!selectedAsset || !amount || !selectedFromChain || !selectedToChain || isLoading}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      <ArrowUpDown className="w-4 h-4 mr-2" />
                      {isLoading ? "Processing..." : "Cross-Chain Deposit"}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="redeem" className="space-y-4 mt-6">
                  <div className="space-y-4">
                    {positions.length === 0 ? (
                      <div className="text-center py-8 text-purple-300">
                        No active positions to redeem
                      </div>
                    ) : (
                      positions.map((position) => (
                        <Card key={position.id} className="bg-purple-900/20 border-purple-600/30">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center gap-2">
                                  <Badge className={position.position_type === 'lend' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}>
                                    {position.position_type.toUpperCase()}
                                  </Badge>
                                  <span className="text-white font-medium">
                                    {position.amount} {/* Asset symbol would come from joined data */}
                                  </span>
                                </div>
                                <div className="text-sm text-purple-300 mt-1">
                                  APY: {position.apy_rate}% | Interest: {position.accrued_interest}
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleRedeem(position.id, position.amount.toString())}
                                className="bg-orange-600 hover:bg-orange-700"
                              >
                                <Zap className="w-4 h-4 mr-1" />
                                Redeem
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Market Overview */}
        <div className="space-y-6">
          {/* Available Assets */}
          <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white text-lg">Available Assets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {assets.slice(0, 5).map((asset) => (
                <div key={asset.id} className="flex items-center justify-between p-3 bg-purple-900/20 rounded-lg">
                  <div>
                    <div className="text-white font-medium">{asset.token_symbol}</div>
                    <div className="text-sm text-purple-300">{asset.token_name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 text-sm">{asset.lending_apy}% APY</div>
                    <div className="text-red-400 text-xs">{asset.borrowing_apy}% Borrow</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white text-lg">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {transactions.slice(0, 5).map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3 bg-purple-900/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      tx.status === 'confirmed' ? 'bg-green-400' : 
                      tx.status === 'pending' ? 'bg-yellow-400' : 'bg-red-400'
                    }`} />
                    <div>
                      <div className="text-white text-sm font-medium">
                        {tx.transaction_type.toUpperCase()}
                      </div>
                      <div className="text-xs text-purple-300">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white text-sm">{tx.amount}</div>
                    <Badge variant="outline" className={`text-xs ${
                      tx.status === 'confirmed' ? 'border-green-500 text-green-400' :
                      tx.status === 'pending' ? 'border-yellow-500 text-yellow-400' :
                      'border-red-500 text-red-400'
                    }`}>
                      {tx.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Supported Chains */}
          <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white text-lg">Supported Chains</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {chains.map((chain) => (
                  <Badge 
                    key={chain.id} 
                    className={getChainBadgeColor(chain.chain_name)}
                  >
                    {chain.chain_name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Platform Statistics */}
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Live Platform Statistics</CardTitle>
          <CardDescription className="text-purple-300">
            Real-time metrics from our cross-chain lending platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">$2.5B+</div>
              <div className="text-sm text-purple-300">Total Value Locked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">{chains.length}</div>
              <div className="text-sm text-purple-300">Supported Chains</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">8.5%</div>
              <div className="text-sm text-purple-300">Average APY</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">{positions.length}</div>
              <div className="text-sm text-purple-300">Your Active Positions</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BorrowingLending;
