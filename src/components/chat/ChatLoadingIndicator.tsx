
import { Brain } from "lucide-react";

const ChatLoadingIndicator = () => {
  return (
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
  );
};

export default ChatLoadingIndicator;
