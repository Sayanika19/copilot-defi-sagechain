
export interface Chain {
  id: string;
  chain_name: string;
  chain_id: number;
  native_token: string;
  is_active: boolean;
}

export interface Asset {
  id: string;
  chain_id: string;
  token_symbol: string;
  token_name: string;
  token_address: string;
  lending_apy: number;
  borrowing_apy: number;
  max_ltv: number;
  is_active: boolean;
  supported_chains?: {
    chain_name: string;
    native_token: string;
  };
}

export interface LendingPosition {
  id: string;
  asset_id: string;
  position_type: 'lend' | 'borrow';
  amount: number;
  initial_amount: number;
  accrued_interest: number;
  apy_rate: number;
  status: string;
  created_at: string;
  lending_assets?: {
    token_symbol: string;
    token_name: string;
    supported_chains: {
      chain_name: string;
    };
  };
}

export interface Transaction {
  id: string;
  transaction_type: string;
  from_chain_id?: string;
  to_chain_id?: string;
  asset_id: string;
  amount: number;
  status: string;
  created_at: string;
  lending_assets?: {
    token_symbol: string;
  };
  from_chain?: {
    chain_name: string;
  };
  to_chain?: {
    chain_name: string;
  };
}
