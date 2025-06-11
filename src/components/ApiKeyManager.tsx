
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, EyeOff, Key, AlertTriangle } from "lucide-react";

interface ApiKeyManagerProps {
  onApiKeySet: (apiKey: string) => void;
  hasApiKey: boolean;
}

const ApiKeyManager = ({ onApiKeySet, hasApiKey }: ApiKeyManagerProps) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    if (apiKey.trim()) {
      onApiKeySet(apiKey.trim());
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={hasApiKey ? "outline" : "default"}
          size="sm"
          className={hasApiKey ? "border-green-600 text-green-400" : "bg-orange-600 hover:bg-orange-700"}
        >
          <Key className="w-4 h-4 mr-2" />
          {hasApiKey ? 'Update API Key' : 'Set OpenAI API Key'}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-purple-800/30">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Key className="w-5 h-5 text-purple-400" />
            OpenAI API Configuration
          </DialogTitle>
          <DialogDescription className="text-purple-300">
            Enter your OpenAI API key to enable real-time AI predictions
          </DialogDescription>
        </DialogHeader>
        
        <Card className="bg-orange-900/20 border-orange-600/30">
          <CardContent className="p-4">
            <div className="flex items-start space-x-2">
              <AlertTriangle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-orange-300 font-medium">Security Notice</p>
                <p className="text-xs text-orange-200 mt-1">
                  Your API key is stored locally in your browser and never sent to our servers. 
                  It's only used to communicate directly with OpenAI's API.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-purple-300">OpenAI API Key</label>
            <div className="relative">
              <Input
                type={showApiKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-proj-..."
                className="bg-slate-800/50 border-purple-800/30 text-white pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!apiKey.trim()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Save API Key
            </Button>
          </div>
        </div>

        <div className="text-xs text-slate-400 border-t border-slate-700 pt-3">
          Get your API key from{' '}
          <a 
            href="https://platform.openai.com/api-keys" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 underline"
          >
            OpenAI Platform
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyManager;
