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
import AITokenCalculator from "@/components/AITokenCalculator";
import CollateralBorrowCalculator from "@/components/CollateralBorrowCalculator";
import FeatureCallout from "@/components/FeatureCallout";

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
  const [borrowPrediction, setBorrowPrediction] = useState<any>(null);

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
        <p className="text-purple-300">Lend, borrow, and manage GO & SAGE coins across multiple blockchains with AI-powered insights</p>
      </div>

      {/* AI Token Calculator Section */}
      <FeatureCallout
        title="AI-Powered Token Analysis"
        description="Advanced AI model for GO coin and SAGE coin value calculations, market predictions, and lending optimization. Calculate token amounts from USD input and predict conversions between GO and SAGE coins with real-time lending rates."
        variant="success"
        className="mb-6"
      />
      
      <AITokenCalculator 
        onCalculationComplete={(result) => {
          console.log('AI Calculation completed:', result);
          if (result.tokenAmount) {
            setAmount(result.tokenAmount.toString());
          }
        }}
      />

      {/* Collateral-Based Borrowing Calculator */}
      <FeatureCallout
        title="Collateral-Based Borrowing"
        description="Use your ETH, GO, or SAGE coins as collateral to borrow other tokens. Our AI calculates optimal borrow amounts, liquidation risks, and provides safety recommendations based on your collateral."
        variant="warning"
        className="mb-6"
      />
      
      <CollateralBorrowCalculator 
        onBorrowCalculated={(result) => {
          setBorrowPrediction(result);
          setAmount(result.recommendedBorrowAmount.toString());
        }}
      />

      {/* Main Trading Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Trading Actions */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                GO & SAGE Coin Operations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="lend" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-purple-900/20">
                  <TabsTrigger value="lend" className="data-[state=active]:bg-green-600">Lend</TabsTrigger>
                  <TabsTrigger value="borrow" className="data-[state=active]:bg-blue-600">Borrow</TabsTrigger>
                  <TabsTrigger value="deposit" className="data-[state=active]:bg-purple-600">Cross-Chain</TabsTrigger>
                  <TabsTrigger value="redeem" className="data-[state=active]:bg-orange-600">Redeem</TabsTrigger>
                </TabsList>

                <TabsContent value="lend" className="space-y-4 mt-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="asset-select" className="text-white">Select GO/SAGE Token</Label>
                      <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                        <SelectTrigger className="bg-black/20 border-purple-600/30 text-white">
                          <SelectValue placeholder="Choose GO or SAGE coin to lend" />
                        </SelectTrigger>
                        <SelectContent className="bg-black/90 border-purple-600/30">
                          <SelectItem value="GO" className="text-white hover:bg-purple-600/20">
                            <div className="flex items-center justify-between w-full">
                              <span>GO Coin (1x ETH)</span>
                              <Badge className="bg-green-500/20 text-green-400 ml-2">
                                8.5% APY
                              </Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="SAGE" className="text-white hover:bg-purple-600/20">
                            <div className="flex items-center justify-between w-full">
                              <span>SAGE Coin (2x ETH)</span>
                              <Badge className="bg-green-500/20 text-green-400 ml-2">
                                9.2% APY
                              </Badge>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="amount" className="text-white">Amount</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="Enter amount to lend (AI calculated)"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="bg-black/20 border-purple-600/30 text-white"
                      />
                      <p className="text-purple-300 text-xs mt-1">
                        Use AI Calculator above for optimal amounts
                      </p>
                    </div>

                    <Button 
                      onClick={handleLend}
                      disabled={!selectedAsset || !amount || isLoading}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {isLoading ? "Processing via MetaMask..." : `Lend ${selectedAsset} Coins`}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="borrow" className="space-y-4 mt-6">
                  {borrowPrediction && (
                    <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
                      <h4 className="text-blue-400 font-medium mb-2">AI Borrow Recommendation</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-blue-300">Recommended Amount:</span>
                          <p className="text-white font-semibold">{borrowPrediction.recommendedBorrowAmount.toFixed(4)}</p>
                        </div>
                        <div>
                          <span className="text-blue-300">Health Factor:</span>
                          <p className="text-white font-semibold">{borrowPrediction.healthFactor.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="borrow-asset" className="text-white">Select GO/SAGE Token</Label>
                    <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                      <SelectTrigger className="bg-black/20 border-purple-600/30 text-white">
                        <SelectValue placeholder="Choose GO or SAGE coin to borrow" />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-purple-600/30">
                        <SelectItem value="GO" className="text-white hover:bg-purple-600/20">
                          <div className="flex items-center justify-between w-full">
                            <span>GO Coin (1x ETH)</span>
                            <Badge className="bg-red-500/20 text-red-400 ml-2">
                              12.0% APY
                            </Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="SAGE" className="text-white hover:bg-purple-600/20">
                          <div className="flex items-center justify-between w-full">
                            <span>SAGE Coin (2x ETH)</span>
                            <Badge className="bg-red-500/20 text-red-400 ml-2">
                              13.5% APY
                            </Badge>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="borrow-amount" className="text-white">Amount</Label>
                    <Input
                      id="borrow-amount"
                      type="number"
                      placeholder={borrowPrediction ? "AI predicted amount" : "Enter amount to borrow"}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="bg-black/20 border-purple-600/30 text-white"
                    />
                    <p className="text-purple-300 text-xs mt-1">
                      Collateral required: 150% for GO, 140% for SAGE
                    </p>
                  </div>

                  <Button 
                    onClick={handleBorrow}
                    disabled={!selectedAsset || !amount || isLoading}
                    className="w-full bg-blue-600 hover:blue-700"
                  >
                    <Minus className="w-4 h-4 mr-2" />
                    {isLoading ? "Processing via MetaMask..." : `Borrow ${selectedAsset} Coins`}
                  </Button>
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
          {/* GO & SAGE Coin Info */}
          <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white text-lg">GO & SAGE Coins</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg">
                <div>
                  <div className="text-white font-medium">GO Coin</div>
                  <div className="text-sm text-green-300">1x ETH Value</div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 text-sm">8.5% Lending APY</div>
                  <div className="text-red-400 text-xs">12.0% Borrowing APY</div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-900/20 rounded-lg">
                <div>
                  <div className="text-white font-medium">SAGE Coin</div>
                  <div className="text-sm text-purple-300">2x ETH Value</div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 text-sm">9.2% Lending APY</div>
                  <div className="text-red-400 text-xs">13.5% Borrowing APY</div>
                </div>
              </div>
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

      {/* Enhanced Platform Statistics */}
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">SageChain Platform Statistics</CardTitle>
          <CardDescription className="text-purple-300">
            Real-time metrics for GO and SAGE coin lending platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">10,000</div>
              <div className="text-sm text-purple-300">GO Coins Available</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">5,000</div>
              <div className="text-sm text-purple-300">SAGE Coins Minted</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">1:2</div>
              <div className="text-sm text-purple-300">GO:SAGE Ratio</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">98.5%</div>
              <div className="text-sm text-purple-300">AI Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400 mb-1">MetaMask</div>
              <div className="text-sm text-purple-300">Integrated Wallet</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BorrowingLending;
