
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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

      {/* Learning Categories with Detailed Content */}
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white">Learning Categories</CardTitle>
          <CardDescription className="text-purple-300">
            Explore detailed content for each learning category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="fundamentals" className="border-purple-800/30">
              <AccordionTrigger className="text-white hover:text-purple-300">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  <div className="text-left">
                    <h3 className="font-semibold">Fundamentals</h3>
                    <p className="text-sm text-purple-300">Start your DeFi journey with the basics</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="space-y-6">
                  <div className="p-4 bg-blue-900/30 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">What is DeFi?</h4>
                    <p className="text-sm text-blue-300 mb-3">Understanding decentralized finance principles</p>
                    <p className="text-sm text-blue-200 mb-4">
                      Decentralized Finance (DeFi) is a blockchain-based form of finance that does not rely on central financial intermediaries such as brokerages, exchanges, or banks. Instead, it utilizes smart contracts on blockchains, the most common being Ethereum. DeFi platforms allow people to lend or borrow funds from others, speculate on price movements using derivatives, trade cryptocurrencies, insure against risks, and earn interest in savings-like accounts.
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-blue-300">Key Points:</p>
                      <p className="text-sm text-blue-200">• No central authority or intermediaries</p>
                      <p className="text-sm text-blue-200">• Built on blockchain technology (primarily Ethereum)</p>
                      <p className="text-sm text-blue-200">• Uses smart contracts for automated execution</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-900/30 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Blockchain Basics</h4>
                    <p className="text-sm text-blue-300 mb-3">How blockchain technology enables DeFi</p>
                    <p className="text-sm text-blue-200 mb-4">
                      Blockchain is the foundational technology that makes DeFi possible. It's a distributed ledger that maintains a continuously growing list of records, called blocks, which are linked and secured using cryptography. Each block contains a cryptographic hash of the previous block, a timestamp, and transaction data.
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-blue-300">Key Points:</p>
                      <p className="text-sm text-blue-200">• Immutable and transparent transaction records</p>
                      <p className="text-sm text-blue-200">• Decentralized network of nodes validates transactions</p>
                      <p className="text-sm text-blue-200">• Smart contracts enable programmable money</p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="strategies" className="border-purple-800/30">
              <AccordionTrigger className="text-white hover:text-purple-300">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  <div className="text-left">
                    <h3 className="font-semibold">Strategies</h3>
                    <p className="text-sm text-purple-300">Advanced trading and yield strategies</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="space-y-6">
                  <div className="p-4 bg-green-900/30 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Yield Farming</h4>
                    <p className="text-sm text-green-300 mb-3">Maximize returns through liquidity provision</p>
                    <p className="text-sm text-green-200 mb-4">
                      Yield farming involves lending cryptocurrency to earn rewards in the form of additional cryptocurrency. Users provide liquidity to DeFi protocols and earn fees, interest, or governance tokens as rewards. This strategy requires careful analysis of risks and returns across different protocols.
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-green-300">Key Points:</p>
                      <p className="text-sm text-green-200">• Provide liquidity to earn passive income</p>
                      <p className="text-sm text-green-200">• Compare APY rates across different protocols</p>
                      <p className="text-sm text-green-200">• Understand impermanent loss risks</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-900/30 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Arbitrage Trading</h4>
                    <p className="text-sm text-green-300 mb-3">Profit from price differences across platforms</p>
                    <p className="text-sm text-green-200 mb-4">
                      Arbitrage trading in DeFi involves exploiting price differences of the same asset across different decentralized exchanges (DEXs). Traders buy an asset on one platform where the price is lower and simultaneously sell it on another platform where the price is higher, profiting from the price difference.
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-green-300">Key Points:</p>
                      <p className="text-sm text-green-200">• Identify price discrepancies across DEXs</p>
                      <p className="text-sm text-green-200">• Execute trades quickly before price correction</p>
                      <p className="text-sm text-green-200">• Account for gas fees and slippage</p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="security" className="border-purple-800/30">
              <AccordionTrigger className="text-white hover:text-purple-300">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-red-400" />
                  <div className="text-left">
                    <h3 className="font-semibold">Security</h3>
                    <p className="text-sm text-purple-300">Stay safe in the DeFi ecosystem</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                <div className="space-y-6">
                  <div className="p-4 bg-red-900/30 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Wallet Security</h4>
                    <p className="text-sm text-red-300 mb-3">Protect your digital assets</p>
                    <p className="text-sm text-red-200 mb-4">
                      Wallet security is paramount in DeFi. Your wallet is your gateway to the decentralized world, and losing access or having it compromised can result in permanent loss of funds. Understanding proper wallet security practices is essential for safe DeFi participation.
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-red-300">Key Points:</p>
                      <p className="text-sm text-red-200">• Never share your private keys or seed phrases</p>
                      <p className="text-sm text-red-200">• Use hardware wallets for large amounts</p>
                      <p className="text-sm text-red-200">• Keep software wallets updated</p>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-red-900/30 rounded-lg">
                    <h4 className="text-white font-semibold mb-2">Smart Contract Risks</h4>
                    <p className="text-sm text-red-300 mb-3">Understanding and mitigating risks</p>
                    <p className="text-sm text-red-200 mb-4">
                      Smart contracts are self-executing contracts with terms directly written into code. While they eliminate the need for intermediaries, they also introduce unique risks including bugs, exploits, and governance risks. Understanding these risks is crucial for safe DeFi participation.
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-red-300">Key Points:</p>
                      <p className="text-sm text-red-200">• Code is immutable and may contain bugs</p>
                      <p className="text-sm text-red-200">• Audit reports don't guarantee complete safety</p>
                      <p className="text-sm text-red-200">• Flash loan attacks and other exploit vectors</p>
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

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
