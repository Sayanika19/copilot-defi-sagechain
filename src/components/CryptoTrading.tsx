
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, TrendingUp, DollarSign, Wallet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WalletData } from "@/components/WalletConnector";

interface CryptoTradingProps {
  walletData?: WalletData | null;
}

const CryptoTrading = ({ walletData }: CryptoTradingProps) => {
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [swapFromAmount, setSwapFromAmount] = useState('');
  const [selectedBuyCrypto, setSelectedBuyCrypto] = useState('');
  const [selectedSellCrypto, setSelectedSellCrypto] = useState('');
  const [selectedSwapFrom, setSelectedSwapFrom] = useState('');
  const [selectedSwapTo, setSelectedSwapTo] = useState('');
  const { toast } = useToast();

  const cryptos = [
    { symbol: 'ETH', name: 'Ethereum', price: '$2,340.50', change: '+2.4%' },
    { symbol: 'BTC', name: 'Bitcoin', price: '$43,250.00', change: '+1.8%' },
    { symbol: 'USDC', name: 'USD Coin', price: '$1.00', change: '+0.0%' },
    { symbol: 'USDT', name: 'Tether', price: '$1.00', change: '+0.0%' },
    { symbol: 'UNI', name: 'Uniswap', price: '$8.45', change: '+3.2%' },
    { symbol: 'AAVE', name: 'Aave', price: '$95.30', change: '+4.1%' },
  ];

  const getWalletBalance = (symbol: string): number => {
    if (!walletData?.tokens) return 0;
    return walletData.tokens[symbol] || 0;
  };

  const handleBuy = () => {
    if (!buyAmount || !selectedBuyCrypto) {
      toast({
        title: "Missing Information",
        description: "Please enter amount and select cryptocurrency",
        variant: "destructive",
      });
      return;
    }

    if (!walletData) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to make purchases",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Buy Order Placed",
      description: `Buying $${buyAmount} worth of ${selectedBuyCrypto}`,
    });
    setBuyAmount('');
    setSelectedBuyCrypto('');
  };

  const handleSell = () => {
    if (!sellAmount || !selectedSellCrypto) {
      toast({
        title: "Missing Information",
        description: "Please enter amount and select cryptocurrency",
        variant: "destructive",
      });
      return;
    }

    if (!walletData) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to cash out",
        variant: "destructive",
      });
      return;
    }

    const availableBalance = getWalletBalance(selectedSellCrypto);
    const sellAmountNum = parseFloat(sellAmount);

    if (sellAmountNum > availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: `You only have ${availableBalance} ${selectedSellCrypto} available. Cannot cash out ${sellAmount} ${selectedSellCrypto}.`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Cash Out Order Placed",
      description: `Cashing out ${sellAmount} ${selectedSellCrypto}`,
    });
    setSellAmount('');
    setSelectedSellCrypto('');
  };

  const handleSwap = () => {
    if (!swapFromAmount || !selectedSwapFrom || !selectedSwapTo) {
      toast({
        title: "Missing Information",
        description: "Please fill in all swap details",
        variant: "destructive",
      });
      return;
    }

    if (!walletData) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to swap tokens",
        variant: "destructive",
      });
      return;
    }

    const availableBalance = getWalletBalance(selectedSwapFrom);
    const swapAmountNum = parseFloat(swapFromAmount);

    if (swapAmountNum > availableBalance) {
      toast({
        title: "Insufficient Balance",
        description: `You only have ${availableBalance} ${selectedSwapFrom} available. Cannot swap ${swapFromAmount} ${selectedSwapFrom}.`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Swap Executed",
      description: `Swapping ${swapFromAmount} ${selectedSwapFrom} for ${selectedSwapTo}`,
    });
    setSwapFromAmount('');
    setSelectedSwapFrom('');
    setSelectedSwapTo('');
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Cryptocurrency Trading
          </CardTitle>
          <CardDescription className="text-purple-300">
            Buy, sell, and swap cryptocurrencies with competitive rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="buy" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
              <TabsTrigger value="buy" className="data-[state=active]:bg-purple-600">
                <DollarSign className="w-4 h-4 mr-2" />
                Buy
              </TabsTrigger>
              <TabsTrigger value="sell" className="data-[state=active]:bg-purple-600">
                <Wallet className="w-4 h-4 mr-2" />
                Cash Out
              </TabsTrigger>
              <TabsTrigger value="swap" className="data-[state=active]:bg-purple-600">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                Swap
              </TabsTrigger>
            </TabsList>

            <TabsContent value="buy" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buy-amount" className="text-purple-300">Amount (USD)</Label>
                  <Input
                    id="buy-amount"
                    value={buyAmount}
                    onChange={(e) => setBuyAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="bg-slate-800/50 border-purple-800/30 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-purple-300">Cryptocurrency</Label>
                  <Select value={selectedBuyCrypto} onValueChange={setSelectedBuyCrypto}>
                    <SelectTrigger className="bg-slate-800/50 border-purple-800/30 text-white">
                      <SelectValue placeholder="Select crypto" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-purple-800/30">
                      {cryptos.map((crypto) => (
                        <SelectItem key={crypto.symbol} value={crypto.symbol} className="text-white">
                          <div className="flex items-center justify-between w-full">
                            <span>{crypto.name} ({crypto.symbol})</span>
                            <Badge variant="outline" className="ml-2 text-green-400 border-green-400">
                              {crypto.change}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {selectedBuyCrypto && buyAmount && (
                <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-800/30">
                  <p className="text-sm text-purple-300">
                    You'll receive approximately{' '}
                    <span className="text-white font-medium">
                      {(parseFloat(buyAmount) / parseFloat(cryptos.find(c => c.symbol === selectedBuyCrypto)?.price.replace('$', '').replace(',', '') || '1')).toFixed(6)} {selectedBuyCrypto}
                    </span>
                  </p>
                </div>
              )}
              <Button onClick={handleBuy} className="w-full bg-green-600 hover:bg-green-700">
                Buy {selectedBuyCrypto || 'Cryptocurrency'}
              </Button>
            </TabsContent>

            <TabsContent value="sell" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sell-amount" className="text-purple-300">Amount</Label>
                  <Input
                    id="sell-amount"
                    value={sellAmount}
                    onChange={(e) => setSellAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="bg-slate-800/50 border-purple-800/30 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-purple-300">Cryptocurrency</Label>
                  <Select value={selectedSellCrypto} onValueChange={setSelectedSellCrypto}>
                    <SelectTrigger className="bg-slate-800/50 border-purple-800/30 text-white">
                      <SelectValue placeholder="Select crypto" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-purple-800/30">
                      {cryptos.map((crypto) => (
                        <SelectItem key={crypto.symbol} value={crypto.symbol} className="text-white">
                          <div className="flex items-center justify-between w-full">
                            <span>{crypto.name} ({crypto.symbol})</span>
                            <span className="text-purple-300 text-sm">{crypto.price}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {selectedSellCrypto && walletData && (
                <div className="p-3 bg-slate-800/30 rounded-lg border border-purple-800/20">
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-300">Available Balance:</span>
                    <span className="text-white font-medium">
                      {getWalletBalance(selectedSellCrypto)} {selectedSellCrypto}
                    </span>
                  </div>
                </div>
              )}
              
              {selectedSellCrypto && sellAmount && (
                <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-800/30">
                  <p className="text-sm text-purple-300">
                    You'll receive approximately{' '}
                    <span className="text-white font-medium">
                      ${(parseFloat(sellAmount) * parseFloat(cryptos.find(c => c.symbol === selectedSellCrypto)?.price.replace('$', '').replace(',', '') || '0')).toFixed(2)} USD
                    </span>
                  </p>
                </div>
              )}
              <Button onClick={handleSell} className="w-full bg-red-600 hover:bg-red-700">
                Cash Out {selectedSellCrypto || 'Cryptocurrency'}
              </Button>
            </TabsContent>

            <TabsContent value="swap" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-purple-300">From</Label>
                  <div className="space-y-2">
                    <Input
                      value={swapFromAmount}
                      onChange={(e) => setSwapFromAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="bg-slate-800/50 border-purple-800/30 text-white"
                    />
                    <Select value={selectedSwapFrom} onValueChange={setSelectedSwapFrom}>
                      <SelectTrigger className="bg-slate-800/50 border-purple-800/30 text-white">
                        <SelectValue placeholder="Select crypto" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-purple-800/30">
                        {cryptos.map((crypto) => (
                          <SelectItem key={crypto.symbol} value={crypto.symbol} className="text-white">
                            {crypto.name} ({crypto.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-purple-300">To</Label>
                  <div className="space-y-2">
                    <div className="h-10 bg-slate-800/50 border border-purple-800/30 rounded-md flex items-center px-3 text-purple-300">
                      {selectedSwapFrom && selectedSwapTo && swapFromAmount ? 
                        (parseFloat(swapFromAmount) * 0.995).toFixed(6) : 'Amount'
                      }
                    </div>
                    <Select value={selectedSwapTo} onValueChange={setSelectedSwapTo}>
                      <SelectTrigger className="bg-slate-800/50 border-purple-800/30 text-white">
                        <SelectValue placeholder="Select crypto" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-purple-800/30">
                        {cryptos.filter(crypto => crypto.symbol !== selectedSwapFrom).map((crypto) => (
                          <SelectItem key={crypto.symbol} value={crypto.symbol} className="text-white">
                            {crypto.name} ({crypto.symbol})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              {selectedSwapFrom && walletData && (
                <div className="p-3 bg-slate-800/30 rounded-lg border border-purple-800/20">
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-300">Available Balance:</span>
                    <span className="text-white font-medium">
                      {getWalletBalance(selectedSwapFrom)} {selectedSwapFrom}
                    </span>
                  </div>
                </div>
              )}
              
              {selectedSwapFrom && selectedSwapTo && swapFromAmount && (
                <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-800/30">
                  <div className="flex justify-between text-sm">
                    <span className="text-purple-300">Exchange Rate:</span>
                    <span className="text-white">1 {selectedSwapFrom} = 0.995 {selectedSwapTo}</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-purple-300">Fee (0.5%):</span>
                    <span className="text-white">{(parseFloat(swapFromAmount) * 0.005).toFixed(6)} {selectedSwapFrom}</span>
                  </div>
                </div>
              )}
              <Button onClick={handleSwap} className="w-full bg-purple-600 hover:bg-purple-700">
                <ArrowUpDown className="w-4 h-4 mr-2" />
                Swap Tokens
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Wallet Balance Display */}
      {walletData && (
        <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Your Wallet Balance</CardTitle>
            <CardDescription className="text-purple-300">
              Available tokens for trading
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(walletData.tokens || {}).map(([symbol, balance]) => (
                <div key={symbol} className="p-3 bg-slate-800/30 rounded-lg border border-purple-800/20">
                  <div className="text-center">
                    <h3 className="text-white font-medium">{symbol}</h3>
                    <p className="text-purple-300 text-sm">{balance}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market Overview */}
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Market Overview</CardTitle>
          <CardDescription className="text-purple-300">
            Current cryptocurrency prices and 24h changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cryptos.map((crypto) => (
              <div key={crypto.symbol} className="p-4 bg-slate-800/30 rounded-lg border border-purple-800/20">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-white font-medium">{crypto.symbol}</h3>
                    <p className="text-sm text-purple-300">{crypto.name}</p>
                  </div>
                  <Badge variant={crypto.change.startsWith('+') ? 'default' : 'destructive'} className="text-xs">
                    {crypto.change}
                  </Badge>
                </div>
                <p className="text-lg font-bold text-white">{crypto.price}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CryptoTrading;
