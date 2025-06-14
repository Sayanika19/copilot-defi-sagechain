
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Brain, User, Sparkles, AlertTriangle } from "lucide-react";
import OpenAI from "openai";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  action?: string;
  intent?: string;
  requiresWeb3?: boolean;
}

interface Intent {
  type: string;
  confidence: number;
  parameters?: Record<string, any>;
}

const openai = new OpenAI({
  apiKey: "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",
  dangerouslyAllowBrowser: true
});

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your DeFi AI assistant. I can help you with portfolio analysis, explain DeFi protocols, guide you through transactions, and answer questions about blockchain technology. How can I assist you today?",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const suggestedActions = [
    "Check my portfolio balance",
    "What's the safest DeFi protocol?",
    "How do I stake 100 MATIC?",
    "Explain yield farming risks"
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const recognizeIntent = (input: string): Intent => {
    const lowercaseInput = input.toLowerCase();
    
    // Balance/Portfolio checking
    if (lowercaseInput.includes('balance') || lowercaseInput.includes('portfolio') || lowercaseInput.includes('check my')) {
      return { type: 'check_balance', confidence: 0.9 };
    }
    
    // Token swapping
    if (lowercaseInput.includes('swap') || lowercaseInput.includes('exchange') || lowercaseInput.includes('trade')) {
      const tokens = extractTokens(input);
      return { 
        type: 'swap_token', 
        confidence: 0.85,
        parameters: { tokens }
      };
    }
    
    // Staking
    if (lowercaseInput.includes('stake') || lowercaseInput.includes('staking')) {
      const amount = extractAmount(input);
      const token = extractTokens(input)[0];
      return { 
        type: 'stake_token', 
        confidence: 0.8,
        parameters: { amount, token }
      };
    }
    
    // Protocol comparison/safety
    if (lowercaseInput.includes('safest') || lowercaseInput.includes('best protocol') || lowercaseInput.includes('compare')) {
      return { type: 'compare_protocols', confidence: 0.7 };
    }
    
    // Explaining concepts
    if (lowercaseInput.includes('explain') || lowercaseInput.includes('what is') || lowercaseInput.includes('how does')) {
      return { type: 'explain_concept', confidence: 0.8 };
    }
    
    // General question
    return { type: 'general_question', confidence: 0.5 };
  };

  const extractTokens = (input: string): string[] => {
    const tokenPattern = /\b(ETH|BTC|USDC|USDT|DAI|MATIC|AAVE|UNI|COMP|LINK|DOT|ADA|SOL)\b/gi;
    return input.match(tokenPattern) || [];
  };

  const extractAmount = (input: string): string | null => {
    const amountPattern = /\b(\d+(?:\.\d+)?)\s*(ETH|BTC|USDC|USDT|DAI|MATIC|AAVE|UNI|COMP|LINK|DOT|ADA|SOL)?\b/i;
    const match = input.match(amountPattern);
    return match ? match[1] : null;
  };

  const generateContextualResponse = async (input: string, intent: Intent): Promise<string> => {
    let systemPrompt = "You are a helpful DeFi AI assistant. ";
    
    switch (intent.type) {
      case 'check_balance':
        systemPrompt += "The user wants to check their portfolio balance. Ask for their wallet address if not provided, and explain what information you can show them.";
        break;
      case 'swap_token':
        systemPrompt += "The user wants to swap tokens. Provide a step-by-step guide and include important disclaimers about slippage, gas fees, and market volatility.";
        break;
      case 'stake_token':
        systemPrompt += "The user wants to stake tokens. Explain the staking process, rewards, risks, and lock-up periods. Include disclaimers about smart contract risks.";
        break;
      case 'compare_protocols':
        systemPrompt += "The user wants to compare DeFi protocols. Focus on security, TVL, audit history, and risk factors. Be objective and mention that this is not financial advice.";
        break;
      case 'explain_concept':
        systemPrompt += "The user wants to understand a DeFi concept. Provide clear, educational explanations with examples. Break down complex topics into digestible parts.";
        break;
      default:
        systemPrompt += "Provide helpful, accurate information about DeFi and blockchain technology. Be conversational and ask follow-up questions when appropriate.";
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: systemPrompt + " Always be conversational, helpful, and include appropriate disclaimers for financial actions. Keep responses concise but informative."
        },
        {
          role: "user",
          content: input
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    return completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response. Please try again.";
  };

  const requiresWeb3Action = (intent: Intent): boolean => {
    return ['swap_token', 'stake_token', 'check_balance'].includes(intent.type);
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
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // Recognize intent
      const intent = recognizeIntent(currentInput);
      console.log('Detected intent:', intent);

      // Generate contextual response
      const aiResponse = await generateContextualResponse(currentInput, intent);
      
      // Add Web3 disclaimer if needed
      let finalResponse = aiResponse;
      const needsWeb3 = requiresWeb3Action(intent);
      
      if (needsWeb3) {
        finalResponse += "\n\n⚠️ **Disclaimer**: This action requires Web3 execution. Please ensure you understand the risks and have sufficient gas fees. Always verify transaction details before confirming.";
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: finalResponse,
        timestamp: new Date(),
        action: intent.type,
        intent: intent.type,
        requiresWeb3: needsWeb3,
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedAction = (action: string) => {
    setInputValue(action);
  };

  return (
    <Card className="h-[calc(100vh-12rem)] bg-black/40 border-purple-800/30 backdrop-blur-xl flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          AI Assistant
          <Sparkles className="w-4 h-4 text-yellow-400" />
        </CardTitle>
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
                  {message.intent && (
                    <div className="mt-2 pt-2 border-t border-slate-600">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-purple-300">
                          Intent: {message.intent.replace('_', ' ')}
                        </span>
                        {message.requiresWeb3 && (
                          <AlertTriangle className="w-3 h-3 text-yellow-400" />
                        )}
                      </div>
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
              placeholder="Ask me anything about DeFi..."
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
