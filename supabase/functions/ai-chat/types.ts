
export interface ChatRequest {
  message: string;
  intent?: string;
  walletData?: {
    address: string;
    balance: string;
    walletType: string;
    tokens?: { [key: string]: number };
  } | null;
}

export interface ChatResponse {
  response: string;
  requiresWeb3?: boolean;
}
