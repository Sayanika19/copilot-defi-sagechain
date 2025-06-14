
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface ChatMessage {
  id: string;
  conversation_id: string;
  type: 'user' | 'ai';
  content: string;
  intent?: string;
  requires_web3?: boolean;
  created_at: string;
}

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        toast({
          title: "Error",
          description: "Failed to fetch conversations.",
          variant: "destructive",
        });
        return;
      }

      setConversations(data || []);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (conversationId: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        toast({
          title: "Error",
          description: "Failed to fetch messages.",
          variant: "destructive",
        });
        return;
      }

      // Transform the data to ensure type safety
      const transformedMessages: ChatMessage[] = (data || []).map(msg => ({
        ...msg,
        type: msg.type as 'user' | 'ai', // Type assertion to fix the TypeScript error
        intent: msg.intent || undefined,
        requires_web3: msg.requires_web3 || false,
      }));

      setMessages(transformedMessages);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      if (error) {
        console.error('Error deleting conversation:', error);
        toast({
          title: "Error",
          description: "Failed to delete conversation.",
          variant: "destructive",
        });
        return;
      }

      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      toast({
        title: "Success",
        description: "Conversation deleted successfully.",
      });
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  return {
    conversations,
    messages,
    isLoading,
    fetchConversations,
    fetchMessages,
    deleteConversation
  };
};
