
import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface BlockchainData {
  balance?: any;
  tokens?: any;
  transactions?: any;
  nfts?: any;
}

export const useBlockchainData = () => {
  const [data, setData] = useState<BlockchainData>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchBlockchainData = async (
    walletAddress: string,
    dataType: 'balance' | 'tokens' | 'transactions' | 'nfts',
    chain: string = 'ethereum'
  ) => {
    setIsLoading(true);
    
    try {
      const { data: result, error } = await supabase.functions.invoke('blockchain-data', {
        body: {
          walletAddress,
          chain,
          dataType
        }
      });

      if (error) {
        console.error('Error fetching blockchain data:', error);
        
        let errorMessage = "Failed to fetch blockchain data.";
        if (error.message?.includes('Rate limit exceeded')) {
          errorMessage = "Rate limit exceeded. Please try again in an hour.";
        } else if (error.message?.includes('Invalid wallet address')) {
          errorMessage = "Invalid wallet address format.";
        }

        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        
        return null;
      }

      setData(prev => ({
        ...prev,
        [dataType]: result
      }));

      return result;

    } catch (error) {
      console.error('Unexpected error fetching blockchain data:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while fetching blockchain data.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    fetchBlockchainData
  };
};
