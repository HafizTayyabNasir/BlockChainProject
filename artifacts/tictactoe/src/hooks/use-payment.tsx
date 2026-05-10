import { useState, useCallback } from "react";
import { useToast } from "./use-toast";

interface PaymentMethod {
  id: string;
  cardNumber: string;
  expiryDate: string;
  cardholderName: string;
}

interface Transaction {
  id: string;
  amount: number;
  credits: number;
  date: string;
  status: "completed" | "pending" | "failed";
}

interface UsePaymentReturn {
  paymentMethods: PaymentMethod[];
  transactions: Transaction[];
  isLoading: boolean;
  processPayment: (amount: number, cardDetails: PaymentMethod) => Promise<void>;
  addPaymentMethod: (details: PaymentMethod) => Promise<void>;
  removePaymentMethod: (id: string) => Promise<void>;
  getTransactionHistory: () => Transaction[];
}

export function usePayment(): UsePaymentReturn {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const processPayment = useCallback(async (amount: number, cardDetails: PaymentMethod) => {
    setIsLoading(true);
    try {
      // Simulate Stripe API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const transaction: Transaction = {
        id: `txn-${Date.now()}`,
        amount,
        credits: Math.floor(amount / 0.05), // $0.05 per credit example
        date: new Date().toISOString(),
        status: "completed"
      };

      setTransactions((prev) => [transaction, ...prev]);
      toast({
        title: "Success",
        description: `Payment of $${amount.toFixed(2)} processed successfully!`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Payment processing failed. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const addPaymentMethod = useCallback(async (details: PaymentMethod) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPaymentMethods((prev) => [...prev, { ...details, id: `pm-${Date.now()}` }]);
      toast({
        title: "Success",
        description: "Payment method added successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add payment method.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const removePaymentMethod = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setPaymentMethods((prev) => prev.filter((pm) => pm.id !== id));
      toast({
        title: "Success",
        description: "Payment method removed successfully!"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove payment method.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const getTransactionHistory = useCallback(() => {
    return transactions;
  }, [transactions]);

  return {
    paymentMethods,
    transactions,
    isLoading,
    processPayment,
    addPaymentMethod,
    removePaymentMethod,
    getTransactionHistory
  };
}
