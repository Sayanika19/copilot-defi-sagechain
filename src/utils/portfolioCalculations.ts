
export interface TransactionData {
  timestamp: string;
  type: 'buy' | 'sell';
  amount: string;
  price_usd: string;
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

  transactions.forEach((tx) => {
    const amount = parseFloat(tx.amount || '0');
    const price = parseFloat(tx.price_usd || '0');
    const value = amount * price;

    if (tx.type === 'buy') {
      totalCostBasis += value;
    } else if (tx.type === 'sell') {
      totalSold += value;
    }
  });

  const realizedPnL = totalSold - totalCostBasis;
  const unrealizedPnL = currentValue - (totalCostBasis - totalSold);
  const totalPnL = realizedPnL + unrealizedPnL;
  const totalROI = totalCostBasis > 0 ? ((currentValue + totalSold - totalCostBasis) / totalCostBasis) * 100 : 0;

  return {
    totalPnL,
    totalROI,
    totalCostBasis,
    totalSold
  };
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

    const txUpToDate = sortedTx.filter(tx => new Date(tx.timestamp) <= date);
    
    let costAtDate = 0;
    txUpToDate.forEach(tx => {
      if (tx.type === 'buy') {
        costAtDate += parseFloat(tx.amount || '0') * parseFloat(tx.price_usd || '0');
      }
    });

    const progressRatio = i / Math.min(daysDiff, 30);
    const estimatedValue = costAtDate + (currentValue - totalCostBasis) * progressRatio;
    const pnlAtDate = estimatedValue - costAtDate;

    points.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(Math.max(estimatedValue, costAtDate * 0.8)),
      pnl: Math.round(pnlAtDate),
      roi: costAtDate > 0 ? ((estimatedValue - costAtDate) / costAtDate) * 100 : 0
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

    const periodRatio = Math.min(days / 365, 1);
    const estimatedPeriodValue = currentValue * periodRatio;
    const periodPnL = estimatedPeriodValue - periodCost + periodSold;

    return {
      period,
      pnl: periodPnL,
      percentage: totalCostBasis > 0 ? (periodPnL / totalCostBasis) * 100 : 0
    };
  });
};
