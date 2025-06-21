
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Brain, Calculator, TrendingUp, AlertCircle } from 'lucide-react';
import { useTokenAI } from '@/hooks/useTokenAI';

interface AITokenCalculatorProps {
  onCalculationComplete?: (result: any) => void;
}

const AITokenCalculator = ({ onCalculationComplete }: AITokenCalculatorProps) => {
  const [usdAmount, setUsdAmount] = useState('');
  const [selectedToken, setSelectedToken] = useState<'GO' | 'SAGE'>('GO');
  const [conversionAmount, setConversionAmount] = useState('');
  const [fromToken, setFromToken] = useState<'GO' | 'SAGE'>('GO');
  const [toToken, setToToken] = useState<'GO' | 'SAGE'>('SAGE');
  const [results, setResults] = useState<any>(null);

  const {
    isCalculating,
    predictions,
    calculateTokenFromUSD,
    predictTokenConversion,
    calculateLendingRates,
    simulateMarketScenarios
  } = useTokenAI();

  const handleUSDCalculation = async () => {
    if (!usdAmount) return;
    
    const result = await calculateTokenFromUSD({
      usdAmount: parseFloat(usdAmount),
      targetToken: selectedToken
    });
    
    const lendingRates = calculateLendingRates(selectedToken, result.tokenAmount);
    const marketSimulation = simulateMarketScenarios(selectedToken, result.tokenAmount);
    
    setResults({
      type: 'usd_calculation',
      ...result,
      lendingRates,
      marketSimulation
    });
    
    onCalculationComplete?.(result);
  };

  const handleTokenPrediction = async () => {
    if (!conversionAmount) return;
    
    const prediction = await predictTokenConversion({
      fromToken,
      toToken,
      amount: parseFloat(conversionAmount)
    });
    
    const lendingRates = calculateLendingRates(toToken, prediction.convertedAmount);
    const marketSimulation = simulateMarketScenarios(toToken, prediction.convertedAmount);
    
    setResults({
      type: 'token_prediction',
      ...prediction,
      lendingRates,
      marketSimulation
    });
    
    onCalculationComplete?.(prediction);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            AI Token Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* USD to Token Calculation */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-green-400" />
              USD to Token Conversion
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white">USD Amount</Label>
                <Input
                  type="number"
                  placeholder="Enter USD amount"
                  value={usdAmount}
                  onChange={(e) => setUsdAmount(e.target.value)}
                  className="bg-black/20 border-purple-600/30 text-white"
                />
              </div>
              <div>
                <Label className="text-white">Target Token</Label>
                <Select value={selectedToken} onValueChange={(value: 'GO' | 'SAGE') => setSelectedToken(value)}>
                  <SelectTrigger className="bg-black/20 border-purple-600/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-purple-600/30">
                    <SelectItem value="GO" className="text-white">GO Coin (1x ETH)</SelectItem>
                    <SelectItem value="SAGE" className="text-white">SAGE Coin (2x ETH)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={handleUSDCalculation}
              disabled={!usdAmount || isCalculating}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isCalculating ? "Calculating..." : "Calculate Token Amount"}
            </Button>
          </div>

          {/* Token to Token Prediction */}
          <div className="space-y-4 border-t border-purple-600/30 pt-6">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              AI Token Conversion Prediction
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-white">Amount</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={conversionAmount}
                  onChange={(e) => setConversionAmount(e.target.value)}
                  className="bg-black/20 border-purple-600/30 text-white"
                />
              </div>
              <div>
                <Label className="text-white">From Token</Label>
                <Select value={fromToken} onValueChange={(value: 'GO' | 'SAGE') => setFromToken(value)}>
                  <SelectTrigger className="bg-black/20 border-purple-600/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-purple-600/30">
                    <SelectItem value="GO" className="text-white">GO Coin</SelectItem>
                    <SelectItem value="SAGE" className="text-white">SAGE Coin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white">To Token</Label>
                <Select value={toToken} onValueChange={(value: 'GO' | 'SAGE') => setToToken(value)}>
                  <SelectTrigger className="bg-black/20 border-purple-600/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-purple-600/30">
                    <SelectItem value="GO" className="text-white">GO Coin</SelectItem>
                    <SelectItem value="SAGE" className="text-white">SAGE Coin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              onClick={handleTokenPrediction}
              disabled={!conversionAmount || isCalculating}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isCalculating ? "Predicting..." : "Generate AI Prediction"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Display */}
      {results && (
        <Card className="bg-black/40 border-green-800/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">AI Calculation Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.type === 'usd_calculation' && (
              <div className="space-y-4">
                <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
                  <h4 className="text-green-400 font-medium mb-2">Token Amount</h4>
                  <p className="text-white text-lg">{results.tokenAmount.toFixed(6)} {selectedToken}</p>
                  <p className="text-green-300 text-sm">{results.calculation}</p>
                </div>
              </div>
            )}
            
            {results.type === 'token_prediction' && (
              <div className="space-y-4">
                <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
                  <h4 className="text-blue-400 font-medium mb-2">AI Prediction</h4>
                  <p className="text-white text-lg">{results.convertedAmount.toFixed(6)} {toToken}</p>
                  <p className="text-blue-300 text-sm">{results.prediction}</p>
                  <Badge className="bg-blue-500/20 text-blue-400 mt-2">
                    Confidence: {(results.confidence * 100).toFixed(1)}%
                  </Badge>
                </div>
              </div>
            )}

            {/* Lending Rates */}
            {results.lendingRates && (
              <div className="bg-purple-900/20 border border-purple-600/30 rounded-lg p-4">
                <h4 className="text-purple-400 font-medium mb-3">AI Lending Analysis</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-green-400 text-sm">Lending APY</p>
                    <p className="text-white font-semibold">{results.lendingRates.lendingAPY.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-red-400 text-sm">Borrowing APY</p>
                    <p className="text-white font-semibold">{results.lendingRates.borrowingAPY.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-yellow-400 text-sm">Collateral Ratio</p>
                    <p className="text-white font-semibold">{results.lendingRates.collateralRatio}%</p>
                  </div>
                  <div>
                    <p className="text-orange-400 text-sm">Liquidation Threshold</p>
                    <p className="text-white font-semibold">{results.lendingRates.liquidationThreshold}%</p>
                  </div>
                </div>
                <div className="mt-3 p-3 bg-purple-800/20 rounded border border-purple-500/30">
                  <p className="text-purple-300 text-sm flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5" />
                    {results.lendingRates.aiRecommendation}
                  </p>
                </div>
              </div>
            )}

            {/* Market Simulation */}
            {results.marketSimulation && (
              <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
                <h4 className="text-yellow-400 font-medium mb-3">Market Scenario Analysis</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-green-400 text-sm">Bull Market</p>
                    <p className="text-white font-semibold">${results.marketSimulation.bullishScenario.toFixed(2)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-blue-400 text-sm">Neutral</p>
                    <p className="text-white font-semibold">${results.marketSimulation.neutralScenario.toFixed(2)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-red-400 text-sm">Bear Market</p>
                    <p className="text-white font-semibold">${results.marketSimulation.bearishScenario.toFixed(2)}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <Badge variant="outline" className={`${
                    results.marketSimulation.riskScore > 0.7 ? 'border-red-500 text-red-400' :
                    results.marketSimulation.riskScore > 0.5 ? 'border-yellow-500 text-yellow-400' :
                    'border-green-500 text-green-400'
                  }`}>
                    Risk Score: {(results.marketSimulation.riskScore * 100).toFixed(0)}%
                  </Badge>
                </div>
                <p className="text-yellow-300 text-sm mt-2">{results.marketSimulation.aiInsight}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Predictions */}
      {predictions.length > 0 && (
        <Card className="bg-black/40 border-blue-800/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white text-lg">Recent AI Predictions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {predictions.slice(-3).map((prediction) => (
                <div key={prediction.id} className="bg-blue-900/20 border border-blue-600/30 rounded p-3">
                  <p className="text-blue-300 text-sm">{prediction.prediction}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {prediction.timestamp.toLocaleTimeString()} - Confidence: {(prediction.confidence * 100).toFixed(1)}%
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AITokenCalculator;
