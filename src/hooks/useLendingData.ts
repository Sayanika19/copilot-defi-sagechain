
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Chain {
  id: string;
  chain_name: string;
  chain_id: number;
  native_token: string;
  is_active: boolean;
}

interface Asset {
  id: string;
  chain_id: string;
  token_symbol: string;
  token_name: string;
  token_address: string;
  lending_apy: number;
  borrowing_apy: number;
  max_ltv: number;
  is_active: boolean;
}

interface LendingPosition {
  id: string;
  asset_id: string;
  position_type: 'lend' | 'borrow';
  amount: number;
  initial_amount: number;
  accrued_interest: number;
  apy_rate: number;
  status: string;
  created_at: string;
}

interface Transaction {
  id: string;
  transaction_type: string;
  from_chain_id?: string;
  to_chain_id?: string;
  asset_id: string;
  amount: number;
  status: string;
  created_at: string;
}

export const useLendingData = () => {
  const [chains, setChains] = useState<Chain[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [positions, setPositions] = useState<LendingPosition[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchChains = async () => {
    try {
      const { data, error } = await supabase
        .from('supported_chains')
        .select('*')
        .eq('is_active', true)
        .order('chain_name');

      if (error) throw error;
      setChains(data || []);
    } catch (error) {
      console.error('Error fetching chains:', error);
      toast({
        title: "Error",
        description: "Failed to fetch supported chains",
        variant: "destructive",
      });
    }
  };

  const fetchAssets = async () => {
    try {
      const { data, error } = await supabase
        .from('lending_assets')
        .select(`
          *,
          supported_chains (chain_name, native_token)
        `)
        .eq('is_active', true)
        .order('token_symbol');

      if (error) throw error;
      setAssets(data || []);
    } catch (error) {
      console.error('Error fetching assets:', error);
      toast({
        title: "Error",
        description: "Failed to fetch lending assets",
        variant: "destructive",
      });
    }
  };

  const fetchPositions = async () => {
    try {
      const { data, error } = await supabase
        .from('lending_positions')
        .select(`
          *,
          lending_assets (
            token_symbol,
            token_name,
            supported_chains (chain_name)
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPositions(data || []);
    } catch (error) {
      console.error('Error fetching positions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch lending positions",
        variant: "destructive",
      });
    }
  };

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('cross_chain_transactions')
        .select(`
          *,
          lending_assets (token_symbol),
          from_chain:supported_chains!cross_chain_transactions_from_chain_id_fkey (chain_name),
          to_chain:supported_chains!cross_chain_transactions_to_chain_id_fkey (chain_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setTransactions(data || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch transactions",
        variant: "destructive",
      });
    }
  };

  const createLendingPosition = async (
    assetId: string,
    positionType: 'lend' | 'borrow',
    amount: number,
    apyRate: number
  ) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('lending_positions')
        .insert({
          user_id: user.id,
          asset_id: assetId,
          position_type: positionType,
          amount: amount,
          initial_amount: amount,
          apy_rate: apyRate
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `${positionType === 'lend' ? 'Lending' : 'Borrowing'} position created successfully`,
      });

      await fetchPositions();
      return true;
    } catch (error) {
      console.error('Error creating position:', error);
      toast({
        title: "Error",
        description: "Failed to create position",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createTransaction = async (
    transactionType: string,
    assetId: string,
    amount: number,
    fromChainId?: string,
    toChainId?: string
  ) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('cross_chain_transactions')
        .insert({
          user_id: user.id,
          transaction_type: transactionType,
          asset_id: assetId,
          amount: amount,
          from_chain_id: fromChainId,
          to_chain_id: toChainId,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: `${transactionType} transaction initiated successfully`,
      });

      await fetchTransactions();
      return true;
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast({
        title: "Error",
        description: "Failed to create transaction",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChains();
    fetchAssets();
    fetchPositions();
    fetchTransactions();
  }, []);

  return {
    chains,
    assets,
    positions,
    transactions,
    isLoading,
    createLendingPosition,
    createTransaction,
    refetch: () => {
      fetchChains();
      fetchAssets();
      fetchPositions();
      fetchTransactions();
    }
  };
};
