
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Shield, Brain, AlertTriangle, TrendingUp } from 'lucide-react';
import { collateralAI, CollateralRequest } from '@/services/collateralAI';
import { useToast } from '@/hooks/use-toast';

interface CollateralBorrowCalculatorProps {
  onBorrowCalculated?: (result: any) => void;
}

const CollateralBorrowCalculator = ({ onBorrowCalculated }: CollateralBorrowCalculatorProps) => {
  const [collateralToken, setCollateralToken] = useState<'GO' | 'SAGE' | 'ETH'>('ETH');
  const [collateralAmount, setCollateralAmount] = useState('');
  const [borrowToken, setBorrowToken] = useState<'GO' | 'SAGE'>('GO');
  const [prediction, setPrediction] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (collateralAmount && parseFloat(collateralAmount) > 0) {
      calculateBorrowAmount();
    } else {
      setPrediction(null);
    }
  }, [collateralToken, collateralAmount, borrowToken]);

  const calculateBorrowAmount = async () => {
    if (!collateralAmount || parseFloat(collateralAmount) <= 0) return;

    setIsCalculating(true);
    try {
      const request: CollateralRequest = {
        collateralToken,
        collateralAmount: parseFloat(collateralAmount),
        borrowToken
      };

      const result = collateralAI.predictBorrowAmount(request);
      setPrediction(result);
      onBorrowCalculated?.(result);

      toast({
        title: "AI Prediction Complete",
        description: `You can safely borrow up to ${result.recommendedBorrowAmount.toFixed(4)} ${borrowToken}`,
      });
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "Failed to calculate borrow amount",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const getRiskColor = (healthFactor: number) => {
    if (healthFactor > 2) return 'text-green-400 border-green-500';
    if (healthFactor > 1.5) return 'text-blue-400 border-blue-500';
    if (healthFactor > 1.2) return 'text-yellow-400 border-yellow-500';
    return 'text-red-400 border-red-500';
  };

  return (
    <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          AI Collateral-Based Borrowing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Collateral Input */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-green-400" />
            Collateral Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-white">Collateral Token</Label>
              <Select value={collateralToken} onValueChange={(value: 'GO' | 'SAGE' | 'ETH') => setCollateralToken(value)}>
                <SelectTrigger className="bg-black/20 border-purple-600/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-purple-600/30">
                  <SelectItem value="ETH" className="text-white">ETH (Ethereum)</SelectItem>
                  <SelectItem value="GO" className="text-white">GO Coin (1x ETH)</SelectItem>
                  <SelectItem value="SAGE" className="text-white">SAGE Coin (2x ETH)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-white">Collateral Amount</Label>
              <Input
                type="number"
                placeholder="Enter collateral amount"
                value={collateralAmount}
                onChange={(e) => setCollateralAmount(e.target.value)}
                className="bg-black/20 border-purple-600/30 text-white"
              />
            </div>
          </div>
        </div>

        {/* Borrow Token Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            Borrow Token
          </h3>
          <div>
            <Label className="text-white">Token to Borrow</Label>
            <Select value={borrowToken} onValueChange={(value: 'GO' | 'SAGE') => setBorrowToken(value)}>
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

        {/* AI Prediction Results */}
        {prediction && (
          <div className="space-y-4 border-t border-purple-600/30 pt-6">
            <h3 className="text-lg font-semibold text-white">AI Borrowing Prediction</h3>
            
            {/* Key Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-4">
                <h4 className="text-green-400 font-medium mb-2">Recommended Borrow</h4>
                <p className="text-white text-xl font-bold">{prediction.recommendedBorrowAmount.toFixed(4)} {borrowToken}</p>
                <p className="text-green-300 text-sm">Safe amount with buffer</p>
              </div>
              
              <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
                <h4 className="text-blue-400 font-medium mb-2">Maximum Borrow</h4>
                <p className="text-white text-xl font-bold">{prediction.maxBorrowAmount.toFixed(4)} {borrowToken}</p>
                <p className="text-blue-300 text-sm">Liquidation threshold</p>
              </div>
            </div>

            {/* Risk Assessment */}
            <div className="bg-purple-900/20 border border-purple-600/30 rounded-lg p-4">
              <h4 className="text-purple-400 font-medium mb-3">Risk Assessment</h4>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-purple-300 text-sm">Health Factor</p>
                  <Badge className={`${getRiskColor(prediction.healthFactor)} font-semibold`}>
                    {prediction.healthFactor.toFixed(2)}
                  </Badge>
                </div>
                <div>
                  <p className="text-purple-300 text-sm">Collateral Ratio</p>
                  <p className="text-white font-semibold">{prediction.collateralRatio.toFixed(0)}%</p>
                </div>
                <div>
                  <p className="text-purple-300 text-sm">Liquidation Price</p>
                  <p className="text-white font-semibold">${prediction.liquidationPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* AI Recommendation */}
            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
              <h4 className="text-yellow-400 font-medium mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                AI Recommendation
              </h4>
              <p className="text-yellow-300 text-sm">{prediction.aiRecommendation}</p>
            </div>
          </div>
        )}

        {isCalculating && (
          <div className="text-center py-4">
            <div className="text-purple-300">Calculating optimal borrow amount...</div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CollateralBorrowCalculator;
