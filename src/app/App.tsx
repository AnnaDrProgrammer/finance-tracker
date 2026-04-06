import { useMemo, useState, useEffect } from 'react';
import { useLocalStorage } from '../shared/lib/hooks/useLocalStorage';
import { usePiggyBank } from '../shared/lib/hooks/usePiggyBank';
import './App.css';
import { AddTransactionForm } from '../features/add-transaction/ui/AddTransactionForm';
import { BalanceSummary } from '../widgets/balance-summary/ui/BalanceSummary';
import { FilterInput } from '../widgets/filter/ui/FilterInput';
import { TransactionList } from '../entities/transaction/ui/TransactionList';
import { Card } from '../shared/ui/card';
import type { Transaction } from '../shared/types/transaction';
import { ReportsPage } from '../pages/reports/ui/ReportsPage';
import { PiggyBankPage } from '../pages/piggy-bank/ui/PiggyBankPage';
import { IncomeExpenseChartMini } from '../features/reports/ui/IncomeExpenseChartMini';
import { PiggyBankMini } from '../features/piggy-bank/ui/PiggyBankMini';

function App() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
    'transactions',
    [],
  );
  const [filter, setFilter] = useState('');
  const [showReports, setShowReports] = useState(false);
  const [showPiggyBank, setShowPiggyBank] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Для принудительного обновления

  const { getTotalInPiggyBank, getAvailableBalance } = usePiggyBank();

  const handleAddTransaction = (
    title: string,
    amount: number,
    type: 'income' | 'expense',
  ) => {
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      title,
      amount,
      type,
    };
    setTransactions([...transactions, newTransaction]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const filteredTransactions = useMemo(() => {
    if (!filter.trim()) return transactions;

    return transactions.filter((transaction) =>
      transaction.title.toLowerCase().includes(filter.toLowerCase()),
    );
  }, [transactions, filter]);

  // Вычисляем баланс с учетом копилки
  const totalBalance = transactions.reduce(
    (sum, t) => (t.type === 'income' ? sum + t.amount : sum - t.amount),
    0,
  );
  const totalInPiggyBank = getTotalInPiggyBank();
  const availableBalance = getAvailableBalance(totalBalance);

  // Функция для обновления баланса после операций с копилкой
  const handleUpdateBalance = () => {
    setRefreshKey((prev) => prev + 1);
    // Принудительно обновляем транзакции
    setTransactions([...transactions]);
  };

  // Показываем страницу отчетов
  if (showReports) {
    return <ReportsPage onBack={() => setShowReports(false)} />;
  }

  // Показываем страницу копилки
  if (showPiggyBank) {
    return (
      <PiggyBankPage
        onBack={() => setShowPiggyBank(false)}
        onUpdateBalance={handleUpdateBalance}
      />
    );
  }

  // Главная страница
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container max-w-2xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Учет доходов и расходов
          </h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowPiggyBank(true)}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
            >
              🐷 Копилка
            </button>
            <button
              onClick={() => setShowReports(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              📊 Отчеты
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <AddTransactionForm onAddTransaction={handleAddTransaction} />
          </Card>

          <Card className="p-6">
            <BalanceSummary transactions={filteredTransactions} />
          </Card>

          {/* Мини-версия копилки */}
          <PiggyBankMini
            totalInPiggyBank={totalInPiggyBank}
            availableBalance={availableBalance}
            totalBalance={totalBalance}
            onGoToPage={() => setShowPiggyBank(true)}
          />

          <Card className="p-6">
            <FilterInput filter={filter} onFilterChange={setFilter} />
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Список транзакций
            </h2>
            <TransactionList
              transactions={filteredTransactions}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </Card>

          {/* Мини-версия диаграммы */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-center text-gray-900">
              Соотношение доходов и расходов
            </h2>
            <IncomeExpenseChartMini transactions={filteredTransactions} />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;
