
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface SimulationGraphProps {
  simulationResult: any;
}

const SimulationGraph = ({ simulationResult }: SimulationGraphProps) => {
  // Generate simulation data based on the result
  const generateSimulationData = () => {
    if (!simulationResult) return [];

    const baseValue = parseFloat(simulationResult.estimatedOutput.replace(/[^\d.]/g, '')) || 100;
    const data = [];
    
    // Generate 24 data points (hourly simulation for a day)
    for (let i = 0; i < 24; i++) {
      const variance = (Math.random() - 0.5) * 0.1; // ±5% variance
      const value = baseValue * (1 + variance);
      
      data.push({
        time: `${i.toString().padStart(2, '0')}:00`,
        value: parseFloat(value.toFixed(4)),
        priceImpact: simulationResult.priceImpact ? parseFloat(simulationResult.priceImpact.replace('%', '')) : 0,
      });
    }
    
    return data;
  };

  const simulationData = generateSimulationData();

  if (!simulationResult || simulationData.length === 0) {
    return null;
  }

  return (
    <Card className="bg-black/40 border-blue-800/30 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Real-Time Simulation Graph
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={simulationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => `${value.toFixed(2)}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#FFFFFF'
                }}
                formatter={(value: any, name: string) => [
                  `${parseFloat(value).toFixed(4)}`,
                  name === 'value' ? 'Estimated Output' : name
                ]}
                labelFormatter={(label) => `Time: ${label}`}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-3 bg-slate-800/30 rounded-lg">
            <div className="text-sm text-blue-300">Average Value</div>
            <div className="text-lg font-semibold text-white">
              {(simulationData.reduce((sum, item) => sum + item.value, 0) / simulationData.length).toFixed(4)}
            </div>
          </div>
          
          <div className="p-3 bg-slate-800/30 rounded-lg">
            <div className="text-sm text-blue-300">Max Value</div>
            <div className="text-lg font-semibold text-white">
              {Math.max(...simulationData.map(item => item.value)).toFixed(4)}
            </div>
          </div>
          
          <div className="p-3 bg-slate-800/30 rounded-lg">
            <div className="text-sm text-blue-300">Min Value</div>
            <div className="text-lg font-semibold text-white">
              {Math.min(...simulationData.map(item => item.value)).toFixed(4)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulationGraph;
