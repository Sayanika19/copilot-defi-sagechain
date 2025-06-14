
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Droplets, Coins, ImageIcon, ExternalLink, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WalletData } from "../WalletConnector";

interface InvestmentPositionsProps {
  isConnected: boolean;
  walletData?: WalletData | null;
}

interface DeFiPosition {
  id: string;
  protocol: string;
  type: 'lending' | 'borrowing' | 'liquidity' | 'staking' | 'farming';
  asset: string;
  amount: number;
  value: number;
  apy: number;
  rewards: number;
  chain: string;
  health?: number; // For borrowing positions
  logo: string;
}

interface NFTPosition {
  id: string;
  collection: string;
  tokenId: string;
  name: string;
  floorPrice: number;
  lastSale: number;
  chain: string;
  image: string;
}

const InvestmentPositions = ({ isConnected, walletData }: InvestmentPositionsProps) => {
  const generateDeFiPositions = (): DeFiPosition[] => {
    if (!walletData?.balance || !isConnected) return [];
    
    const ethAmount = parseFloat(walletData.balance.replace(' ETH', ''));
    const portfolioValue = ethAmount * 2800;
    
    const positions = [];
    
    if (ethAmount > 1) {
      positions.push({
        id: '1',
        protocol: 'Aave V3',
        type: 'lending' as const,
        asset: 'ETH',
        amount: ethAmount * 0.4,
        value: portfolioValue * 0.4,
        apy: 4.2,
        rewards: 28.5,
        chain: 'Ethereum',
        logo: '🌊'
      });
    }
    
    if (ethAmount > 2) {
      positions.push({
        id: '2',
        protocol: 'Uniswap V3',
        type: 'liquidity' as const,
        asset: 'ETH/USDC',
        amount: portfolioValue * 0.25,
        value: portfolioValue * 0.25,
        apy: 12.5,
        rewards: 45.2,
        chain: 'Ethereum',
        logo: '🦄'
      });
    }
    
    if (ethAmount > 3) {
      positions.push({
        id: '3',
        protocol: 'Lido',
        type: 'staking' as const,
        asset: 'stETH',
        amount: ethAmount * 0.2,
        value: portfolioValue * 0.2,
        apy: 3.8,
        rewards: 15.7,
        chain: 'Ethereum',
        logo: '🔥'
      });
    }
    
    if (portfolioValue > 5000) {
      positions.push({
        id: '4',
        protocol: 'Compound',
        type: 'borrowing' as const,
        asset: 'USDC',
        amount: 2500,
        value: 2500,
        apy: -5.5,
        rewards: 0,
        chain: 'Ethereum',
        health: 78,
        logo: '🏦'
      });
    }
    
    return positions;
  };

  const generateNFTPositions = (): NFTPosition[] => {
    if (!walletData?.balance || !isConnected) return [];
    
    const ethAmount = parseFloat(walletData.balance.replace(' ETH', ''));
    
    if (ethAmount > 5) {
      return [
        {
          id: '1',
          collection: 'Azuki',
          tokenId: '1337',
          name: 'Azuki #1337',
          floorPrice: 8.5,
          lastSale: 12.2,
          chain: 'Ethereum',
          image: '🎌'
        },
        {
          id: '2',
          collection: 'Pudgy Penguins',
          tokenId: '420',
          name: 'Pudgy Penguin #420',
          floorPrice: 3.2,
          lastSale: 4.1,
          chain: 'Ethereum',
          image: '🐧'
        }
      ];
    }
    
    return [];
  };

  const getPositionTypeIcon = (type: DeFiPosition['type']) => {
    switch (type) {
      case 'lending':
        return <Coins className="w-4 h-4 text-green-400" />;
      case 'borrowing':
        return <AlertCircle className="w-4 h-4 text-red-400" />;
      case 'liquidity':
        return <Droplets className="w-4 h-4 text-blue-400" />;
      case 'staking':
        return <TrendingUp className="w-4 h-4 text-purple-400" />;
      case 'farming':
        return <Coins className="w-4 h-4 text-yellow-400" />;
      default:
        return <Coins className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPositionTypeColor = (type: DeFiPosition['type']) => {
    switch (type) {
      case 'lending':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'borrowing':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'liquidity':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'staking':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'farming':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatPositionType = (type: DeFiPosition['type']) => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const defiPositions = generateDeFiPositions();
  const nftPositions = generateNFTPositions();
  const totalDeFiValue = defiPositions.reduce((sum, pos) => sum + pos.value, 0);
  const totalNFTValue = nftPositions.reduce((sum, nft) => sum + (nft.floorPrice * 2800), 0);

  if (!isConnected) {
    return (
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            🧠 Investment Positions
          </CardTitle>
          <CardDescription className="text-purple-300">
            Connect your wallet to view DeFi and NFT positions
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* DeFi Positions */}
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                🧠 DeFi Positions
              </CardTitle>
              <CardDescription className="text-purple-300">
                Active DeFi investments and smart contract positions
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-white">${totalDeFiValue.toLocaleString()}</div>
              <div className="text-sm text-purple-300">Total Value</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {defiPositions.length > 0 ? (
            <div className="space-y-4">
              {defiPositions.map((position) => (
                <div key={position.id} className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{position.logo}</div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-medium">{position.protocol}</span>
                          <Badge className={getPositionTypeColor(position.type)}>
                            {getPositionTypeIcon(position.type)}
                            <span className="ml-1">{formatPositionType(position.type)}</span>
                          </Badge>
                          <Badge variant="outline" className="border-purple-600 text-purple-300 text-xs">
                            {position.chain}
                          </Badge>
                        </div>
                        <div className="text-sm text-purple-300">{position.asset}</div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-purple-400 hover:text-white">
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-xs text-slate-400 uppercase tracking-wide">Amount</div>
                      <div className="text-white font-medium">
                        {typeof position.amount === 'number' && position.amount < 100
                          ? position.amount.toFixed(4)
                          : position.amount.toLocaleString()
                        }
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 uppercase tracking-wide">Value</div>
                      <div className="text-white font-medium">${position.value.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 uppercase tracking-wide">APY</div>
                      <div className={`font-medium ${position.apy > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {position.apy > 0 ? '+' : ''}{position.apy}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 uppercase tracking-wide">
                        {position.type === 'borrowing' ? 'Health' : 'Rewards'}
                      </div>
                      {position.type === 'borrowing' && position.health ? (
                        <div className="space-y-1">
                          <div className={`font-medium ${position.health > 50 ? 'text-green-400' : 'text-red-400'}`}>
                            {position.health}%
                          </div>
                          <Progress value={position.health} className="h-1" />
                        </div>
                      ) : (
                        <div className="text-green-400 font-medium">${position.rewards}</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-purple-300">No DeFi positions found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* NFT Positions */}
      <Card className="bg-black/40 border-purple-800/30 backdrop-blur-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                NFT Collection
              </CardTitle>
              <CardDescription className="text-purple-300">
                Your NFT holdings and floor prices
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-white">${totalNFTValue.toLocaleString()}</div>
              <div className="text-sm text-purple-300">Floor Value</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {nftPositions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {nftPositions.map((nft) => (
                <div key={nft.id} className="p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="text-3xl">{nft.image}</div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{nft.name}</div>
                      <div className="text-sm text-purple-300">{nft.collection}</div>
                      <Badge variant="outline" className="border-purple-600 text-purple-300 text-xs mt-1">
                        {nft.chain}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-slate-400 uppercase tracking-wide">Floor Price</div>
                      <div className="text-white font-medium">{nft.floorPrice} ETH</div>
                      <div className="text-xs text-slate-400">${(nft.floorPrice * 2800).toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 uppercase tracking-wide">Last Sale</div>
                      <div className="text-white font-medium">{nft.lastSale} ETH</div>
                      <div className={`text-xs ${nft.lastSale > nft.floorPrice ? 'text-green-400' : 'text-red-400'}`}>
                        {((nft.lastSale - nft.floorPrice) / nft.floorPrice * 100).toFixed(1)}% vs Floor
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-purple-300">No NFTs found in your wallet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestmentPositions;
