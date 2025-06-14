
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Play, Clock, Star, TrendingUp, Shield, Zap } from "lucide-react";

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

      {/* Course Categories */}
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
            <div className="space-y-3">
              <div className="p-3 bg-blue-900/30 rounded-lg">
                <h4 className="text-white font-medium">What is DeFi?</h4>
                <p className="text-sm text-blue-300 mt-1">
                  Understanding decentralized finance principles
                </p>
              </div>
              <div className="p-3 bg-blue-900/30 rounded-lg">
                <h4 className="text-white font-medium">Blockchain Basics</h4>
                <p className="text-sm text-blue-300 mt-1">
                  How blockchain technology enables DeFi
                </p>
              </div>
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
            <div className="space-y-3">
              <div className="p-3 bg-green-900/30 rounded-lg">
                <h4 className="text-white font-medium">Yield Farming</h4>
                <p className="text-sm text-green-300 mt-1">
                  Maximize returns through liquidity provision
                </p>
              </div>
              <div className="p-3 bg-green-900/30 rounded-lg">
                <h4 className="text-white font-medium">Arbitrage Trading</h4>
                <p className="text-sm text-green-300 mt-1">
                  Profit from price differences across platforms
                </p>
              </div>
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
            <div className="space-y-3">
              <div className="p-3 bg-red-900/30 rounded-lg">
                <h4 className="text-white font-medium">Wallet Security</h4>
                <p className="text-sm text-red-300 mt-1">
                  Protect your digital assets
                </p>
              </div>
              <div className="p-3 bg-red-900/30 rounded-lg">
                <h4 className="text-white font-medium">Smart Contract Risks</h4>
                <p className="text-sm text-red-300 mt-1">
                  Understanding and mitigating risks
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
