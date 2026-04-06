import type { Transaction } from '../../../shared/types/transaction';

interface BalanceSummaryProps {
  transactions: Transaction[];
}

export const BalanceSummary = ({ transactions }: BalanceSummaryProps) => {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;
  const balanceColor = balance >= 0 ? 'text-green-600' : 'text-red-600';

  return (
    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
      <div>
        <p className="text-sm text-gray-600">Общий доход</p>
        <p className="text-xl font-bold text-green-600">{totalIncome} ₽</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Общий расход</p>
        <p className="text-xl font-bold text-red-600">{totalExpense} ₽</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Баланс</p>
        <p className={`text-xl font-bold ${balanceColor}`}>{balance} ₽</p>
      </div>
    </div>
  );
};
