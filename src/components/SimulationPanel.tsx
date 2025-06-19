import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Zap, Play, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import SimulationEarningsChart from "@/components/SimulationEarningsChart";

const SimulationPanel = () => {
  const [amount, setAmount] = useState('');
  const [strategy, setStrategy] = useState('');
  const [duration, setDuration] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const { toast } = useToast();

  const strategies = [
    { value: 'conservative', label: 'Conservative DeFi (5-8% APY)', apy: 6.5 },
    { value: 'moderate', label: 'Moderate Risk (8-15% APY)', apy: 12 },
    { value: 'aggressive', label: 'High Yield (15-25% APY)', apy: 20 },
    { value: 'liquidity_mining', label: 'Liquidity Mining (20-40% APY)', apy: 30 },
    { value: 'yield_farming', label: 'Yield Farming (25-50% APY)', apy: 37.5 },
  ];

  const durations = [
    { value: '1', label: '1 Month' },
    { value: '3', label: '3 Months' },
    { value: '6', label: '6 Months' },
    { value: '12', label: '1 Year' },
    { value: '24', label: '2 Years' },
  ];

  const runSimulation = () => {
    if (!amount || !strategy || !duration) {
      toast({
        title: "Missing Information",
        description: "Please fill in all simulation parameters",
        variant: "destructive",
      });
      return;
    }

    setIsSimulating(true);
    
    // Simulate processing time
    setTimeout(() => {
      const selectedStrategy = strategies.find(s => s.value === strategy);
      const initialAmount = parseFloat(amount);
      const months = parseInt(duration);
      const apy = selectedStrategy?.apy || 10;
      
      // Calculate compound interest
      const monthlyRate = apy / 100 / 12;
      const finalAmount = initialAmount * Math.pow(1 + monthlyRate, months);
      const totalReturn = finalAmount - initialAmount;
      const totalReturnPercentage = (totalReturn / initialAmount) * 100;
      
      // Add some market risk simulation
      const riskFactor = strategy === 'conservative' ? 0.95 : strategy === 'aggressive' ? 1.1 : 1.0;
      const adjustedReturn = totalReturn * riskFactor;
      const adjustedFinalAmount = initialAmount + adjustedReturn;
      
      setSimulationResults({
        initialAmount,
        finalAmount: adjustedFinalAmount,
        totalReturn: adjustedReturn,
        totalReturnPercentage: (adjustedReturn / initialAmount) * 100,
        strategy: selectedStrategy?.label || strategy,
        apy: apy,
        duration: months,
        riskLevel: strategy === 'conservative' ? 'Low' : strategy === 'aggressive' ? 'High' : 'Medium'
      });
      
      setIsSimulating(false);
      toast({
        title: "Simulation Complete",
        description: "Your DeFi strategy simulation is ready!",
      });
    }, 2000);
  };

  const resetSimulation = () => {
    setAmount('');
    setStrategy('');
    setDuration('');
    setSimulationResults(null);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            DeFi Simulation Lab
          </CardTitle>
          <CardDescription className="text-purple-300">
            Simulate different DeFi strategies and see projected returns with real market data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-purple-300">Investment Amount (USD)</Label>
              <Input
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 10000"
                className="bg-slate-800/50 border-purple-800/30 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-purple-300">DeFi Strategy</Label>
              <Select value={strategy} onValueChange={setStrategy}>
                <SelectTrigger className="bg-slate-800/50 border-purple-800/30 text-white">
                  <SelectValue placeholder="Select strategy" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-purple-800/30">
                  {strategies.map((strat) => (
                    <SelectItem key={strat.value} value={strat.value} className="text-white">
                      {strat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-purple-300">Duration</Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="bg-slate-800/50 border-purple-800/30 text-white">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-purple-800/30">
                  {durations.map((dur) => (
                    <SelectItem key={dur.value} value={dur.value} className="text-white">
                      {dur.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              onClick={runSimulation}
              disabled={isSimulating}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Play className="w-4 h-4 mr-2" />
              {isSimulating ? 'Simulating...' : 'Run Simulation'}
            </Button>
            <Button
              onClick={resetSimulation}
              variant="outline"
              className="border-purple-600 text-purple-400 hover:bg-purple-600/10"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {simulationResults && (
        <SimulationEarningsChart
          initialAmount={simulationResults.initialAmount}
          strategy={simulationResults.strategy}
          apy={simulationResults.apy}
        />
      )}

      {simulationResults && (
        <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white">Simulation Results</CardTitle>
            <CardDescription className="text-purple-300">
              Summary of your DeFi strategy simulation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-purple-300">Strategy</h4>
                <p className="text-white">{simulationResults.strategy}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-purple-300">Risk Level</h4>
                <p className="text-white">{simulationResults.riskLevel}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-purple-300">Initial Investment</h4>
                <p className="text-white">${simulationResults.initialAmount.toLocaleString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-purple-300">Projected Return</h4>
                <p className="text-white">
                  ${simulationResults.totalReturn.toLocaleString()} ({simulationResults.totalReturnPercentage.toFixed(2)}%)
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-purple-300">Final Amount</h4>
                <p className="text-white">${simulationResults.finalAmount.toLocaleString()}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-purple-300">Duration</h4>
                <p className="text-white">{duration} Months</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SimulationPanel;
