
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Brain, Sparkles } from "lucide-react";
import { useAIChat } from "@/hooks/useAIChat";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatLoadingIndicator from "@/components/chat/ChatLoadingIndicator";
import SuggestedActions from "@/components/chat/SuggestedActions";
import ChatInput from "@/components/chat/ChatInput";

const AIChat = () => {
  const {
    messages,
    inputValue,
    isLoading,
    scrollAreaRef,
    setInputValue,
    handleSendMessage,
  } = useAIChat();

  const suggestedActions = [
    "Check my portfolio balance",
    "What's the safest DeFi protocol?", 
    "How do I stake 100 MATIC?",
    "Explain yield farming risks"
  ];

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
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {isLoading && <ChatLoadingIndicator />}
          </div>
        </ScrollArea>
        
        <SuggestedActions 
          actions={suggestedActions}
          onActionClick={handleSuggestedAction}
        />
        
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSendMessage}
          disabled={isLoading}
        />
      </CardContent>
    </Card>
  );
};

export default AIChat;
