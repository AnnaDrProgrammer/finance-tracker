export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: TransactionType;
}

export interface TransactionState {
  transactions: Transaction[];
}
