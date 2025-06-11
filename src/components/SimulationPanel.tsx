
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Play, Calculator, TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";

const SimulationPanel = () => {
  const [simulationType, setSimulationType] = useState('swap');
  const [fromToken, setFromToken] = useState('');
  const [toToken, setToToken] = useState('');
  const [amount, setAmount] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

  const mockTokens = [
    { symbol: 'ETH', name: 'Ethereum', price: 2534.12 },
    { symbol: 'USDC', name: 'USD Coin', price: 1.00 },
    { symbol: 'USDT', name: 'Tether', price: 1.00 },
    { symbol: 'AAVE', name: 'Aave', price: 98.76 },
    { symbol: 'UNI', name: 'Uniswap', price: 12.84 },
  ];

  const runSimulation = async () => {
    setIsSimulating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockResult = {
        type: simulationType,
        success: true,
        estimatedOutput: simulationType === 'swap' ? '2.456 ETH' : '$124.56',
        gasFee: '$12.34',
        priceImpact: '0.12%',
        slippage: '0.5%',
        route: ['Uniswap V3', '1inch', 'Paraswap'],
        confidence: 94,
        risks: [
          { level: 'low', message: 'Price impact within acceptable range' },
          { level: 'medium', message: 'Consider splitting large orders' }
        ]
      };
      
      setSimulationResult(mockResult);
      setIsSimulating(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calculator className="w-5 h-5 text-purple-400" />
            DeFi Simulation Lab
          </CardTitle>
          <CardDescription className="text-purple-300">
            Test your DeFi strategies risk-free before executing on-chain
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={simulationType} onValueChange={setSimulationType} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
              <TabsTrigger value="swap" className="data-[state=active]:bg-purple-600">Token Swap</TabsTrigger>
              <TabsTrigger value="lending" className="data-[state=active]:bg-purple-600">Lending</TabsTrigger>
              <TabsTrigger value="liquidity" className="data-[state=active]:bg-purple-600">Liquidity</TabsTrigger>
            </TabsList>

            <TabsContent value="swap" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-purple-300">From Token</label>
                  <Select value={fromToken} onValueChange={setFromToken}>
                    <SelectTrigger className="bg-slate-800/50 border-purple-800/30 text-white">
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-purple-800/30">
                      {mockTokens.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol} className="text-white">
                          {token.symbol} - {token.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-purple-300">To Token</label>
                  <Select value={toToken} onValueChange={setToToken}>
                    <SelectTrigger className="bg-slate-800/50 border-purple-800/30 text-white">
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-purple-800/30">
                      {mockTokens.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol} className="text-white">
                          {token.symbol} - {token.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-purple-300">Amount</label>
                <Input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="bg-slate-800/50 border-purple-800/30 text-white"
                />
              </div>
            </TabsContent>

            <TabsContent value="lending" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-purple-300">Asset to Lend</label>
                  <Select>
                    <SelectTrigger className="bg-slate-800/50 border-purple-800/30 text-white">
                      <SelectValue placeholder="Select asset" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-purple-800/30">
                      {mockTokens.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol} className="text-white">
                          {token.symbol} - {token.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-purple-300">Protocol</label>
                  <Select>
                    <SelectTrigger className="bg-slate-800/50 border-purple-800/30 text-white">
                      <SelectValue placeholder="Select protocol" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-purple-800/30">
                      <SelectItem value="aave" className="text-white">Aave V3</SelectItem>
                      <SelectItem value="compound" className="text-white">Compound V3</SelectItem>
                      <SelectItem value="morpho" className="text-white">Morpho</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-purple-300">Amount</label>
                <Input
                  placeholder="Enter amount to lend"
                  className="bg-slate-800/50 border-purple-800/30 text-white"
                />
              </div>
            </TabsContent>

            <TabsContent value="liquidity" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-purple-300">Token A</label>
                  <Select>
                    <SelectTrigger className="bg-slate-800/50 border-purple-800/30 text-white">
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-purple-800/30">
                      {mockTokens.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol} className="text-white">
                          {token.symbol} - {token.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm text-purple-300">Token B</label>
                  <Select>
                    <SelectTrigger className="bg-slate-800/50 border-purple-800/30 text-white">
                      <SelectValue placeholder="Select token" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-purple-800/30">
                      {mockTokens.map((token) => (
                        <SelectItem key={token.symbol} value={token.symbol} className="text-white">
                          {token.symbol} - {token.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm text-purple-300">Pool Fee Tier</label>
                <Select>
                  <SelectTrigger className="bg-slate-800/50 border-purple-800/30 text-white">
                    <SelectValue placeholder="Select fee tier" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-purple-800/30">
                    <SelectItem value="0.01" className="text-white">0.01% - Stable pairs</SelectItem>
                    <SelectItem value="0.05" className="text-white">0.05% - Standard</SelectItem>
                    <SelectItem value="0.3" className="text-white">0.30% - Exotic pairs</SelectItem>
                    <SelectItem value="1" className="text-white">1.00% - Very exotic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <div className="flex gap-4">
              <Button
                onClick={runSimulation}
                disabled={isSimulating || !fromToken || !toToken || !amount}
                className="bg-purple-600 hover:bg-purple-700 flex-1"
              >
                {isSimulating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Simulating...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Run Simulation
                  </>
                )}
              </Button>
              
              <Button variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-600/10">
                Save Template
              </Button>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Simulation Results */}
      {simulationResult && (
        <Card className="bg-black/40 border-green-800/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              Simulation Results
            </CardTitle>
            <CardDescription className="text-green-300">
              Preview of your transaction before execution
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Confidence Score */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-purple-300">Confidence Score</span>
                <span className="text-sm text-white font-medium">{simulationResult.confidence}%</span>
              </div>
              <Progress value={simulationResult.confidence} className="bg-slate-800" />
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-800/30 rounded-lg">
                <div className="text-sm text-purple-300">Expected Output</div>
                <div className="text-lg font-semibold text-white">{simulationResult.estimatedOutput}</div>
              </div>
              
              <div className="p-4 bg-slate-800/30 rounded-lg">
                <div className="text-sm text-purple-300">Estimated Gas</div>
                <div className="text-lg font-semibold text-white">{simulationResult.gasFee}</div>
              </div>
              
              <div className="p-4 bg-slate-800/30 rounded-lg">
                <div className="text-sm text-purple-300">Price Impact</div>
                <div className="text-lg font-semibold text-white">{simulationResult.priceImpact}</div>
              </div>
            </div>

            {/* Route Information */}
            <div className="space-y-3">
              <h4 className="text-white font-medium">Optimal Route</h4>
              <div className="flex items-center space-x-2">
                {simulationResult.route.map((step, index) => (
                  <div key={index} className="flex items-center">
                    <Badge variant="outline" className="border-blue-600 text-blue-300">
                      {step}
                    </Badge>
                    {index < simulationResult.route.length - 1 && (
                      <TrendingUp className="w-4 h-4 text-purple-400 mx-2" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="space-y-3">
              <h4 className="text-white font-medium">Risk Assessment</h4>
              <div className="space-y-2">
                {simulationResult.risks.map((risk, index) => (
                  <div key={index} className={`flex items-center space-x-2 p-2 rounded-lg ${
                    risk.level === 'low' ? 'bg-green-900/20' : 'bg-orange-900/20'
                  }`}>
                    <AlertCircle className={`w-4 h-4 ${
                      risk.level === 'low' ? 'text-green-400' : 'text-orange-400'
                    }`} />
                    <span className={`text-sm ${
                      risk.level === 'low' ? 'text-green-300' : 'text-orange-300'
                    }`}>
                      {risk.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4 border-t border-slate-700">
              <Button className="bg-green-600 hover:bg-green-700 flex-1">
                Execute Transaction
              </Button>
              <Button variant="outline" className="border-purple-600 text-purple-400">
                Modify Parameters
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SimulationPanel;
