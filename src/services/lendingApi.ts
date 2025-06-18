
import { supabase } from "@/integrations/supabase/client";
import { Chain, Asset, LendingPosition, Transaction } from "@/types/lending";

export const fetchChains = async (): Promise<Chain[]> => {
  const { data, error } = await supabase
    .from('supported_chains')
    .select('*')
    .eq('is_active', true)
    .order('chain_name');

  if (error) throw error;
  return data || [];
};

export const fetchAssets = async (): Promise<Asset[]> => {
  const { data, error } = await supabase
    .from('lending_assets')
    .select(`
      *,
      supported_chains (chain_name, native_token)
    `)
    .eq('is_active', true)
    .order('token_symbol');

  if (error) throw error;
  return data || [];
};

export const fetchPositions = async (): Promise<LendingPosition[]> => {
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
  
  // Type cast the position_type to ensure TypeScript compatibility
  const typedPositions = (data || []).map(position => ({
    ...position,
    position_type: position.position_type as 'lend' | 'borrow'
  }));
  
  return typedPositions;
};

export const fetchTransactions = async (): Promise<Transaction[]> => {
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
  return data || [];
};

export const createLendingPosition = async (
  assetId: string,
  positionType: 'lend' | 'borrow',
  amount: number,
  apyRate: number
): Promise<boolean> => {
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
  return true;
};

export const createTransaction = async (
  transactionType: string,
  assetId: string,
  amount: number,
  fromChainId?: string,
  toChainId?: string
): Promise<boolean> => {
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
  return true;
};
