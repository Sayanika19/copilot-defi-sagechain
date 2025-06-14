
import { useState, useRef, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/types/chat";

export const useAIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hello! I'm your DeFi AI assistant powered by Gemini. I can help you with portfolio analysis, explain DeFi protocols, guide you through transactions, and answer questions about blockchain technology. How can I assist you today?",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
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

      // Create initial AI message for streaming
      const aiMessageId = (Date.now() + 1).toString();
      const initialAiMessage: Message = {
        id: aiMessageId,
        type: 'ai',
        content: '',
        timestamp: new Date(),
        action: intent,
        intent: intent,
        requiresWeb3: intent === 'stake_token' || intent === 'swap_token',
      };

      setMessages(prev => [...prev, initialAiMessage]);
      setStreamingMessageId(aiMessageId);

      // Call the edge function for streaming response
      const response = await fetch(`https://jahnklalgnspbttbippf.supabase.co/functions/v1/ai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphaG5rbGFsZ25zcGJ0dGJpcHBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MTc2MjcsImV4cCI6MjA2NTQ5MzYyN30.vf-CHPui45M469dAYM4AAsuxVsyjLOk1nFESELTePoY`,
        },
        body: JSON.stringify({
          message: currentInput,
          intent: intent
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        throw new Error(`API returned ${response.status}: ${errorText}`);
      }

      if (!response.body) {
        throw new Error('No response stream available');
      }

      const reader = response.body.getReader();
      let accumulatedContent = '';
      console.log('Starting to read streaming response...');

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            console.log('Stream reading completed');
            break;
          }

          const chunk = new TextDecoder().decode(value);
          console.log('Frontend received chunk:', chunk);
          
          // Process server-sent events format
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine) continue;
            
            if (trimmedLine === 'data: [DONE]') {
              console.log('Stream completion signal received');
              continue;
            }
            
            if (trimmedLine.startsWith('data: ')) {
              try {
                const dataStr = trimmedLine.slice(6).trim();
                if (dataStr) {
                  const data = JSON.parse(dataStr);
                  if (data.content) {
                    console.log('Adding content to message:', data.content);
                    accumulatedContent += data.content;
                    
                    // Update the streaming message with accumulated content
                    setMessages(prev => prev.map(msg => 
                      msg.id === aiMessageId 
                        ? { ...msg, content: accumulatedContent }
                        : msg
                    ));
                  }
                }
              } catch (parseError) {
                console.log('Error parsing SSE data:', trimmedLine, parseError);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      setStreamingMessageId(null);
      console.log('Final accumulated content:', accumulatedContent);

      // If no content was received, show an error
      if (!accumulatedContent.trim()) {
        setMessages(prev => prev.map(msg => 
          msg.id === aiMessageId 
            ? { ...msg, content: "I apologize, but I encountered an issue generating a response. Please try again." }
            : msg
        ));
      }

    } catch (error) {
      console.error('Error in handleSendMessage:', error);
      
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });

      // Remove the empty AI message and add error message
      setMessages(prev => {
        const filtered = prev.filter(msg => msg.id !== streamingMessageId);
        return [...filtered, {
          id: (Date.now() + 2).toString(),
          type: 'ai',
          content: `I'm sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`,
          timestamp: new Date(),
        }];
      });

      setStreamingMessageId(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    inputValue,
    isLoading: isLoading || streamingMessageId !== null,
    scrollAreaRef,
    setInputValue,
    handleSendMessage,
  };
};
