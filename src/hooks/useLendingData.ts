
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Chain, Asset, LendingPosition, Transaction } from "@/types/lending";
import {
  fetchChains,
  fetchAssets,
  fetchPositions,
  fetchTransactions,
  createLendingPosition as apiCreateLendingPosition,
  createTransaction as apiCreateTransaction
} from "@/services/lendingApi";

export const useLendingData = () => {
  const [chains, setChains] = useState<Chain[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [positions, setPositions] = useState<LendingPosition[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadChains = async () => {
    try {
      const data = await fetchChains();
      setChains(data);
    } catch (error) {
      console.error('Error fetching chains:', error);
      toast({
        title: "Error",
        description: "Failed to fetch supported chains",
        variant: "destructive",
      });
    }
  };

  const loadAssets = async () => {
    try {
      const data = await fetchAssets();
      setAssets(data);
    } catch (error) {
      console.error('Error fetching assets:', error);
      toast({
        title: "Error",
        description: "Failed to fetch lending assets",
        variant: "destructive",
      });
    }
  };

  const loadPositions = async () => {
    try {
      const data = await fetchPositions();
      setPositions(data);
    } catch (error) {
      console.error('Error fetching positions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch lending positions",
        variant: "destructive",
      });
    }
  };

  const loadTransactions = async () => {
    try {
      const data = await fetchTransactions();
      setTransactions(data);
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
      await apiCreateLendingPosition(assetId, positionType, amount, apyRate);

      toast({
        title: "Success",
        description: `${positionType === 'lend' ? 'Lending' : 'Borrowing'} position created successfully`,
      });

      await loadPositions();
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
      await apiCreateTransaction(transactionType, assetId, amount, fromChainId, toChainId);

      toast({
        title: "Success",
        description: `${transactionType} transaction initiated successfully`,
      });

      await loadTransactions();
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

  const refetch = () => {
    loadChains();
    loadAssets();
    loadPositions();
    loadTransactions();
  };

  useEffect(() => {
    refetch();
  }, []);

  return {
    chains,
    assets,
    positions,
    transactions,
    isLoading,
    createLendingPosition,
    createTransaction,
    refetch
  };
};
