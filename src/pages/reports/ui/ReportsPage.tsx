import { useLocalStorage } from '../../../shared/lib/hooks/useLocalStorage';
import { IncomeExpenseChart } from '../../../features/reports/ui/IncomeExpenseChart';
import { Card } from '../../../shared/ui/card';
import type { Transaction } from '../../../shared/types/transaction';
import { usePiggyBank } from '../../../shared/lib/hooks/usePiggyBank';

interface ReportsPageProps {
  onBack: () => void;
}

export const ReportsPage = ({ onBack }: ReportsPageProps) => {
  const [transactions] = useLocalStorage<Transaction[]>('transactions', []);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const transactionsByCategory = transactions.reduce(
    (acc, transaction) => {
      const existing = acc.find((item) => item.name === transaction.title);
      if (existing) {
        existing.amount += transaction.amount;
      } else {
        acc.push({
          name: transaction.title,
          amount: transaction.amount,
          type: transaction.type,
        });
      }
      return acc;
    },
    [] as Array<{ name: string; amount: number; type: 'income' | 'expense' }>,
  );

  const topIncomes = transactionsByCategory
    .filter((item) => item.type === 'income')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const topExpenses = transactionsByCategory
    .filter((item) => item.type === 'expense')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const { getTotalInPiggyBank } = usePiggyBank();
  const totalInPiggyBank = getTotalInPiggyBank();
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <button
          onClick={onBack}
          className="inline-flex items-center mb-6 text-blue-600 hover:text-blue-700"
        >
          ← Назад к транзакциям
        </button>

        <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">
          Детальные отчеты
        </h1>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Общая статистика
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Общий доход</p>
                <p className="text-xl font-bold text-green-600">
                  {totalIncome} ₽
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Общий расход</p>
                <p className="text-xl font-bold text-red-600">
                  {totalExpense} ₽
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Баланс</p>
                <p
                  className={`text-xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}
                >
                  {balance} ₽
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Соотношение доходов и расходов
            </h2>
            <IncomeExpenseChart transactions={transactions} />
          </Card>

          {topIncomes.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">
                Топ доходов
              </h2>
              <div className="space-y-2">
                {topIncomes.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 bg-green-50 rounded"
                  >
                    <span className="text-green-700">{item.name}</span>
                    <span className="font-bold text-green-700">
                      {item.amount} ₽
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {topExpenses.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">
                Топ расходов
              </h2>
              <div className="space-y-2">
                {topExpenses.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 bg-red-50 rounded"
                  >
                    <span className="text-red-700">{item.name}</span>
                    <span className="font-bold text-red-700">
                      {item.amount} ₽
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Детализация операций
            </h2>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <span className="text-green-700">Всего доходов:</span>
                <span className="font-bold text-green-700">
                  {transactions.filter((t) => t.type === 'income').length}{' '}
                  операций
                </span>
              </div>
              <div className="flex justify-between items-center p-2 bg-red-50 rounded">
                <span className="text-red-700">Всего расходов:</span>
                <span className="font-bold text-red-700">
                  {transactions.filter((t) => t.type === 'expense').length}{' '}
                  операций
                </span>
              </div>
            </div>
          </Card>
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              🐷 Копилка
            </h2>
            {totalInPiggyBank > 0 ? (
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-yellow-700">Средства в копилке:</span>
                  <span className="font-bold text-yellow-700 text-xl">
                    {totalInPiggyBank} ₽
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-sm text-center">
                  В копилке пока нет средств
                </p>
                <p className="text-gray-400 text-xs text-center mt-1">
                  Создайте цель и начните копить!
                </p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
