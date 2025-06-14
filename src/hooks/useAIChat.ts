
import { useState, useRef, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/types/chat";

export const useAIChat = () => {
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
  const { toast } = useToast();

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
        intent: intent
      });
      
      const { data, error } = await supabase.functions.invoke('ai-chat', {
        body: {
          message: currentInput,
          intent: intent
        }
      });

      console.log('AI chat function response:', { data, error });

      if (error) {
        console.error('Error calling AI chat function:', error);
        
        let errorMessage = "I'm sorry, I encountered an error while processing your request.";
        
        if (error.message?.includes('OpenAI API key not configured')) {
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

  return {
    messages,
    inputValue,
    isLoading,
    scrollAreaRef,
    setInputValue,
    handleSendMessage,
  };
};
