import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Brain, TrendingUp, Shield, Zap, BookOpen, Settings, BarChart3, MessageSquare, ArrowLeft, Bell, ArrowUpDown, DollarSign } from "lucide-react";
import AIChat from "@/components/AIChat";
import PortfolioOverview from "@/components/PortfolioOverview";
import SimulationPanel from "@/components/SimulationPanel";
import WalletConnector, { WalletData } from "@/components/WalletConnector";
import Dashboard from "@/components/Dashboard";
import EducationHub from "@/components/EducationHub";
import SettingsPanel from "@/components/SettingsPanel";
import CryptoTrading from "@/components/CryptoTrading";
import BorrowingLending from "@/components/BorrowingLending";
import FeatureCallout from "@/components/FeatureCallout";

const Index = () => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  const handleWalletConnect = (data: WalletData) => {
    console.log('Wallet connected:', data);
    setIsWalletConnected(true);
    setWalletData(data);
  };

  const handleWalletDisconnect = () => {
    console.log('Wallet disconnected in Index');
    setIsWalletConnected(false);
    setWalletData(null);
  };

  // Force re-render when wallet state changes
  useEffect(() => {
    console.log('Wallet state changed:', { isWalletConnected, walletData });
  }, [isWalletConnected, walletData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-purple-800/30 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden">
                  <img 
                    src="/lovable-uploads/819d1bc0-5b06-442d-ad39-cd9dedeee874.png" 
                    alt="SageChain Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">SageChain</h1>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="text-purple-300 hover:text-white relative">
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">2</span>
                </div>
              </Button>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                Multi-Chain
              </Badge>
              <WalletConnector 
                isConnected={isWalletConnected} 
                onConnect={handleWalletConnect}
                onDisconnect={handleWalletDisconnect}
              />
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="mt-6">
            <FeatureCallout
              title="Comprehensive DeFi Platform Navigation"
              description="Access all DeFi tools in one place: AI-powered insights, real-time portfolio tracking, advanced trading, lending protocols, risk-free simulations, educational resources, and personalized settings."
              variant="info"
              className="mb-4"
            />
            
            <div className="bg-black/20 backdrop-blur-xl rounded-lg p-2">
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-wrap gap-2">
                {[
                  { id: 'aichat', label: 'AI Chat', icon: MessageSquare, description: 'AI-powered DeFi assistant' },
                  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, description: 'Comprehensive overview' },
                  { id: 'trading', label: 'Trading', icon: ArrowUpDown, description: 'Advanced trading tools' },
                  { id: 'borrowing', label: 'Lending', icon: DollarSign, description: 'Lending & borrowing' },
                  { id: 'simulate', label: 'Simulation', icon: Zap, description: 'Risk-free testing' },
                  { id: 'portfolio', label: 'Portfolio', icon: TrendingUp, description: 'Portfolio analytics' },
                  { id: 'education', label: 'Education', icon: BookOpen, description: 'Learning resources' },
                  { id: 'settings', label: 'Settings', icon: Settings, description: 'Platform preferences' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-center space-x-2 px-3 py-3 rounded-md transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                        : 'text-purple-300 hover:text-white hover:bg-purple-800/30'
                    }`}
                    title={tab.description}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Full Width AI Chat Mode */}
        {activeTab === 'aichat' ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('dashboard')}
                className="text-purple-300 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>
            
            <FeatureCallout
              title="Full-Screen AI Assistant"
              description="Advanced AI chat interface with real-time wallet integration, comprehensive DeFi analysis, trading recommendations, risk assessment, and personalized financial insights."
              variant="success"
              defaultExpanded={true}
            />
            
            <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-purple-400" />
                  AI Chat Assistant - Full Mode
                </CardTitle>
                <CardDescription className="text-purple-300">
                  Full-screen AI assistant for detailed DeFi insights and trading recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AIChat walletData={walletData} />
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Regular Layout with Sidebar */
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="xl:col-span-3">
              {activeTab === 'dashboard' && (
                <>
                  <FeatureCallout
                    title="Comprehensive Dashboard"
                    description="Real-time overview of your DeFi portfolio with market insights, performance metrics, recent transactions, and AI-powered recommendations for optimal trading strategies."
                    variant="success"
                    className="mb-6"
                  />
                  <Dashboard isConnected={isWalletConnected} walletData={walletData} />
                </>
              )}
              {activeTab === 'portfolio' && (
                <>
                  <FeatureCallout
                    title="Advanced Portfolio Analytics"
                    description="Deep dive into your portfolio performance with asset allocation, risk analysis, historical performance tracking, and automated rebalancing suggestions."
                    variant="info"
                    className="mb-6"
                  />
                  <PortfolioOverview isConnected={isWalletConnected} walletData={walletData} />
                </>
              )}
              {activeTab === 'trading' && (
                <>
                  <FeatureCallout
                    title="Professional Trading Suite"
                    description="Advanced trading interface with multi-DEX integration, limit orders, automated strategies, technical analysis tools, and real-time market data feeds."
                    variant="warning"
                    className="mb-6"
                  />
                  <CryptoTrading walletData={walletData} />
                </>
              )}
              {activeTab === 'borrowing' && (
                <>
                  <FeatureCallout
                    title="Lending & Borrowing Platform"
                    description="Access decentralized lending protocols with competitive rates, collateral management, liquidation protection, and yield optimization strategies."
                    variant="success"
                    className="mb-6"
                  />
                  <BorrowingLending />
                </>
              )}
              {activeTab === 'simulate' && (
                <>
                  <FeatureCallout
                    title="Advanced Simulation Laboratory"
                    description="Risk-free testing environment for DeFi strategies including token swaps, lending positions, liquidity provision, and complex multi-step transactions."
                    variant="info"
                    className="mb-6"
                  />
                  <SimulationPanel />
                </>
              )}
              {activeTab === 'education' && (
                <>
                  <FeatureCallout
                    title="DeFi Education Hub"
                    description="Comprehensive learning center with tutorials, market analysis, protocol guides, risk management strategies, and interactive courses for all skill levels."
                    variant="default"
                    className="mb-6"
                  />
                  <EducationHub />
                </>
              )}
              {activeTab === 'settings' && (
                <>
                  <FeatureCallout
                    title="Platform Configuration"
                    description="Customize your SageChain experience with notification preferences, security settings, API integrations, and personalized dashboard configurations."
                    variant="warning"
                    className="mb-6"
                  />
                  <SettingsPanel />
                </>
              )}
            </div>

            {/* AI Chat Sidebar */}
            <div className="xl:col-span-1">
              <FeatureCallout
                title="AI Assistant Sidebar"
                description="Quick access to AI-powered insights, real-time market analysis, and personalized recommendations based on your portfolio and trading activity."
                variant="info"
                className="mb-4"
              />
              <AIChat walletData={walletData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
