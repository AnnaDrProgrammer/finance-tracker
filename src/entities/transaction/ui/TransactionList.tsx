
import { TransactionItem } from './TransactionItem';
import { EmptyState } from './EmptyState';
import type { Transaction } from '../../../shared/lib/types/transaction';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export const TransactionList = ({
  transactions,
  onDeleteTransaction,
}: TransactionListProps) => {
  if (transactions.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-2">
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          onDelete={onDeleteTransaction}
        />
      ))}
    </div>
  );
};
