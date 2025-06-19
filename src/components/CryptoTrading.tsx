
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, TrendingUp, DollarSign, Wallet, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { WalletData } from "@/components/WalletConnector";
import { useWalletBalance } from "@/hooks/useWalletBalance";
import { useCoinGeckoPrice } from "@/hooks/useCoinGeckoPrice";
import { useUniswapQuote } from "@/hooks/useUniswapQuote";

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

  // Use custom hooks for real-time data
  const { balances, isLoading: balanceLoading, refetch: refetchBalance } = useWalletBalance(walletData);
  const { prices, isLoading: priceLoading, refetch: refetchPrices } = useCoinGeckoPrice();
  const { quote, isLoading: quoteLoading, getQuote } = useUniswapQuote();

  // Get quote when swap parameters change
  useEffect(() => {
    if (selectedSwapFrom && selectedSwapTo && swapFromAmount) {
      getQuote(selectedSwapFrom, selectedSwapTo, swapFromAmount);
    }
  }, [selectedSwapFrom, selectedSwapTo, swapFromAmount]);

  const getWalletBalance = (symbol: string): number => {
    return balances[symbol] || 0;
  };

  const getCryptoPriceData = (symbol: string) => {
    const priceData = prices.find(p => p.symbol === symbol);
    return {
      price: priceData?.current_price || 0,
      change: priceData?.price_change_percentage_24h || 0,
      name: priceData?.name || symbol
    };
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <CardTitle className="text-white">Cryptocurrency Trading</CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                refetchBalance();
                refetchPrices();
              }}
              className="border-purple-600 text-purple-400"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
          <CardDescription className="text-purple-300">
            Buy, sell, and swap cryptocurrencies with real-time rates
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

            {/* Buy Tab */}
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
                      {prices.map((crypto) => (
                        <SelectItem key={crypto.symbol} value={crypto.symbol} className="text-white">
                          <div className="flex items-center justify-between w-full">
                            <span>{crypto.name} ({crypto.symbol})</span>
                            <Badge variant="outline" className={`ml-2 ${crypto.price_change_percentage_24h >= 0 ? 'text-green-400 border-green-400' : 'text-red-400 border-red-400'}`}>
                              {crypto.price_change_percentage_24h >= 0 ? '+' : ''}{crypto.price_change_percentage_24h.toFixed(2)}%
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
                      {(parseFloat(buyAmount) / getCryptoPriceData(selectedBuyCrypto).price).toFixed(6)} {selectedBuyCrypto}
                    </span>
                  </p>
                </div>
              )}
              <Button onClick={handleBuy} className="w-full bg-green-600 hover:bg-green-700">
                Buy {selectedBuyCrypto || 'Cryptocurrency'}
              </Button>
            </TabsContent>

            {/* Sell Tab */}
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
                      {prices.map((crypto) => (
                        <SelectItem key={crypto.symbol} value={crypto.symbol} className="text-white">
                          <div className="flex items-center justify-between w-full">
                            <span>{crypto.name} ({crypto.symbol})</span>
                            <span className="text-purple-300 text-sm">${crypto.current_price.toFixed(2)}</span>
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
                      ${(parseFloat(sellAmount) * getCryptoPriceData(selectedSellCrypto).price).toFixed(2)} USD
                    </span>
                  </p>
                </div>
              )}
              <Button onClick={handleSell} className="w-full bg-red-600 hover:bg-red-700">
                Cash Out {selectedSellCrypto || 'Cryptocurrency'}
              </Button>
            </TabsContent>

            {/* Swap Tab */}
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
                        {prices.map((crypto) => (
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
                      {quote && !quoteLoading ? quote.toAmount : 'Amount'}
                      {quoteLoading && <RefreshCw className="w-4 h-4 ml-2 animate-spin" />}
                    </div>
                    <Select value={selectedSwapTo} onValueChange={setSelectedSwapTo}>
                      <SelectTrigger className="bg-slate-800/50 border-purple-800/30 text-white">
                        <SelectValue placeholder="Select crypto" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-purple-800/30">
                        {prices.filter(crypto => crypto.symbol !== selectedSwapFrom).map((crypto) => (
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
              
              {quote && selectedSwapFrom && selectedSwapTo && swapFromAmount && (
                <div className="p-4 bg-purple-900/20 rounded-lg border border-purple-800/30">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-300">Exchange Rate:</span>
                      <span className="text-white">1 {selectedSwapFrom} = {(parseFloat(quote.toAmount) / parseFloat(quote.fromAmount)).toFixed(6)} {selectedSwapTo}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-300">Price Impact:</span>
                      <span className="text-white">{quote.priceImpact}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-purple-300">Estimated Gas:</span>
                      <span className="text-white">{quote.estimatedGas} ETH</span>
                    </div>
                  </div>
                </div>
              )}
              <Button onClick={handleSwap} className="w-full bg-purple-600 hover:bg-purple-700" disabled={quoteLoading}>
                <ArrowUpDown className="w-4 h-4 mr-2" />
                {quoteLoading ? 'Getting Quote...' : 'Swap Tokens'}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Real-time Wallet Balance Display */}
      {walletData && (
        <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Your Wallet Balance</CardTitle>
              {balanceLoading && <RefreshCw className="w-4 h-4 text-purple-400 animate-spin" />}
            </div>
            <CardDescription className="text-purple-300">
              Real-time token balances from your connected wallet
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(balances).map(([symbol, balance]) => (
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

      {/* Live Market Overview */}
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Market Overview</CardTitle>
            {priceLoading && <RefreshCw className="w-4 h-4 text-purple-400 animate-spin" />}
          </div>
          <CardDescription className="text-purple-300">
            Live cryptocurrency prices and 24h changes via CoinGecko
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prices.map((crypto) => (
              <div key={crypto.symbol} className="p-4 bg-slate-800/30 rounded-lg border border-purple-800/20">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-white font-medium">{crypto.symbol}</h3>
                    <p className="text-sm text-purple-300">{crypto.name}</p>
                  </div>
                  <Badge 
                    variant={crypto.price_change_percentage_24h >= 0 ? 'default' : 'destructive'} 
                    className={`text-xs ${crypto.price_change_percentage_24h >= 0 ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}
                  >
                    {crypto.price_change_percentage_24h >= 0 ? '+' : ''}{crypto.price_change_percentage_24h.toFixed(2)}%
                  </Badge>
                </div>
                <p className="text-lg font-bold text-white">${crypto.current_price.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CryptoTrading;
