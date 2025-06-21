
interface CollateralPrediction {
  maxBorrowAmount: number;
  liquidationPrice: number;
  healthFactor: number;
  collateralRatio: number;
  recommendedBorrowAmount: number;
  aiRecommendation: string;
}

interface CollateralRequest {
  collateralToken: 'GO' | 'SAGE' | 'ETH';
  collateralAmount: number;
  borrowToken: 'GO' | 'SAGE';
}

class CollateralAIService {
  private baseETHPrice = 2000;
  
  private getCurrentPrices() {
    return {
      goCoin: this.baseETHPrice,
      sageCoin: this.baseETHPrice * 2,
      eth: this.baseETHPrice
    };
  }

  private getLiquidationThresholds() {
    return {
      'GO': 0.75, // 75% LTV
      'SAGE': 0.70, // 70% LTV
      'ETH': 0.80 // 80% LTV
    };
  }

  predictBorrowAmount(request: CollateralRequest): CollateralPrediction {
    const prices = this.getCurrentPrices();
    const thresholds = this.getLiquidationThresholds();
    
    const collateralPrice = request.collateralToken === 'GO' ? prices.goCoin :
                          request.collateralToken === 'SAGE' ? prices.sageCoin : prices.eth;
    
    const borrowPrice = request.borrowToken === 'GO' ? prices.goCoin : prices.sageCoin;
    
    const collateralValue = request.collateralAmount * collateralPrice;
    const liquidationThreshold = thresholds[request.collateralToken];
    
    // Maximum borrow amount based on liquidation threshold
    const maxBorrowValue = collateralValue * liquidationThreshold;
    const maxBorrowAmount = maxBorrowValue / borrowPrice;
    
    // Recommended borrow amount (80% of max for safety)
    const recommendedBorrowAmount = maxBorrowAmount * 0.8;
    
    // Health factor calculation (>1 is safe, <1 is liquidation risk)
    const healthFactor = (collateralValue * liquidationThreshold) / (recommendedBorrowAmount * borrowPrice);
    
    // Liquidation price calculation
    const liquidationPrice = (recommendedBorrowAmount * borrowPrice) / (request.collateralAmount * liquidationThreshold);
    
    // Current collateral ratio
    const collateralRatio = (collateralValue / (recommendedBorrowAmount * borrowPrice)) * 100;
    
    // AI recommendation based on risk assessment
    let aiRecommendation = '';
    if (healthFactor > 2) {
      aiRecommendation = `Very safe position. You can potentially borrow more, but current amount provides excellent safety margin.`;
    } else if (healthFactor > 1.5) {
      aiRecommendation = `Good position with adequate safety margin. Monitor market conditions regularly.`;
    } else if (healthFactor > 1.2) {
      aiRecommendation = `Moderate risk position. Consider reducing borrow amount or adding more collateral.`;
    } else {
      aiRecommendation = `High risk position. Strongly recommend reducing borrow amount to avoid liquidation.`;
    }

    return {
      maxBorrowAmount,
      liquidationPrice,
      healthFactor,
      collateralRatio,
      recommendedBorrowAmount,
      aiRecommendation
    };
  }

  calculateLiquidationRisk(collateralValue: number, borrowValue: number, liquidationThreshold: number): {
    riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
    riskPercentage: number;
  } {
    const ratio = borrowValue / (collateralValue * liquidationThreshold);
    
    if (ratio < 0.5) return { riskLevel: 'Low', riskPercentage: ratio * 100 };
    if (ratio < 0.75) return { riskLevel: 'Medium', riskPercentage: ratio * 100 };
    if (ratio < 0.9) return { riskLevel: 'High', riskPercentage: ratio * 100 };
    return { riskLevel: 'Critical', riskPercentage: ratio * 100 };
  }
}

export const collateralAI = new CollateralAIService();
export type { CollateralPrediction, CollateralRequest };
