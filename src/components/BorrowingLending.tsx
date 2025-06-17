
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DollarSign, ArrowUpDown, Shield, Zap, Users, TrendingUp } from "lucide-react";

const BorrowingLending = () => {
  const features = [
    {
      title: "Lend on Multiple Chains",
      description: "Users can lend their assets on one blockchain while benefiting from competitive interest rates.",
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-900/30"
    },
    {
      title: "Cross-Chain Deposits",
      description: "Easily deposit assets into different chains, maximizing yield opportunities and diversifying portfolios.",
      icon: ArrowUpDown,
      color: "text-blue-400",
      bgColor: "bg-blue-900/30"
    },
    {
      title: "Flexible Repayment Options",
      description: "Repay loans on any supported chain, providing users with the freedom to manage their liabilities efficiently.",
      icon: DollarSign,
      color: "text-yellow-400",
      bgColor: "bg-yellow-900/30"
    },
    {
      title: "Instant Redemption",
      description: "Redeem assets across chains instantly, ensuring liquidity and accessibility when needed.",
      icon: Zap,
      color: "text-purple-400",
      bgColor: "bg-purple-900/30"
    },
    {
      title: "User-Friendly Interface",
      description: "A clean and intuitive interface that simplifies the CrossChain experience for both novice and experienced users.",
      icon: Users,
      color: "text-cyan-400",
      bgColor: "bg-cyan-900/30"
    },
    {
      title: "Robust Security",
      description: "Built with top-tier security protocols to ensure the safety of user assets and transactions.",
      icon: Shield,
      color: "text-red-400",
      bgColor: "bg-red-900/30"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Borrowing & Lending</h2>
        <p className="text-purple-300">Cross-chain lending and borrowing solutions for optimal DeFi returns</p>
      </div>

      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-green-900/40 to-blue-900/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              ⚡ Multi-Chain Solution
            </Badge>
            <Badge variant="outline" className="border-blue-500 text-blue-400">
              Cross-Chain
            </Badge>
          </div>
          <CardTitle className="text-2xl text-white">Advanced Cross-Chain Lending Platform</CardTitle>
          <CardDescription className="text-purple-300">
            Maximize your DeFi returns with our comprehensive cross-chain borrowing and lending solutions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center space-x-2 text-green-300">
              <TrendingUp className="w-4 h-4" />
              <span>Competitive rates across chains</span>
            </div>
            <div className="flex items-center space-x-2 text-blue-300">
              <ArrowUpDown className="w-4 h-4" />
              <span>Seamless cross-chain deposits</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-300">
              <Shield className="w-4 h-4" />
              <span>Enterprise-grade security</span>
            </div>
          </div>
          <div className="flex gap-4">
            <Button className="bg-green-600 hover:bg-green-700">
              Start Lending
            </Button>
            <Button variant="outline" className="border-purple-600 text-purple-300 hover:bg-purple-600/20">
              Explore Borrowing
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="bg-black/40 border-purple-800/30 backdrop-blur-xl hover:border-purple-600/50 transition-colors">
            <CardHeader>
              <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>
              <CardTitle className="text-white text-lg">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-purple-300 text-sm leading-relaxed">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* How It Works Section */}
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-green-400" />
            How Cross-Chain Lending Works
          </CardTitle>
          <CardDescription className="text-purple-300">
            Simple steps to start earning with our multi-chain platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-400">1</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Connect & Deposit</h3>
              <p className="text-purple-300 text-sm">Connect your wallet and deposit assets across multiple supported chains</p>
            </div>
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-400">2</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Earn & Monitor</h3>
              <p className="text-purple-300 text-sm">Watch your assets earn competitive interest rates while maintaining full control</p>
            </div>
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-400">3</span>
              </div>
              <h3 className="text-white font-semibold mb-2">Redeem Anytime</h3>
              <p className="text-purple-300 text-sm">Instantly redeem your assets on any supported chain when needed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Section */}
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Platform Statistics</CardTitle>
          <CardDescription className="text-purple-300">
            Real-time metrics from our cross-chain lending platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">$2.5B+</div>
              <div className="text-sm text-purple-300">Total Value Locked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">15+</div>
              <div className="text-sm text-purple-300">Supported Chains</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400 mb-1">8.5%</div>
              <div className="text-sm text-purple-300">Average APY</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 mb-1">50K+</div>
              <div className="text-sm text-purple-300">Active Users</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BorrowingLending;
