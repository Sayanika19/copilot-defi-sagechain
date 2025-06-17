
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Play, Clock, Star, TrendingUp, Shield, Zap, ExternalLink, Youtube } from "lucide-react";

const EducationHub = () => {
  const courses = [
    {
      title: "DeFi Fundamentals",
      description: "Learn the basics of decentralized finance, including key concepts and protocols",
      duration: "2 hours",
      difficulty: "Beginner",
      rating: 4.8,
      lessons: 12,
      category: "Fundamentals"
    },
    {
      title: "Yield Farming Strategies",
      description: "Advanced techniques for maximizing returns through liquidity provision",
      duration: "3 hours",
      difficulty: "Advanced",
      rating: 4.9,
      lessons: 18,
      category: "Strategies"
    },
    {
      title: "Smart Contract Security",
      description: "Understanding risks and best practices for safe DeFi interactions",
      duration: "1.5 hours",
      difficulty: "Intermediate",
      rating: 4.7,
      lessons: 8,
      category: "Security"
    }
  ];

  const tutorials = [
    {
      title: "How to Connect MetaMask",
      duration: "5 min",
      type: "Video",
      views: "12k"
    },
    {
      title: "Understanding Impermanent Loss",
      duration: "8 min",
      type: "Article",
      views: "8.5k"
    },
    {
      title: "Setting Up Hardware Wallet",
      duration: "12 min",
      type: "Video",
      views: "15k"
    }
  ];

  const youtubeVideos = [
    {
      title: "DeFi Explained in 10 Minutes",
      channel: "Coin Bureau",
      duration: "10:45",
      url: "https://www.youtube.com/watch?v=k9HYC0EJU6E",
      views: "2.1M"
    },
    {
      title: "What is Yield Farming? Complete Guide",
      channel: "Whiteboard Crypto",
      duration: "15:32",
      url: "https://www.youtube.com/watch?v=ClnnLI1SClA",
      views: "850k"
    },
    {
      title: "Liquidity Pools Explained",
      channel: "Finematics",
      duration: "12:18",
      url: "https://www.youtube.com/watch?v=cizLhxSKrAc",
      views: "1.3M"
    },
    {
      title: "Smart Contract Security Best Practices",
      channel: "Smart Contract Programmer",
      duration: "18:45",
      url: "https://www.youtube.com/watch?v=WGM2islUYuE",
      views: "420k"
    },
    {
      title: "How to Use MetaMask Wallet",
      channel: "99Bitcoins",
      duration: "8:22",
      url: "https://www.youtube.com/watch?v=YVgfHZMFFFQ",
      views: "1.8M"
    },
    {
      title: "Arbitrage Trading in DeFi",
      channel: "DeFi Dad",
      duration: "22:15",
      url: "https://www.youtube.com/watch?v=3HPP8zKZKrU",
      views: "350k"
    }
  ];

  const fundamentalsContent = [
    {
      title: "What is DeFi?",
      description: "Understanding decentralized finance principles",
      content: "Decentralized Finance (DeFi) is a blockchain-based form of finance that does not rely on central financial intermediaries such as brokerages, exchanges, or banks. Instead, it utilizes smart contracts on blockchains, the most common being Ethereum. DeFi platforms allow people to lend or borrow funds from others, speculate on price movements using derivatives, trade cryptocurrencies, insure against risks, and earn interest in savings-like accounts.",
      keyPoints: [
        "No central authority or intermediaries",
        "Built on blockchain technology (primarily Ethereum)",
        "Uses smart contracts for automated execution",
        "Provides financial services without traditional banks",
        "Offers lending, borrowing, trading, and earning opportunities"
      ]
    },
    {
      title: "Blockchain Basics",
      description: "How blockchain technology enables DeFi",
      content: "Blockchain is the foundational technology that makes DeFi possible. It's a distributed ledger that maintains a continuously growing list of records, called blocks, which are linked and secured using cryptography. Each block contains a cryptographic hash of the previous block, a timestamp, and transaction data.",
      keyPoints: [
        "Immutable and transparent transaction records",
        "Decentralized network of nodes validates transactions",
        "Smart contracts enable programmable money",
        "No single point of failure",
        "Permissionless access to financial services"
      ]
    }
  ];

  const strategiesContent = [
    {
      title: "Yield Farming",
      description: "Maximize returns through liquidity provision",
      content: "Yield farming involves lending cryptocurrency to earn rewards in the form of additional cryptocurrency. Users provide liquidity to DeFi protocols and earn fees, interest, or governance tokens as rewards. This strategy requires careful analysis of risks and returns across different protocols.",
      keyPoints: [
        "Provide liquidity to earn passive income",
        "Compare APY rates across different protocols",
        "Understand impermanent loss risks",
        "Consider gas fees and transaction costs",
        "Monitor protocol security and audit reports"
      ]
    },
    {
      title: "Arbitrage Trading",
      description: "Profit from price differences across platforms",
      content: "Arbitrage trading in DeFi involves exploiting price differences of the same asset across different decentralized exchanges (DEXs). Traders buy an asset on one platform where the price is lower and simultaneously sell it on another platform where the price is higher, profiting from the price difference.",
      keyPoints: [
        "Identify price discrepancies across DEXs",
        "Execute trades quickly before price correction",
        "Account for gas fees and slippage",
        "Use flash loans for capital efficiency",
        "Monitor multiple exchanges simultaneously"
      ]
    }
  ];

  const securityContent = [
    {
      title: "Wallet Security",
      description: "Protect your digital assets",
      content: "Wallet security is paramount in DeFi. Your wallet is your gateway to the decentralized world, and losing access or having it compromised can result in permanent loss of funds. Understanding proper wallet security practices is essential for safe DeFi participation.",
      keyPoints: [
        "Never share your private keys or seed phrases",
        "Use hardware wallets for large amounts",
        "Keep software wallets updated",
        "Use strong, unique passwords",
        "Enable two-factor authentication where available",
        "Be wary of phishing attempts"
      ]
    },
    {
      title: "Smart Contract Risks",
      description: "Understanding and mitigating risks",
      content: "Smart contracts are self-executing contracts with terms directly written into code. While they eliminate the need for intermediaries, they also introduce unique risks including bugs, exploits, and governance risks. Understanding these risks is crucial for safe DeFi participation.",
      keyPoints: [
        "Code is immutable and may contain bugs",
        "Audit reports don't guarantee complete safety",
        "Flash loan attacks and other exploit vectors",
        "Governance token risks and centralization",
        "Always start with small amounts when testing",
        "Research protocol teams and their track record"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Education Hub</h2>
        <p className="text-purple-300">Master DeFi with our comprehensive learning resources</p>
      </div>

      {/* Featured Course */}
      <Card className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              ⭐ Featured Course
            </Badge>
            <Badge variant="outline" className="border-green-500 text-green-400">
              New
            </Badge>
          </div>
          <CardTitle className="text-2xl text-white">Advanced DeFi Portfolio Management</CardTitle>
          <CardDescription className="text-purple-300">
            Learn professional strategies for managing and optimizing your DeFi portfolio with real-world case studies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-6 mb-4">
            <div className="flex items-center space-x-2 text-purple-300">
              <Clock className="w-4 h-4" />
              <span>4 hours</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-300">
              <BookOpen className="w-4 h-4" />
              <span>24 lessons</span>
            </div>
            <div className="flex items-center space-x-2 text-purple-300">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>4.9 (2.1k reviews)</span>
            </div>
          </div>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Play className="w-4 h-4 mr-2" />
            Start Learning
          </Button>
        </CardContent>
      </Card>

      {/* Course Categories with Detailed Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-blue-400" />
              Fundamentals
            </CardTitle>
            <CardDescription className="text-purple-300">
              Start your DeFi journey with the basics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fundamentalsContent.map((item, index) => (
                <div key={index} className="p-4 bg-blue-900/30 rounded-lg">
                  <h4 className="text-white font-medium mb-2">{item.title}</h4>
                  <p className="text-sm text-blue-300 mb-3">{item.description}</p>
                  <p className="text-xs text-blue-200 mb-3">{item.content}</p>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-blue-300">Key Points:</p>
                    {item.keyPoints.slice(0, 3).map((point, idx) => (
                      <p key={idx} className="text-xs text-blue-200">• {point}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Strategies
            </CardTitle>
            <CardDescription className="text-purple-300">
              Advanced trading and yield strategies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {strategiesContent.map((item, index) => (
                <div key={index} className="p-4 bg-green-900/30 rounded-lg">
                  <h4 className="text-white font-medium mb-2">{item.title}</h4>
                  <p className="text-sm text-green-300 mb-3">{item.description}</p>
                  <p className="text-xs text-green-200 mb-3">{item.content}</p>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-green-300">Key Points:</p>
                    {item.keyPoints.slice(0, 3).map((point, idx) => (
                      <p key={idx} className="text-xs text-green-200">• {point}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5 text-red-400" />
              Security
            </CardTitle>
            <CardDescription className="text-purple-300">
              Stay safe in the DeFi ecosystem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {securityContent.map((item, index) => (
                <div key={index} className="p-4 bg-red-900/30 rounded-lg">
                  <h4 className="text-white font-medium mb-2">{item.title}</h4>
                  <p className="text-sm text-red-300 mb-3">{item.description}</p>
                  <p className="text-xs text-red-200 mb-3">{item.content}</p>
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-red-300">Key Points:</p>
                    {item.keyPoints.slice(0, 3).map((point, idx) => (
                      <p key={idx} className="text-xs text-red-200">• {point}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* YouTube Learning Videos */}
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Youtube className="w-5 h-5 text-red-500" />
            DeFi Learning Videos
          </CardTitle>
          <CardDescription className="text-purple-300">
            Curated YouTube videos to enhance your DeFi knowledge
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {youtubeVideos.map((video, index) => (
              <div key={index} className="p-4 bg-slate-800/30 rounded-lg hover:bg-slate-700/30 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="text-white font-medium text-sm leading-tight">{video.title}</h4>
                  <ExternalLink className="w-4 h-4 text-purple-400 flex-shrink-0 ml-2" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-purple-300">{video.channel}</p>
                  <div className="flex items-center justify-between text-xs text-purple-400">
                    <span>{video.duration}</span>
                    <span>{video.views} views</span>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-xs bg-red-600/20 border-red-600/30 text-red-300 hover:bg-red-600/30"
                    onClick={() => window.open(video.url, '_blank')}
                  >
                    <Youtube className="w-3 h-3 mr-1" />
                    Watch on YouTube
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Course Grid */}
      <div>
        <h3 className="text-xl font-bold text-white mb-4">All Courses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <Card key={index} className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="border-purple-600 text-purple-400">
                    {course.category}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className={`${
                      course.difficulty === 'Beginner' 
                        ? 'border-green-500 text-green-400'
                        : course.difficulty === 'Intermediate'
                        ? 'border-yellow-500 text-yellow-400'
                        : 'border-red-500 text-red-400'
                    }`}
                  >
                    {course.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-white">{course.title}</CardTitle>
                <CardDescription className="text-purple-300">
                  {course.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-purple-300 mb-4">
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{course.lessons} lessons</span>
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{course.rating}</span>
                  </div>
                </div>
                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Start Course
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Tutorials */}
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-400" />
            Quick Tutorials
          </CardTitle>
          <CardDescription className="text-purple-300">
            Short, focused lessons for immediate learning
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tutorials.map((tutorial, index) => (
              <div key={index} className="p-4 bg-slate-800/30 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-white font-medium">{tutorial.title}</h4>
                  <Badge variant="outline" className="text-xs border-purple-600 text-purple-400">
                    {tutorial.type}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm text-purple-300">
                  <span>{tutorial.duration}</span>
                  <span>{tutorial.views} views</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EducationHub;
