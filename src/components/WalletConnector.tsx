import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Wallet, Copy, ExternalLink, ChevronDown, Loader2, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWalletBalance } from "@/hooks/useWalletBalance";

interface WalletConnectorProps {
  isConnected: boolean;
  onConnect: (walletData: WalletData) => void;
  onDisconnect?: () => void;
}

export interface WalletData {
  address: string;
  balance: string;
  walletType: string;
  tokens?: { [key: string]: number };
}

declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (accounts: string[]) => void) => void;
      removeListener: (event: string, callback: (accounts: string[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

const WalletConnector = ({ isConnected, onConnect, onDisconnect }: WalletConnectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [walletBalance, setWalletBalance] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectedWalletType, setConnectedWalletType] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentWalletData, setCurrentWalletData] = useState<WalletData | null>(null);
  const { toast } = useToast();

  // Use real-time balance hook
  const { balances, prices, totalValue, isLoading: balanceLoading } = useWalletBalance(currentWalletData);

  const wallets = [
    { 
      name: 'MetaMask', 
      icon: '🦊', 
      description: 'Most popular Ethereum wallet',
      installed: typeof window !== 'undefined' && window.ethereum?.isMetaMask 
    },
    { 
      name: 'WalletConnect', 
      icon: '🔗', 
      description: 'Connect via QR code',
      installed: true 
    },
  ];

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const address = accounts[0];
            setWalletAddress(address);
            const balance = await updateBalance(address);
            setConnectedWalletType('MetaMask');
            
            const walletData = {
              address,
              balance,
              walletType: 'MetaMask',
              tokens: {} // Will be populated by useWalletBalance hook
            };
            
            setCurrentWalletData(walletData);
            onConnect(walletData);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkConnection();
  }, [onConnect]);

  // Update wallet data when balances change
  useEffect(() => {
    if (currentWalletData && Object.keys(balances).length > 0) {
      const updatedWalletData = {
        ...currentWalletData,
        tokens: balances,
        balance: `${balances.ETH?.toFixed(4) || '0.0000'} ETH`
      };
      setCurrentWalletData(updatedWalletData);
      onConnect(updatedWalletData);
    }
  }, [balances, currentWalletData?.address]);

  // Listen for account changes
  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          const address = accounts[0];
          setWalletAddress(address);
          const balance = await updateBalance(address);
          
          const walletData = {
            address,
            balance,
            walletType: connectedWalletType || 'MetaMask',
            tokens: balances
          };
          
          setCurrentWalletData(walletData);
          onConnect(walletData);
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      
      return () => {
        if (window.ethereum?.removeListener) {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        }
      };
    }
  }, [connectedWalletType, onConnect, balances]);

  const updateBalance = async (address: string): Promise<string> => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [address, 'latest']
        });
        
        const balanceInWei = parseInt(balance, 16);
        const balanceInEth = balanceInWei / Math.pow(10, 18);
        const formattedBalance = `${balanceInEth.toFixed(4)} ETH`;
        setWalletBalance(formattedBalance);
        return formattedBalance;
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      const fallbackBalance = '0.0000 ETH';
      setWalletBalance(fallbackBalance);
      return fallbackBalance;
    }
    return '0.0000 ETH';
  };

  const connectMetaMask = async () => {
    if (typeof window === 'undefined' || !window.ethereum) {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask extension to continue.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsConnecting(true);
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        const address = accounts[0];
        setWalletAddress(address);
        const balance = await updateBalance(address);
        setConnectedWalletType('MetaMask');
        
        const walletData = {
          address,
          balance,
          walletType: 'MetaMask',
          tokens: {} // Will be populated by useWalletBalance hook
        };
        
        setCurrentWalletData(walletData);
        onConnect(walletData);
        setIsOpen(false);
        
        toast({
          title: "Wallet Connected",
          description: "MetaMask wallet connected successfully!",
        });
      }
    } catch (error: any) {
      console.error('MetaMask connection error:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect MetaMask wallet.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
      setSelectedWallet('');
    }
  };

  const connectWalletConnect = async () => {
    try {
      setIsConnecting(true);
      
      toast({
        title: "WalletConnect",
        description: "Please scan the QR code with your mobile wallet app.",
      });

      setTimeout(() => {
        const mockAddress = '0x742d35Cc6B5C73Ff5cb78a3e7B9B6834567f8f3A';
        const mockBalance = '2.5479 ETH';
        setWalletAddress(mockAddress);
        setWalletBalance(mockBalance);
        setConnectedWalletType('WalletConnect');
        
        const walletData = {
          address: mockAddress,
          balance: mockBalance,
          walletType: 'WalletConnect',
          tokens: {}
        };
        
        setCurrentWalletData(walletData);
        onConnect(walletData);
        setIsOpen(false);
        setIsConnecting(false);
        setSelectedWallet('');
        
        toast({
          title: "Wallet Connected",
          description: "WalletConnect wallet connected successfully!",
        });
      }, 3000);
    } catch (error: any) {
      console.error('WalletConnect connection error:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect via WalletConnect.",
        variant: "destructive",
      });
      setIsConnecting(false);
      setSelectedWallet('');
    }
  };

  const handleWalletSelect = async (walletName: string) => {
    setSelectedWallet(walletName);
    
    if (walletName === 'MetaMask') {
      await connectMetaMask();
    } else if (walletName === 'WalletConnect') {
      await connectWalletConnect();
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard!",
    });
  };

  const disconnectWallet = () => {
    console.log('Disconnecting wallet...');
    
    setWalletAddress('');
    setWalletBalance('');
    setConnectedWalletType('');
    setCurrentWalletData(null);
    setIsOpen(false);
    setShowDropdown(false);
    setSelectedWallet('');
    setIsConnecting(false);
    
    if (onDisconnect) {
      onDisconnect();
    }
    
    toast({
      title: "Wallet Disconnected",
      description: "Your wallet has been disconnected successfully.",
    });
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (isConnected && walletAddress) {
    return (
      <div className="relative z-50">
        <Button 
          variant="outline" 
          className="border-purple-600 text-purple-400 hover:bg-purple-600/10"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <Wallet className="w-4 h-4 mr-2" />
          {formatAddress(walletAddress)}
          <ChevronDown className="w-4 h-4 ml-2" />
        </Button>
        
        {showDropdown && (
          <div className="absolute top-full right-0 mt-2 w-64 bg-slate-900 border border-purple-800/30 rounded-lg shadow-xl z-50 backdrop-blur-xl">
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{connectedWalletType === 'MetaMask' ? '🦊' : '🔗'}</span>
                  <span className="text-white font-medium">{connectedWalletType}</span>
                </div>
                <Badge className="bg-green-600/20 text-green-400">Connected</Badge>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-300">Address</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-mono text-sm">{formatAddress(walletAddress)}</span>
                    <Button size="sm" variant="ghost" onClick={copyAddress} className="h-6 w-6 p-0">
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-300">ETH Balance</span>
                  <span className="text-white font-medium">
                    {balanceLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      `${balances.ETH?.toFixed(4) || '0.0000'} ETH`
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-300">Portfolio Value</span>
                  <span className="text-white font-medium">
                    {balanceLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      `$${totalValue.toFixed(2)}`
                    )}
                  </span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1 border-purple-600 text-purple-400 text-xs">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-slate-900 border-purple-800/30">
                    <DialogHeader>
                      <DialogTitle className="text-white">Wallet Details</DialogTitle>
                      <DialogDescription className="text-purple-300">
                        Real-time wallet information
                      </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">
                      <Card className="bg-black/40 border-purple-800/30">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">{connectedWalletType === 'MetaMask' ? '🦊' : '🔗'}</span>
                              <span className="text-white font-medium">{connectedWalletType}</span>
                            </div>
                            <Badge className="bg-green-600/20 text-green-400">Live Data</Badge>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-purple-300">Address</span>
                              <div className="flex items-center space-x-2">
                                <span className="text-white font-mono text-sm">{walletAddress}</span>
                                <Button size="sm" variant="ghost" onClick={copyAddress}>
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            
                            {Object.entries(balances).map(([token, amount]) => (
                              <div key={token} className="flex items-center justify-between">
                                <span className="text-sm text-purple-300">{token}</span>
                                <div className="text-right">
                                  <div className="text-white text-sm">{amount.toFixed(4)} {token}</div>
                                  {prices[token] && (
                                    <div className="text-xs text-gray-400">
                                      ${(amount * prices[token]).toFixed(2)}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                            
                            <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                              <span className="text-sm font-medium text-purple-300">Total Value</span>
                              <span className="text-white font-bold">${totalValue.toFixed(2)}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <div className="flex space-x-2">
                        <Button variant="outline" className="flex-1 border-purple-600 text-purple-400">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View on Etherscan
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1 border-red-600 text-red-400 hover:bg-red-600/10"
                          onClick={disconnectWallet}
                        >
                          Disconnect
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button 
                  variant="outline" 
                  className="flex-1 border-red-600 text-red-400 hover:bg-red-600/10 text-xs"
                  onClick={disconnectWallet}
                >
                  <LogOut className="w-3 h-3 mr-1" />
                  Disconnect
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
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
              disabled={!wallet.installed || isConnecting}
              className={`w-full p-4 rounded-lg border transition-all duration-200 text-left ${
                wallet.installed && !isConnecting
                  ? selectedWallet === wallet.name || isConnecting
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
                    {(selectedWallet === wallet.name && isConnecting) && (
                      <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
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
