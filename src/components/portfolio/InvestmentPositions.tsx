
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Coins, Image, ExternalLink, AlertTriangle } from "lucide-react";
import { WalletData } from "../WalletConnector";

interface DeFiPosition {
  protocol: string;
  type: 'lending' | 'borrowing' | 'liquidity' | 'staking' | 'farming';
  asset: string;
  amount: number;
  value: number;
  apy: number;
  chain: string;
  risk: 'low' | 'medium' | 'high';
}

interface NFTPosition {
  collection: string;
  tokenId: string;
  name: string;
  floorPrice: number;
  lastSale: number;
  chain: string;
}

interface InvestmentPositionsProps {
  walletData?: WalletData | null;
  isConnected: boolean;
}

const InvestmentPositions = ({ walletData, isConnected }: InvestmentPositionsProps) => {
  // Generate DeFi positions based on wallet value
  const generateDeFiPositions = (): DeFiPosition[] => {
    if (!isConnected || !walletData?.balance) return [];

    const ethAmount = parseFloat(walletData.balance.replace(' ETH', ''));
    const positions: DeFiPosition[] = [];

    if (ethAmount > 1) {
      positions.push({
        protocol: 'Aave V3',
        type: 'lending',
        asset: 'ETH',
        amount: ethAmount * 0.3,
        value: ethAmount * 0.3 * 2800,
        apy: 4.2,
        chain: 'Ethereum',
        risk: 'low'
      });
    }

    if (ethAmount > 2) {
      positions.push({
        protocol: 'Uniswap V3',
        type: 'liquidity',
        asset: 'ETH/USDC',
        amount: ethAmount * 0.2,
        value: ethAmount * 0.2 * 2800,
        apy: 12.5,
        chain: 'Ethereum',
        risk: 'medium'
      });
    }

    if (ethAmount > 3) {
      positions.push({
        protocol: 'Lido',
        type: 'staking',
        asset: 'stETH',
        amount: ethAmount * 0.25,
        value: ethAmount * 0.25 * 2800,
        apy: 3.8,
        chain: 'Ethereum',
        risk: 'low'
      });
    }

    if (ethAmount > 4) {
      positions.push({
        protocol: 'Compound',
        type: 'borrowing',
        asset: 'USDC',
        amount: 5000,
        value: 5000,
        apy: -8.5,
        chain: 'Ethereum',
        risk: 'medium'
      });
    }

    return positions;
  };

  // Generate NFT positions
  const generateNFTPositions = (): NFTPosition[] => {
    if (!isConnected || !walletData?.balance) return [];

    const ethAmount = parseFloat(walletData.balance.replace(' ETH', ''));
    const nfts: NFTPosition[] = [];

    if (ethAmount > 5) {
      nfts.push({
        collection: 'Bored Ape Yacht Club',
        tokenId: '4821',
        name: 'BAYC #4821',
        floorPrice: 24.5,
        lastSale: 28.2,
        chain: 'Ethereum'
      });
    }

    if (ethAmount > 8) {
      nfts.push({
        collection: 'CryptoPunks',
        tokenId: '7394',
        name: 'CryptoPunk #7394',
        floorPrice: 62.1,
        lastSale: 58.9,
        chain: 'Ethereum'
      });
    }

    return nfts;
  };

  const defiPositions = generateDeFiPositions();
  const nftPositions = generateNFTPositions();

  const getTotalDeFiValue = () => defiPositions.reduce((sum, pos) => sum + pos.value, 0);
  const getTotalNFTValue = () => nftPositions.reduce((sum, nft) => sum + (nft.floorPrice * 2800), 0);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-900/30 text-green-300 border-green-600';
      case 'medium': return 'bg-yellow-900/30 text-yellow-300 border-yellow-600';
      case 'high': return 'bg-red-900/30 text-red-300 border-red-600';
      default: return 'bg-gray-900/30 text-gray-300 border-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'lending': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'borrowing': return <TrendingUp className="w-4 h-4 text-red-400 rotate-180" />;
      case 'liquidity': return <Coins className="w-4 h-4 text-blue-400" />;
      case 'staking': return <Coins className="w-4 h-4 text-purple-400" />;
      case 'farming': return <Coins className="w-4 h-4 text-yellow-400" />;
      default: return <Coins className="w-4 h-4 text-gray-400" />;
    }
  };

  if (!isConnected) {
    return (
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            🧠 Investment Positions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-purple-300">Connect your wallet to view your investment positions</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          🧠 Investment Positions
        </CardTitle>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="p-3 bg-slate-800/30 rounded-lg">
            <p className="text-xs text-purple-300">Total DeFi Value</p>
            <p className="text-lg font-bold text-white">${getTotalDeFiValue().toLocaleString()}</p>
            <p className="text-xs text-green-400">{defiPositions.length} active positions</p>
          </div>
          
          <div className="p-3 bg-slate-800/30 rounded-lg">
            <p className="text-xs text-purple-300">Total NFT Value</p>
            <p className="text-lg font-bold text-white">${getTotalNFTValue().toLocaleString()}</p>
            <p className="text-xs text-blue-400">{nftPositions.length} NFTs owned</p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue="defi" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
            <TabsTrigger value="defi" className="text-purple-300 data-[state=active]:text-white">DeFi Positions</TabsTrigger>
            <TabsTrigger value="nfts" className="text-purple-300 data-[state=active]:text-white">NFTs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="defi" className="mt-6">
            <div className="space-y-3">
              {defiPositions.map((position, index) => (
                <div key={index} className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getTypeIcon(position.type)}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-medium">{position.protocol}</span>
                          <Badge variant="outline" className="border-blue-600 text-blue-300 text-xs">
                            {position.type}
                          </Badge>
                          <Badge variant="outline" className={getRiskColor(position.risk)}>
                            {position.risk} risk
                          </Badge>
                        </div>
                        <div className="text-sm text-purple-300">{position.asset} • {position.chain}</div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-white font-medium">${position.value.toLocaleString()}</div>
                      <div className="text-sm text-slate-400">{position.amount.toFixed(4)} {position.asset.split('/')[0]}</div>
                      <div className={`text-sm font-medium ${position.apy >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {position.apy >= 0 ? '+' : ''}{position.apy}% APY
                      </div>
                    </div>
                  </div>
                  
                  {position.risk === 'high' && (
                    <div className="mt-3 p-2 bg-red-900/20 rounded border border-red-800/30 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                      <span className="text-xs text-red-300">High risk position - monitor closely</span>
                    </div>
                  )}
                </div>
              ))}
              
              {defiPositions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-purple-300">No DeFi positions found</p>
                  <p className="text-sm text-slate-400 mt-1">Start earning yield by lending or providing liquidity</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="nfts" className="mt-6">
            <div className="space-y-3">
              {nftPositions.map((nft, index) => (
                <div key={index} className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Image className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium">{nft.name}</div>
                        <div className="text-sm text-purple-300">{nft.collection}</div>
                        <Badge variant="outline" className="border-slate-600 text-slate-300 text-xs mt-1">
                          {nft.chain}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-white font-medium">{nft.floorPrice} ETH</div>
                      <div className="text-sm text-slate-400">Floor Price</div>
                      <div className={`text-xs ${nft.floorPrice > nft.lastSale ? 'text-green-400' : 'text-red-400'}`}>
                        Last: {nft.lastSale} ETH
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                      <ExternalLink className="w-4 h-4 text-purple-400" />
                    </Button>
                  </div>
                </div>
              ))}
              
              {nftPositions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-purple-300">No NFTs found</p>
                  <p className="text-sm text-slate-400 mt-1">Your NFT collection will appear here</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InvestmentPositions;
