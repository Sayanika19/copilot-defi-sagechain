
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Wallet, Copy, ExternalLink, ChevronDown } from "lucide-react";

interface WalletConnectorProps {
  isConnected: boolean;
  onConnect: () => void;
}

const WalletConnector = ({ isConnected, onConnect }: WalletConnectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState('');

  const wallets = [
    { 
      name: 'MetaMask', 
      icon: '🦊', 
      description: 'Most popular Ethereum wallet',
      installed: true 
    },
    { 
      name: 'WalletConnect', 
      icon: '🔗', 
      description: 'Connect via QR code',
      installed: true 
    },
    { 
      name: 'Coinbase Wallet', 
      icon: '🌐', 
      description: 'Coinbase\'s self-custody wallet',
      installed: false 
    },
    { 
      name: 'Rainbow', 
      icon: '🌈', 
      description: 'Fun, simple, and secure',
      installed: false 
    },
  ];

  const mockAddress = '0x742d...8f3A';
  const mockBalance = '$12,547.83';

  const handleWalletSelect = (walletName: string) => {
    setSelectedWallet(walletName);
    // Simulate connection delay
    setTimeout(() => {
      onConnect();
      setIsOpen(false);
    }, 1500);
  };

  const copyAddress = () => {
    navigator.clipboard.writeText('0x742d35Cc6B5C73Ff5cb78a3e7B9B6834567f8f3A');
  };

  if (isConnected) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="border-purple-600 text-purple-400 hover:bg-purple-600/10">
            <Wallet className="w-4 h-4 mr-2" />
            {mockAddress}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-slate-900 border-purple-800/30">
          <DialogHeader>
            <DialogTitle className="text-white">Wallet Details</DialogTitle>
            <DialogDescription className="text-purple-300">
              Manage your connected wallet
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Card className="bg-black/40 border-purple-800/30">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🦊</span>
                    <span className="text-white font-medium">MetaMask</span>
                  </div>
                  <Badge className="bg-green-600/20 text-green-400">Connected</Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-300">Address</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-mono text-sm">0x742d35Cc6B5C73Ff5cb78a3e7B9B6834567f8f3A</span>
                      <Button size="sm" variant="ghost" onClick={copyAddress}>
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-300">Total Balance</span>
                    <span className="text-white font-medium">{mockBalance}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-purple-300">Network</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="text-white text-sm">Ethereum Mainnet</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex space-x-2">
              <Button variant="outline" className="flex-1 border-purple-600 text-purple-400">
                <ExternalLink className="w-4 h-4 mr-2" />
                View on Etherscan
              </Button>
              <Button variant="outline" className="flex-1 border-red-600 text-red-400">
                Disconnect
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-purple-800/30 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white">Connect Your Wallet</DialogTitle>
          <DialogDescription className="text-purple-300">
            Choose your preferred wallet to connect to SageChain
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3">
          {wallets.map((wallet) => (
            <button
              key={wallet.name}
              onClick={() => handleWalletSelect(wallet.name)}
              disabled={!wallet.installed || selectedWallet === wallet.name}
              className={`w-full p-4 rounded-lg border transition-all duration-200 text-left ${
                wallet.installed
                  ? selectedWallet === wallet.name
                    ? 'border-purple-600 bg-purple-600/20'
                    : 'border-purple-800/30 bg-slate-800/30 hover:border-purple-600/50 hover:bg-purple-600/10'
                  : 'border-slate-700 bg-slate-800/20 opacity-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{wallet.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-medium">{wallet.name}</h3>
                    {!wallet.installed && (
                      <Badge variant="outline" className="border-slate-600 text-slate-400 text-xs">
                        Not Installed
                      </Badge>
                    )}
                    {selectedWallet === wallet.name && (
                      <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </div>
                  <p className="text-sm text-purple-300 mt-1">{wallet.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="text-center pt-4 border-t border-slate-700">
          <p className="text-xs text-slate-400">
            By connecting, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnector;
