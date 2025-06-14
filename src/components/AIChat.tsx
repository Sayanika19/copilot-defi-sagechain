
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Brain, User, Sparkles, AlertTriangle, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  action?: string;
  intent?: string;
  requiresWeb3?: boolean;
}

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
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { isAuthenticated, session } = useAuth();

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

  const recognizeIntent = (input: string): string => {
    const lowercaseInput = input.toLowerCase();
    
    if (lowercaseInput.includes('balance') || lowercaseInput.includes('portfolio')) {
      return 'check_balance';
    }
    if (lowercaseInput.includes('swap') || lowercaseInput.includes('exchange')) {
      return 'swap_token';
    }
    if (lowercaseInput.includes('stake') || lowercaseInput.includes('staking')) {
      return 'stake_token';
    }
    if (lowercaseInput.includes('safest') || lowercaseInput.includes('best protocol')) {
      return 'compare_protocols';
    }
    if (lowercaseInput.includes('explain') || lowercaseInput.includes('what is')) {
      return 'explain_concept';
    }
    
    return 'general_question';
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Check if user is authenticated
    if (!isAuthenticated || !session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use the AI assistant.",
        variant: "destructive",
      });
      return;
    }

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
      const intent = recognizeIntent(currentInput);
      
      console.log('Sending message to AI chat function:', {
        message: currentInput,
        conversationId: conversationId,
        intent: intent,
        user: session.user?.email,
        sessionValid: !!session.access_token
      });

      if (!session.access_token) {
        throw new Error('No valid session token available');
      }
      
      // Call the secure Edge Function with proper authorization
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: currentInput,
          conversationId: conversationId,
          intent: intent
        },
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('AI chat function response:', { data, error });

      if (error) {
        console.error('Error calling AI chat function:', error);
        
        let errorMessage = "I'm sorry, I encountered an error while processing your request.";
        
        if (error.message?.includes('Rate limit exceeded')) {
          errorMessage = "You've reached the rate limit. Please try again in an hour.";
        } else if (error.message?.includes('Invalid user') || error.message?.includes('authentication')) {
          errorMessage = "Authentication error. Please try signing out and back in.";
        } else if (error.message?.includes('OpenAI API key not configured')) {
          errorMessage = "AI service is currently unavailable. Please try again later.";
        } else if (error.message?.includes('Failed to get AI response')) {
          errorMessage = "The AI service is temporarily unavailable. Please try again.";
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });

        const errorMsg: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: errorMessage,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMsg]);
        return;
      }

      // Update conversation ID if it's a new conversation
      if (data?.conversationId && !conversationId) {
        setConversationId(data.conversationId);
        console.log('New conversation ID set:', data.conversationId);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data?.response || "I apologize, but I couldn't generate a response.",
        timestamp: new Date(),
        action: intent,
        intent: intent,
        requiresWeb3: data?.requiresWeb3,
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Unexpected error:', error);
      
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm sorry, I encountered an unexpected error. Please try again later.",
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

  // Show authentication prompt if user is not authenticated
  if (!isAuthenticated) {
    return (
      <Card className="h-[calc(100vh-12rem)] bg-black/40 border-purple-800/30 backdrop-blur-xl flex flex-col">
        <CardHeader className="pb-4">
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            AI Assistant
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </CardTitle>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col items-center justify-center p-6">
          <div className="text-center space-y-4">
            <LogIn className="w-12 h-12 text-purple-400 mx-auto" />
            <h3 className="text-xl font-semibold text-white">Authentication Required</h3>
            <p className="text-slate-300 max-w-md">
              Please sign in to access the AI assistant and start chatting about DeFi protocols, 
              portfolio analysis, and blockchain technology.
            </p>
            <Button 
              onClick={() => window.location.href = '/auth'} 
              className="bg-purple-600 hover:bg-purple-700"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In to Continue
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

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
