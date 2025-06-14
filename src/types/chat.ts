
export interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  action?: string;
  intent?: string;
  requiresWeb3?: boolean;
}
