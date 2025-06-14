
import { Brain, User, AlertTriangle } from "lucide-react";
import { Message } from "@/types/chat";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div
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
        <p className="text-sm whitespace-pre-wrap">
          {message.content}
          {message.type === 'ai' && message.content === '' && (
            <span className="inline-flex items-center">
              <span className="animate-pulse">●</span>
              <span className="animate-pulse delay-100">●</span>
              <span className="animate-pulse delay-200">●</span>
            </span>
          )}
        </p>
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
  );
};

export default ChatMessage;
