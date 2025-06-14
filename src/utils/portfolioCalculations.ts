
export interface TransactionData {
  timestamp: string;
  type: 'buy' | 'sell' | 'swap';
  amount: string;
  price_usd: string;
  from_token?: string;
  to_token?: string;
}

export interface HistoricalDataPoint {
  date: string;
  value: number;
  pnl: number;
  roi: number;
}

export interface PnLBreakdownData {
  period: string;
  pnl: number;
  percentage: number;
}

export const calculateRealPnLFromWallet = (
  transactions: TransactionData[],
  currentValue: number
) => {
  if (transactions.length === 0 || currentValue === 0) {
    return {
      totalPnL: 0,
      totalROI: 0,
      totalCostBasis: 0,
      totalSold: 0
    };
  }

  let totalCostBasis = 0;
  let totalSold = 0;

  // Calculate cost basis and realized gains from actual transactions
  transactions.forEach((tx) => {
    const amount = parseFloat(tx.amount || '0');
    const price = parseFloat(tx.price_usd || '0');
    const value = amount * price;

    if (tx.type === 'buy') {
      totalCostBasis += value;
    } else if (tx.type === 'sell') {
      totalSold += value;
      // When selling, reduce cost basis proportionally
      totalCostBasis = Math.max(0, totalCostBasis - (value * 0.8)); // Assume 80% cost recovery
    } else if (tx.type === 'swap') {
      // For swaps, treat as neutral for cost basis
      // Just track the value movement
    }
  });

  // P&L = Current Value + Realized Gains - Total Cost Basis
  const realizedPnL = totalSold - (totalSold > 0 ? totalCostBasis * 0.2 : 0); // Estimated realized gains
  const unrealizedPnL = currentValue - (totalCostBasis > totalSold ? totalCostBasis - totalSold : 0);
  const totalPnL = realizedPnL + unrealizedPnL;
  
  // Calculate ROI based on actual investment
  const totalInvested = totalCostBasis > 0 ? totalCostBasis : currentValue;
  const totalROI = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;

  return {
    totalPnL,
    totalROI,
    totalCostBasis: totalInvested,
    totalSold
  };
};

export const calculateAPYFromTransactions = (
  transactions: TransactionData[],
  totalROI: number
): number => {
  if (transactions.length === 0 || totalROI === 0) return 0;

  // Get the first transaction date to calculate time period
  const sortedTx = [...transactions].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const firstTxDate = new Date(sortedTx[0].timestamp);
  const now = new Date();
  const daysDifference = Math.max(1, (now.getTime() - firstTxDate.getTime()) / (1000 * 60 * 60 * 24));
  const yearsDifference = daysDifference / 365;

  // Calculate APY: ((1 + total_return) ^ (1/years)) - 1
  const totalReturn = totalROI / 100;
  const apy = ((Math.pow(1 + totalReturn, 1 / yearsDifference)) - 1) * 100;

  // Cap APY at reasonable values to avoid extreme numbers
  return Math.max(-95, Math.min(apy, 1000));
};

export const generateHistoricalFromRealData = (
  transactions: TransactionData[], 
  currentValue: number, 
  totalCostBasis: number
): HistoricalDataPoint[] => {
  if (transactions.length === 0) return [];

  const sortedTx = [...transactions].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const points = [];
  const startDate = new Date(sortedTx[0].timestamp);
  const endDate = new Date();
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  for (let i = 0; i <= Math.min(daysDiff, 30); i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    // Get transactions up to this date
    const txUpToDate = sortedTx.filter(tx => new Date(tx.timestamp) <= date);
    
    let costAtDate = 0;
    let soldAtDate = 0;
    
    txUpToDate.forEach(tx => {
      const value = parseFloat(tx.amount || '0') * parseFloat(tx.price_usd || '0');
      if (tx.type === 'buy') {
        costAtDate += value;
      } else if (tx.type === 'sell') {
        soldAtDate += value;
      }
    });

    // Estimate portfolio value at this date
    const progressRatio = i / Math.min(daysDiff, 30);
    const estimatedValue = costAtDate + (currentValue - totalCostBasis) * progressRatio;
    const pnlAtDate = estimatedValue - costAtDate + soldAtDate;

    points.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(Math.max(estimatedValue, costAtDate * 0.5)),
      pnl: Math.round(pnlAtDate),
      roi: costAtDate > 0 ? (pnlAtDate / costAtDate) * 100 : 0
    });
  }

  return points;
};

export const generateRealPnLBreakdown = (
  transactions: TransactionData[], 
  currentValue: number, 
  totalCostBasis: number
): PnLBreakdownData[] => {
  const now = new Date();
  const periods = [
    { period: 'Today', days: 1 },
    { period: '7D', days: 7 },
    { period: '30D', days: 30 },
    { period: '90D', days: 90 },
    { period: '1Y', days: 365 }
  ];

  return periods.map(({ period, days }) => {
    const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const recentTx = transactions.filter((tx) => new Date(tx.timestamp) >= cutoffDate);
    
    let periodCost = 0;
    let periodSold = 0;

    recentTx.forEach((tx) => {
      const value = parseFloat(tx.amount || '0') * parseFloat(tx.price_usd || '0');
      if (tx.type === 'buy') {
        periodCost += value;
      } else if (tx.type === 'sell') {
        periodSold += value;
      }
    });

    // Calculate period P&L based on actual transactions and current value
    const periodRatio = recentTx.length / Math.max(transactions.length, 1);
    const estimatedPeriodValue = currentValue * periodRatio;
    const periodPnL = estimatedPeriodValue - periodCost + periodSold;

    return {
      period,
      pnl: periodPnL,
      percentage: totalCostBasis > 0 ? (periodPnL / totalCostBasis) * 100 : 0
    };
  });
};
