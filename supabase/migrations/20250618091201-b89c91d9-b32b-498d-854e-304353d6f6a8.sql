
-- Create table for supported chains and their details
CREATE TABLE public.supported_chains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chain_name TEXT NOT NULL UNIQUE,
  chain_id INTEGER NOT NULL UNIQUE,
  native_token TEXT NOT NULL,
  rpc_url TEXT NOT NULL,
  explorer_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for supported assets across chains
CREATE TABLE public.lending_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  chain_id UUID REFERENCES public.supported_chains(id) NOT NULL,
  token_symbol TEXT NOT NULL,
  token_name TEXT NOT NULL,
  token_address TEXT NOT NULL,
  decimals INTEGER NOT NULL DEFAULT 18,
  lending_apy DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  borrowing_apy DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  max_ltv DECIMAL(3,2) NOT NULL DEFAULT 0.75,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(chain_id, token_address)
);

-- Create table for user lending positions
CREATE TABLE public.lending_positions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  asset_id UUID REFERENCES public.lending_assets(id) NOT NULL,
  position_type TEXT NOT NULL CHECK (position_type IN ('lend', 'borrow')),
  amount DECIMAL(20,8) NOT NULL DEFAULT 0.00,
  initial_amount DECIMAL(20,8) NOT NULL DEFAULT 0.00,
  accrued_interest DECIMAL(20,8) NOT NULL DEFAULT 0.00,
  apy_rate DECIMAL(5,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed', 'liquidated')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for cross-chain transactions
CREATE TABLE public.cross_chain_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('deposit', 'withdraw', 'lend', 'borrow', 'repay', 'redeem')),
  from_chain_id UUID REFERENCES public.supported_chains(id),
  to_chain_id UUID REFERENCES public.supported_chains(id),
  asset_id UUID REFERENCES public.lending_assets(id) NOT NULL,
  amount DECIMAL(20,8) NOT NULL,
  gas_fee DECIMAL(20,8) DEFAULT 0.00,
  bridge_fee DECIMAL(20,8) DEFAULT 0.00,
  transaction_hash TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'failed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  confirmed_at TIMESTAMP WITH TIME ZONE
);

-- Create table for user portfolio balances across chains
CREATE TABLE public.user_portfolio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  asset_id UUID REFERENCES public.lending_assets(id) NOT NULL,
  available_balance DECIMAL(20,8) NOT NULL DEFAULT 0.00,
  locked_balance DECIMAL(20,8) NOT NULL DEFAULT 0.00,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, asset_id)
);

-- Enable Row Level Security
ALTER TABLE public.supported_chains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lending_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lending_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cross_chain_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_portfolio ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for supported_chains (public read access)
CREATE POLICY "Anyone can view supported chains" 
  ON public.supported_chains 
  FOR SELECT 
  USING (true);

-- Create RLS policies for lending_assets (public read access)
CREATE POLICY "Anyone can view lending assets" 
  ON public.lending_assets 
  FOR SELECT 
  USING (true);

-- Create RLS policies for lending_positions (user-specific access)
CREATE POLICY "Users can view their own lending positions" 
  ON public.lending_positions 
  FOR SELECT 
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own lending positions" 
  ON public.lending_positions 
  FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own lending positions" 
  ON public.lending_positions 
  FOR UPDATE 
  USING (auth.uid()::text = user_id::text);

-- Create RLS policies for cross_chain_transactions (user-specific access)
CREATE POLICY "Users can view their own transactions" 
  ON public.cross_chain_transactions 
  FOR SELECT 
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create their own transactions" 
  ON public.cross_chain_transactions 
  FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own transactions" 
  ON public.cross_chain_transactions 
  FOR UPDATE 
  USING (auth.uid()::text = user_id::text);

-- Create RLS policies for user_portfolio (user-specific access)
CREATE POLICY "Users can view their own portfolio" 
  ON public.user_portfolio 
  FOR SELECT 
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can manage their own portfolio" 
  ON public.user_portfolio 
  FOR ALL 
  USING (auth.uid()::text = user_id::text);

-- Insert initial supported chains
INSERT INTO public.supported_chains (chain_name, chain_id, native_token, rpc_url, explorer_url) VALUES
('Ethereum', 1, 'ETH', 'https://mainnet.infura.io', 'https://etherscan.io'),
('Polygon', 137, 'MATIC', 'https://polygon-rpc.com', 'https://polygonscan.com'),
('Arbitrum', 42161, 'ETH', 'https://arb1.arbitrum.io/rpc', 'https://arbiscan.io'),
('Optimism', 10, 'ETH', 'https://mainnet.optimism.io', 'https://optimistic.etherscan.io'),
('Binance Smart Chain', 56, 'BNB', 'https://bsc-dataseed.binance.org', 'https://bscscan.com');

-- Insert initial lending assets
INSERT INTO public.lending_assets (chain_id, token_symbol, token_name, token_address, lending_apy, borrowing_apy, max_ltv) 
SELECT sc.id, 'ETH', 'Ethereum', '0x0000000000000000000000000000000000000000', 4.25, 6.80, 0.75 FROM public.supported_chains sc WHERE sc.chain_name = 'Ethereum'
UNION ALL
SELECT sc.id, 'USDC', 'USD Coin', '0xA0b86a33E6441b1Dab3A7a0Ca97F70fd85B43E81', 8.50, 12.30, 0.85 FROM public.supported_chains sc WHERE sc.chain_name = 'Ethereum'
UNION ALL
SELECT sc.id, 'MATIC', 'Polygon', '0x0000000000000000000000000000000000000000', 6.75, 9.20, 0.70 FROM public.supported_chains sc WHERE sc.chain_name = 'Polygon'
UNION ALL
SELECT sc.id, 'USDC', 'USD Coin', '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', 9.80, 14.50, 0.85 FROM public.supported_chains sc WHERE sc.chain_name = 'Polygon'
UNION ALL
SELECT sc.id, 'ETH', 'Ethereum', '0x0000000000000000000000000000000000000000', 5.10, 7.95, 0.75 FROM public.supported_chains sc WHERE sc.chain_name = 'Arbitrum'
UNION ALL
SELECT sc.id, 'ETH', 'Ethereum', '0x0000000000000000000000000000000000000000', 4.85, 7.60, 0.75 FROM public.supported_chains sc WHERE sc.chain_name = 'Optimism'
UNION ALL
SELECT sc.id, 'BNB', 'Binance Coin', '0x0000000000000000000000000000000000000000', 3.90, 6.25, 0.70 FROM public.supported_chains sc WHERE sc.chain_name = 'Binance Smart Chain';
