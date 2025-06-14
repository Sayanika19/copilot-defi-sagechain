
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
}

const ChatInput = ({ value, onChange, onSend, disabled }: ChatInputProps) => {
  return (
    <div className="px-6 pb-6">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ask me anything about DeFi..."
          className="bg-slate-800/50 border-purple-800/30 text-white placeholder:text-slate-400"
          onKeyPress={(e) => e.key === 'Enter' && onSend()}
        />
        <Button
          onClick={onSend}
          disabled={!value.trim() || disabled}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatInput;
