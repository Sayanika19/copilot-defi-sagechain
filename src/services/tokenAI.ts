
interface TokenPrices {
  goCoin: number;
  sageCoin: number;
  eth: number;
}

interface PredictionRequest {
  fromToken: 'GO' | 'SAGE';
  toToken: 'GO' | 'SAGE';
  amount: number;
}

interface ValueCalculationRequest {
  usdAmount: number;
  targetToken: 'GO' | 'SAGE';
}

class TokenAIService {
  private baseETHPrice = 2000; // Mock ETH price in USD
  
  // GO coin = 1x ETH, SAGE coin = 2x GO coin (so 2x ETH)
  private getCurrentPrices(): TokenPrices {
    return {
      goCoin: this.baseETHPrice, // 1x ETH
      sageCoin: this.baseETHPrice * 2, // 2x ETH
      eth: this.baseETHPrice
    };
  }

  // Calculate token amount from USD input
  calculateTokenFromUSD(request: ValueCalculationRequest): {
    tokenAmount: number;
    tokenPrice: number;
    calculation: string;
  } {
    const prices = this.getCurrentPrices();
    const tokenPrice = request.targetToken === 'GO' ? prices.goCoin : prices.sageCoin;
    const tokenAmount = request.usdAmount / tokenPrice;
    
    return {
      tokenAmount,
      tokenPrice,
      calculation: `$${request.usdAmount} ÷ $${tokenPrice} = ${tokenAmount.toFixed(6)} ${request.targetToken}`
    };
  }

  // Predict token value conversion (GO to SAGE or SAGE to GO)
  predictTokenConversion(request: PredictionRequest): {
    convertedAmount: number;
    exchangeRate: number;
    prediction: string;
    confidence: number;
  } {
    const prices = this.getCurrentPrices();
    
    if (request.fromToken === request.toToken) {
      return {
        convertedAmount: request.amount,
        exchangeRate: 1,
        prediction: `Same token conversion: ${request.amount} ${request.fromToken}`,
        confidence: 1.0
      };
    }

    let exchangeRate: number;
    let convertedAmount: number;
    
    if (request.fromToken === 'GO' && request.toToken === 'SAGE') {
      // GO to SAGE: 1 GO = 0.5 SAGE (since SAGE is 2x GO)
      exchangeRate = 0.5;
      convertedAmount = request.amount * exchangeRate;
    } else {
      // SAGE to GO: 1 SAGE = 2 GO
      exchangeRate = 2;
      convertedAmount = request.amount * exchangeRate;
    }

    // Add some AI-like prediction variance
    const variance = 0.02; // 2% variance
    const predictionMultiplier = 1 + (Math.random() - 0.5) * variance;
    const predictedAmount = convertedAmount * predictionMultiplier;

    return {
      convertedAmount: predictedAmount,
      exchangeRate,
      prediction: `AI Prediction: ${request.amount} ${request.fromToken} ≈ ${predictedAmount.toFixed(6)} ${request.toToken}`,
      confidence: 0.95 - Math.abs(predictionMultiplier - 1) * 10
    };
  }

  // Calculate lending/borrowing rates based on token type and market conditions
  calculateLendingRates(token: 'GO' | 'SAGE', amount: number): {
    lendingAPY: number;
    borrowingAPY: number;
    collateralRatio: number;
    liquidationThreshold: number;
    aiRecommendation: string;
  } {
    const baseRates = {
      GO: { lendingAPY: 8.5, borrowingAPY: 12.0, collateralRatio: 150, liquidationThreshold: 130 },
      SAGE: { lendingAPY: 9.2, borrowingAPY: 13.5, collateralRatio: 140, liquidationThreshold: 125 }
    };

    const rates = baseRates[token];
    
    // AI adjustments based on amount (larger amounts get slightly better rates)
    const amountMultiplier = Math.min(1.2, 1 + (amount / 100000) * 0.2);
    const adjustedLendingAPY = rates.lendingAPY * amountMultiplier;
    const adjustedBorrowingAPY = rates.borrowingAPY / amountMultiplier;

    let recommendation = '';
    if (amount > 50000) {
      recommendation = `High-value position detected. Consider splitting into multiple positions for risk management.`;
    } else if (adjustedLendingAPY > 10) {
      recommendation = `Excellent lending opportunity with ${adjustedLendingAPY.toFixed(2)}% APY.`;
    } else if (token === 'SAGE') {
      recommendation = `SAGE offers premium rates due to higher volatility and utility value.`;
    } else {
      recommendation = `GO provides stable returns with lower risk profile.`;
    }

    return {
      lendingAPY: adjustedLendingAPY,
      borrowingAPY: adjustedBorrowingAPY,
      collateralRatio: rates.collateralRatio,
      liquidationThreshold: rates.liquidationThreshold,
      aiRecommendation: recommendation
    };
  }

  // Market simulation for risk assessment
  simulateMarketScenarios(token: 'GO' | 'SAGE', amount: number): {
    bullishScenario: number;
    bearishScenario: number;
    neutralScenario: number;
    riskScore: number;
    aiInsight: string;
  } {
    const prices = this.getCurrentPrices();
    const currentPrice = token === 'GO' ? prices.goCoin : prices.sageCoin;
    const currentValue = amount * currentPrice;

    // Market scenarios
    const bullishMultiplier = token === 'SAGE' ? 1.5 : 1.3; // SAGE more volatile
    const bearishMultiplier = token === 'SAGE' ? 0.6 : 0.7;
    const neutralMultiplier = token === 'SAGE' ? 1.1 : 1.05;

    const scenarios = {
      bullishScenario: currentValue * bullishMultiplier,
      bearishScenario: currentValue * bearishMultiplier,
      neutralScenario: currentValue * neutralMultiplier,
      riskScore: token === 'SAGE' ? 0.75 : 0.45, // Higher risk for SAGE
      aiInsight: token === 'SAGE' 
        ? 'SAGE shows higher volatility but greater upside potential. Suitable for risk-tolerant strategies.'
        : 'GO provides stable growth with lower downside risk. Ideal for conservative lending strategies.'
    };

    return scenarios;
  }
}

export const tokenAI = new TokenAIService();
export type { TokenPrices, PredictionRequest, ValueCalculationRequest };
