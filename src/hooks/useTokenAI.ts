
import { useState, useCallback } from 'react';
import { tokenAI, PredictionRequest, ValueCalculationRequest } from '@/services/tokenAI';
import { useToast } from '@/hooks/use-toast';

export const useTokenAI = () => {
  const [isCalculating, setIsCalculating] = useState(false);
  const [predictions, setPredictions] = useState<any[]>([]);
  const { toast } = useToast();

  const calculateTokenFromUSD = useCallback(async (request: ValueCalculationRequest) => {
    setIsCalculating(true);
    try {
      const result = tokenAI.calculateTokenFromUSD(request);
      toast({
        title: "AI Calculation Complete",
        description: result.calculation,
      });
      return result;
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "Failed to calculate token value",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsCalculating(false);
    }
  }, [toast]);

  const predictTokenConversion = useCallback(async (request: PredictionRequest) => {
    setIsCalculating(true);
    try {
      const result = tokenAI.predictTokenConversion(request);
      setPredictions(prev => [...prev, {
        id: Date.now(),
        timestamp: new Date(),
        ...result
      }]);
      
      toast({
        title: "AI Prediction Generated",
        description: `${result.prediction} (Confidence: ${(result.confidence * 100).toFixed(1)}%)`,
      });
      
      return result;
    } catch (error) {
      toast({
        title: "Prediction Error",
        description: "Failed to generate prediction",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsCalculating(false);
    }
  }, [toast]);

  const calculateLendingRates = useCallback((token: 'GO' | 'SAGE', amount: number) => {
    try {
      return tokenAI.calculateLendingRates(token, amount);
    } catch (error) {
      toast({
        title: "Rate Calculation Error",
        description: "Failed to calculate lending rates",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  const simulateMarketScenarios = useCallback((token: 'GO' | 'SAGE', amount: number) => {
    try {
      return tokenAI.simulateMarketScenarios(token, amount);
    } catch (error) {
      toast({
        title: "Simulation Error",
        description: "Failed to simulate market scenarios",
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  const clearPredictions = useCallback(() => {
    setPredictions([]);
  }, []);

  return {
    isCalculating,
    predictions,
    calculateTokenFromUSD,
    predictTokenConversion,
    calculateLendingRates,
    simulateMarketScenarios,
    clearPredictions
  };
};
