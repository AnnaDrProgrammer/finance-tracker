import type { Transaction } from '../../../shared/lib/types/transaction';
import { Button } from '../../../shared/lib/ui/button';

interface TransactionItemProps {
  transaction: Transaction;
  onDelete: (id: string) => void;
}

export const TransactionItem = ({
  transaction,
  onDelete,
}: TransactionItemProps) => {
  const isIncome = transaction.type === 'income';

  return (
    <div className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
      <div className="flex-1">
        <h3 className="font-medium">{transaction.title}</h3>
        <span className={isIncome ? 'text-green-600' : 'text-red-600'}>
          {isIncome ? '+' : '-'} {transaction.amount} rub
        </span>
      </div>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => onDelete(transaction.id)}
      >
        Удалить
      </Button>
    </div>
  );
};
