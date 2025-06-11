
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Brain, TrendingUp, Shield, Zap, BookOpen } from "lucide-react";
import AIChat from "@/components/AIChat";
import PortfolioOverview from "@/components/PortfolioOverview";
import SimulationPanel from "@/components/SimulationPanel";
import WalletConnector from "@/components/WalletConnector";

const Index = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('portfolio');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-800/30 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">SageChain</h1>
                <p className="text-sm text-purple-300">AI-Powered DeFi Copilot</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Multi-Chain Active
              </Badge>
              <WalletConnector 
                isConnected={isWalletConnected} 
                onConnect={() => setIsWalletConnected(true)} 
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-3">
            {/* Navigation Tabs */}
            <div className="flex space-x-1 mb-8 bg-black/20 backdrop-blur-xl rounded-lg p-1">
              {[
                { id: 'portfolio', label: 'Portfolio', icon: TrendingUp },
                { id: 'simulate', label: 'Simulate', icon: Zap },
                { id: 'learn', label: 'Learn', icon: BookOpen },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-md transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                      : 'text-purple-300 hover:text-white hover:bg-purple-800/30'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'portfolio' && <PortfolioOverview isConnected={isWalletConnected} />}
            {activeTab === 'simulate' && <SimulationPanel />}
            {activeTab === 'learn' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-purple-400" />
                      DeFi Basics
                    </CardTitle>
                    <CardDescription className="text-purple-300">
                      Learn the fundamentals of decentralized finance
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-purple-900/30 rounded-lg">
                        <h4 className="text-white font-medium">What is DeFi?</h4>
                        <p className="text-sm text-purple-300 mt-1">
                          Decentralized Finance reimagines traditional banking on blockchain
                        </p>
                      </div>
                      <div className="p-3 bg-blue-900/30 rounded-lg">
                        <h4 className="text-white font-medium">Yield Farming</h4>
                        <p className="text-sm text-blue-300 mt-1">
                          Earn rewards by providing liquidity to protocols
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-400" />
                      Security Guide
                    </CardTitle>
                    <CardDescription className="text-purple-300">
                      Best practices for safe DeFi interactions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 bg-green-900/30 rounded-lg">
                        <h4 className="text-white font-medium">Wallet Security</h4>
                        <p className="text-sm text-green-300 mt-1">
                          Always verify contract addresses and use hardware wallets
                        </p>
                      </div>
                      <div className="p-3 bg-orange-900/30 rounded-lg">
                        <h4 className="text-white font-medium">Smart Contract Risk</h4>
                        <p className="text-sm text-orange-300 mt-1">
                          Understand audit reports and protocol risks
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* AI Chat Sidebar */}
          <div className="xl:col-span-1">
            <AIChat />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
