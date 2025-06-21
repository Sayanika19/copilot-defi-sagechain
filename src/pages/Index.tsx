
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, TrendingUp, DollarSign, GraduationCap, MessageSquare, Settings } from "lucide-react";
import Dashboard from "@/components/Dashboard";
import PortfolioOverview from "@/components/PortfolioOverview";
import CryptoTrading from "@/components/CryptoTrading";
import BorrowingLending from "@/components/BorrowingLending";
import SimulationPanel from "@/components/SimulationPanel";
import EducationHub from "@/components/EducationHub";
import AIChat from "@/components/AIChat";
import SettingsPanel from "@/components/SettingsPanel";
import WalletConnector, { WalletData } from "@/components/WalletConnector";
import { useLocation } from "react-router-dom";

const Index = () => {
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("dashboard");

  // Handle URL-based tab navigation
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location]);

  const handleWalletConnect = (data: WalletData) => {
    setWalletData(data);
    setIsWalletConnected(true);
  };

  const handleWalletDisconnect = () => {
    setWalletData(null);
    setIsWalletConnected(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="border-b border-purple-800/30 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">SageChain</h1>
            </div>
            <WalletConnector 
              onConnect={handleWalletConnect}
              onDisconnect={handleWalletDisconnect}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-8 bg-black/20 backdrop-blur-xl">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-purple-600">
              <Brain className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-purple-600">
              <TrendingUp className="w-4 h-4 mr-2" />
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="trading" className="data-[state=active]:bg-purple-600">
              <DollarSign className="w-4 h-4 mr-2" />
              Trading
            </TabsTrigger>
            <TabsTrigger value="lending" className="data-[state=active]:bg-purple-600">
              <DollarSign className="w-4 h-4 mr-2" />
              Lending
            </TabsTrigger>
            <TabsTrigger value="simulation" className="data-[state=active]:bg-purple-600">
              <Brain className="w-4 h-4 mr-2" />
              Simulation
            </TabsTrigger>
            <TabsTrigger value="education" className="data-[state=active]:bg-purple-600">
              <GraduationCap className="w-4 h-4 mr-2" />
              Education
            </TabsTrigger>
            <TabsTrigger value="ai-chat" className="data-[state=active]:bg-purple-600">
              <MessageSquare className="w-4 h-4 mr-2" />
              AI Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard isConnected={isWalletConnected} walletData={walletData} />
          </TabsContent>

          <TabsContent value="portfolio">
            <PortfolioOverview walletData={walletData} />
          </TabsContent>

          <TabsContent value="trading">
            <CryptoTrading walletData={walletData} />
          </TabsContent>

          <TabsContent value="lending">
            <BorrowingLending />
          </TabsContent>

          <TabsContent value="simulation">
            <SimulationPanel />
          </TabsContent>

          <TabsContent value="education">
            <EducationHub />
          </TabsContent>

          <TabsContent value="ai-chat">
            <AIChat walletData={walletData} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
