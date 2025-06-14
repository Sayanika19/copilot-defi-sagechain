
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { WalletData } from "./WalletConnector";
import { useBlockchainData } from "@/hooks/useBlockchainData";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const chartConfig = {
  eth: {
    label: "ETH",
    color: "hsl(260, 100%, 80%)",
  },
  usdc: {
    label: "USDC", 
    color: "hsl(200, 100%, 70%)",
  },
  aave: {
    label: "AAVE",
    color: "hsl(280, 100%, 70%)",
  },
  other: {
    label: "Other",
    color: "hsl(320, 100%, 70%)",
  },
};

interface AssetAllocationChartProps {
  walletData?: WalletData | null;
  isConnected: boolean;
}

interface TokenData {
  symbol: string;
  name: string;
  balance: string;
  price_usd: string;
  value_usd: string;
}

const AssetAllocationChart = ({ walletData, isConnected }: AssetAllocationChartProps) => {
  const { data, isLoading, fetchBlockchainData } = useBlockchainData();
  const [allocationData, setAllocationData] = useState<any[]>([]);

  // Fetch real blockchain data when wallet is connected
  useEffect(() => {
    if (isConnected && walletData?.address) {
      console.log('Fetching tokens for wallet:', walletData.address);
      fetchBlockchainData(walletData.address, 'tokens', 'ethereum');
    }
  }, [isConnected, walletData?.address, fetchBlockchainData]);

  // Process real blockchain data into allocation chart format
  useEffect(() => {
    if (!isConnected || !data.tokens?.tokens) {
      // Default mock data when no wallet connected
      setAllocationData([
        { name: "ETH", value: 45, color: "hsl(260, 100%, 80%)" },
        { name: "USDC", value: 30, color: "hsl(200, 100%, 70%)" },
        { name: "AAVE", value: 15, color: "hsl(280, 100%, 70%)" },
        { name: "Other", value: 10, color: "hsl(320, 100%, 70%)" },
      ]);
      return;
    }

    const tokens: TokenData[] = data.tokens.tokens;
    console.log('Processing tokens:', tokens);
    
    // Calculate total portfolio value
    const totalValue = tokens.reduce((sum, token) => sum + parseFloat(token.value_usd), 0);
    
    if (totalValue === 0) {
      setAllocationData([]);
      return;
    }
    
    // Calculate allocation percentages
    const allocations = tokens.map(token => {
      const percentage = (parseFloat(token.value_usd) / totalValue) * 100;
      let color = "hsl(320, 100%, 70%)"; // default color for "other"
      
      // Map known tokens to their colors
      switch (token.symbol.toUpperCase()) {
        case 'ETH':
        case 'WETH':
          color = "hsl(260, 100%, 80%)";
          break;
        case 'USDC':
        case 'USDT':
          color = "hsl(200, 100%, 70%)";
          break;
        case 'AAVE':
          color = "hsl(280, 100%, 70%)";
          break;
      }
      
      return {
        name: token.symbol.toUpperCase(),
        value: Math.round(percentage * 100) / 100, // Round to 2 decimal places
        color: color,
        valueUsd: parseFloat(token.value_usd)
      };
    });
    
    // Sort by value descending and filter out very small allocations
    const filteredAllocations = allocations
      .filter(allocation => allocation.value >= 1) // Only show allocations >= 1%
      .sort((a, b) => b.value - a.value);
    
    // Group small allocations into "Other" if needed
    const smallAllocations = allocations.filter(allocation => allocation.value < 1);
    if (smallAllocations.length > 0) {
      const otherValue = smallAllocations.reduce((sum, allocation) => sum + allocation.value, 0);
      if (otherValue > 0) {
        filteredAllocations.push({
          name: "Other",
          value: Math.round(otherValue * 100) / 100,
          color: "hsl(320, 100%, 70%)",
          valueUsd: smallAllocations.reduce((sum, allocation) => sum + allocation.valueUsd, 0)
        });
      }
    }
    
    setAllocationData(filteredAllocations);
  }, [data.tokens, isConnected]);

  return (
    <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white">
          Asset Allocation
          {isConnected && walletData && (
            <span className="block text-sm font-normal text-purple-300 mt-1">
              Real-time data from: {walletData.address.slice(0, 6)}...{walletData.address.slice(-4)}
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && isConnected ? (
          <div className="h-[300px] w-full flex items-center justify-center">
            <div className="flex flex-col items-center space-y-2">
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              <p className="text-purple-300 text-sm">Loading real-time data...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="h-[300px] w-full">
              <ChartContainer config={chartConfig} className="h-full w-full">
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value, name) => [
                      `${value}%${allocationData.find(item => item.name === name)?.valueUsd ? ` ($${allocationData.find(item => item.name === name)?.valueUsd.toLocaleString()})` : ''}`, 
                      name
                    ]}
                  />
                </PieChart>
              </ChartContainer>
            </div>
            
            {/* Legend */}
            <div className="grid grid-cols-2 gap-4 mt-6">
              {allocationData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-purple-300 text-sm">
                    {item.name}: {item.value}%
                    {item.valueUsd && (
                      <span className="text-xs text-purple-400 ml-1">
                        (${item.valueUsd.toLocaleString()})
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
        
        {!isConnected && (
          <div className="text-center mt-4 p-3 bg-purple-900/20 rounded-lg border border-purple-800/30">
            <p className="text-purple-300 text-sm">Connect your wallet to see real-time allocation data</p>
          </div>
        )}
        
        {isConnected && !isLoading && allocationData.length === 0 && (
          <div className="text-center mt-4 p-3 bg-orange-900/20 rounded-lg border border-orange-800/30">
            <p className="text-orange-300 text-sm">No tokens found in wallet or unable to fetch data</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssetAllocationChart;
