
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Brain, User, Sparkles, AlertCircle } from "lucide-react";
import { makeOpenAIPrediction } from "@/services/openaiService";
import ApiKeyManager from "./ApiKeyManager";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  action?: string;
}

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your DeFi AI assistant with real-time prediction capabilities. I can help you with market analysis, swap recommendations, portfolio insights, and DeFi strategies. Set your OpenAI API key to unlock advanced predictions!",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const suggestedActions = [
    "Predict ETH price movement today",
    "Best yield farming opportunities",
    "Analyze current DeFi risks",
    "Gas fee optimization tips"
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleApiKeySet = (newApiKey: string) => {
    setApiKey(newApiKey);
    localStorage.setItem('openai_api_key', newApiKey);
    
    const confirmMessage: Message = {
      id: Date.now().toString(),
      type: 'ai',
      content: "✅ OpenAI API key configured successfully! I can now provide real-time predictions and advanced DeFi analysis. Ask me anything!",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, confirmMessage]);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      let aiResponse: string;
      
      if (apiKey) {
        // Use real OpenAI API for predictions
        const conversationHistory = messages.map(msg => ({
          role: msg.type === 'user' ? 'user' as const : 'assistant' as const,
          content: msg.content
        }));
        
        aiResponse = await makeOpenAIPrediction(apiKey, inputValue, conversationHistory);
      } else {
        // Fallback to mock responses
        aiResponse = generateMockResponse(inputValue);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI Response Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "⚠️ I encountered an error generating a prediction. Please check your API key and try again, or contact support if the issue persists.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateMockResponse = (input: string): string => {
    const lowercaseInput = input.toLowerCase();
    
    if (lowercaseInput.includes('predict') || lowercaseInput.includes('price')) {
      return "🔮 For real-time price predictions and market analysis, please set your OpenAI API key. I can then provide advanced insights using current market data and AI analysis.";
    } else if (lowercaseInput.includes('yield') || lowercaseInput.includes('farm')) {
      return "🌾 To get current yield farming opportunities with real-time APY data, please configure your OpenAI API key for live market analysis.";
    } else {
      return "💡 I can provide much more detailed and current analysis once you set up your OpenAI API key. This enables real-time predictions and market insights!";
    }
  };

  const handleSuggestedAction = (action: string) => {
    setInputValue(action);
  };

  return (
    <Card className="h-[calc(100vh-12rem)] bg-black/40 border-purple-800/30 backdrop-blur-xl flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            AI Assistant
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </CardTitle>
          <ApiKeyManager 
            onApiKeySet={handleApiKeySet}
            hasApiKey={!!apiKey}
          />
        </div>
        {!apiKey && (
          <div className="flex items-center gap-2 text-orange-400 text-xs">
            <AlertCircle className="w-3 h-3" />
            Set API key for real-time predictions
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-6" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'ai' && (
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Brain className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800/80 text-slate-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.action && (
                    <div className="mt-2 pt-2 border-t border-slate-600">
                      <span className="text-xs text-purple-300">
                        Action detected: {message.action}
                      </span>
                    </div>
                  )}
                </div>
                
                {message.type === 'user' && (
                  <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Brain className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div className="bg-slate-800/80 p-3 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {/* Suggested Actions */}
        <div className="px-6 py-2 border-t border-purple-800/30">
          <div className="flex flex-wrap gap-2 mb-3">
            {suggestedActions.map((action, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedAction(action)}
                className="text-xs px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full hover:bg-purple-800/50 transition-colors"
              >
                {action}
              </button>
            ))}
          </div>
        </div>
        
        {/* Input Area */}
        <div className="px-6 pb-6">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={apiKey ? "Ask for real-time DeFi predictions..." : "Set API key for predictions..."}
              className="bg-slate-800/50 border-purple-800/30 text-white placeholder:text-slate-400"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChat;
