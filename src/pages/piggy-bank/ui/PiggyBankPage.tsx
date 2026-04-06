import { useState, useEffect } from 'react';
import { Card } from '../../../shared/ui/card';
import { Button } from '../../../shared/ui/button';
import { Input } from '../../../shared/ui/input';
import { Label } from '../../../shared/ui/label';
import { Modal } from '../../../shared/ui/modal';
import { usePiggyBank } from '../../../shared/lib/hooks/usePiggyBank';
import { useLocalStorage } from '../../../shared/lib/hooks/useLocalStorage';
import type { Transaction } from '../../../shared/types/transaction';

interface PiggyBankPageProps {
  onBack: () => void;
  onUpdateBalance?: () => void;
}

export const PiggyBankPage = ({
  onBack,
  onUpdateBalance,
}: PiggyBankPageProps) => {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>(
    'transactions',
    [],
  );
  const {
    goals,
    createGoal,
    depositToPiggyBank,
    withdrawFromPiggyBank,
    getTotalInPiggyBank,
    getAvailableBalance,
    getPlannedGoals,
    getCompletedGoals,
    getWithdrawnGoals,
    deleteGoal,
  } = usePiggyBank();

  const [goalAmount, setGoalAmount] = useState('');
  const [goalDays, setGoalDays] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Состояния для модальных окон
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [goalToWithdraw, setGoalToWithdraw] = useState<any>(null);
  const [withdrawMessage, setWithdrawMessage] = useState('');

  // Анимация
  const [completingGoalId, setCompletingGoalId] = useState<string | null>(null);

  const totalBalance = transactions.reduce(
    (sum, t) => (t.type === 'income' ? sum + t.amount : sum - t.amount),
    0,
  );
  const totalInPiggyBank = getTotalInPiggyBank();
  const availableBalance = getAvailableBalance(totalBalance);
  const plannedGoals = getPlannedGoals();
  const completedGoals = getCompletedGoals();
  const withdrawnGoals = getWithdrawnGoals();

  const hasFunds = availableBalance > 0;
  const isBalanceNegativeOrZero = totalBalance <= 0;

  useEffect(() => {
    if (completingGoalId) {
      const timer = setTimeout(() => setCompletingGoalId(null), 1000);
      return () => clearTimeout(timer);
    }
  }, [completingGoalId]);

  const handleCreateGoal = () => {
    const amount = parseFloat(goalAmount);
    const days = parseInt(goalDays);

    if (isNaN(amount) || amount <= 0) {
      setError('Введите корректную сумму');
      return;
    }

    if (isNaN(days) || days <= 0) {
      setError('Введите корректное количество дней');
      return;
    }

    createGoal(amount, days);
    setGoalAmount('');
    setGoalDays('');
    setError('');
    setSuccess(`Цель ${amount} ₽ создана!`);
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleDeposit = (goal: any) => {
    if (!hasFunds || isBalanceNegativeOrZero) {
      setError('Недостаточно средств на балансе');
      return;
    }

    try {
      const amount = depositToPiggyBank(goal.id, totalBalance);
      setCompletingGoalId(goal.id);
      setSuccess(`В копилку добавлено ${amount} ₽!`);
      setTimeout(() => setSuccess(''), 3000);
      onUpdateBalance?.();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleWithdrawClick = (goal: any) => {
    setGoalToWithdraw(goal);
    const targetDate = new Date(goal.targetDate);
    const now = new Date();
    const isDatePassed = now >= targetDate;

    if (isDatePassed) {
      setWithdrawMessage('');
      setShowWithdrawModal(true);
    } else {
      setWithdrawMessage(
        `Данная сумма (${goal.amount} ₽) должна храниться в копилке до ${targetDate.toLocaleDateString()}. Эта дата еще не наступила. Все равно перевести деньги из копилки на баланс?`,
      );
      setShowWithdrawModal(true);
    }
  };

  const confirmWithdraw = async () => {
    if (goalToWithdraw) {
      try {
        const isDatePassed = new Date() >= new Date(goalToWithdraw.targetDate);
        const amount = withdrawFromPiggyBank(goalToWithdraw.id, !isDatePassed);

        // Обновляем баланс пользователя
        const newTransaction: Transaction = {
          id: Date.now().toString(),
          title: `Вывод из копилки: ${goalToWithdraw.amount} ₽`,
          amount: amount,
          type: 'income',
        };
        setTransactions((prev) => [...prev, newTransaction]);

        setSuccess(`${amount} ₽ переведены на баланс!`);
        setTimeout(() => setSuccess(''), 3000);
        setShowWithdrawModal(false);
        setGoalToWithdraw(null);
        onUpdateBalance?.();
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleDeleteClick = (goalId: string) => {
    setGoalToDelete(goalId);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (goalToDelete) {
      try {
        deleteGoal(goalToDelete);
        setShowDeleteModal(false);
        setGoalToDelete(null);
        setError('');
      } catch (err: any) {
        setError(err.message);
        setShowDeleteModal(false);
      }
    }
  };

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
          🐷 Моя копилка
        </h1>

        <div className="space-y-6">
          {/* Статистика */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Статистика
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-700">В копилке</p>
                <p className="text-xl font-bold text-yellow-700">
                  {totalInPiggyBank} ₽
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">Доступно</p>
                <p className="text-xl font-bold text-green-700">
                  {availableBalance} ₽
                </p>
              </div>
            </div>
          </Card>

          {/* Создание новой цели */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">
              Новая цель
            </h2>
            <div className="space-y-4">
              <div>
                <Label>Сумма накопления (₽)</Label>
                <Input
                  type="number"
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(e.target.value)}
                  placeholder="Например: 10000"
                />
              </div>
              <div>
                <Label>Количество дней (заморозка)</Label>
                <Input
                  type="number"
                  value={goalDays}
                  onChange={(e) => setGoalDays(e.target.value)}
                  placeholder="Например: 30"
                />
              </div>
              <Button onClick={handleCreateGoal} className="w-full">
                Создать цель
              </Button>
            </div>
          </Card>

          {/* Запланированные цели */}
          {plannedGoals.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">
                📋 Запланированные цели
              </h2>
              <div className="space-y-3">
                {plannedGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="p-4 border rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">Цель: {goal.amount} ₽</p>
                      <p className="text-sm text-gray-500">
                        Заморозка до{' '}
                        {new Date(goal.targetDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeposit(goal)}
                        className={`p-2 rounded-lg transition-colors ${
                          hasFunds && !isBalanceNegativeOrZero
                            ? 'bg-green-500 hover:bg-green-600 text-white'
                            : 'bg-gray-300 cursor-not-allowed text-gray-500'
                        }`}
                        title="Внести данную сумму в копилку"
                        disabled={!hasFunds || isBalanceNegativeOrZero}
                      >
                        💰
                      </button>
                      <button
                        onClick={() => handleDeleteClick(goal.id)}
                        className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                        title="Удалить запланированную цель"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Завершенные цели (деньги в копилке) */}
          {completedGoals.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">
                ✅ Завершенные цели
              </h2>
              <div className="space-y-3">
                {completedGoals.map((goal) => {
                  const isCompleting = completingGoalId === goal.id;
                  const targetDate = new Date(goal.targetDate);
                  const now = new Date();
                  const canWithdraw = now >= targetDate;

                  return (
                    <div
                      key={goal.id}
                      className={`p-4 border rounded-lg transition-all duration-500 ${
                        isCompleting ? 'bg-green-100 scale-105 shadow-lg' : ''
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{goal.amount} ₽</p>
                          <p className="text-sm text-gray-500">
                            Заморожена до {targetDate.toLocaleDateString()}
                          </p>
                          {!canWithdraw && (
                            <p className="text-xs text-orange-500 mt-1">
                              ⏳ Доступно к выводу с{' '}
                              {targetDate.toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleWithdrawClick(goal)}
                          className={`p-2 rounded-lg transition-colors ${
                            canWithdraw
                              ? 'bg-blue-500 hover:bg-blue-600 text-white'
                              : 'bg-orange-500 hover:bg-orange-600 text-white'
                          }`}
                          title="Перевести деньги из копилки на баланс"
                        >
                          💸
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* История выводов */}
          {withdrawnGoals.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 text-gray-900">
                📜 История выводов
              </h2>
              <div className="space-y-2">
                {withdrawnGoals.map((goal) => (
                  <div key={goal.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between">
                      <span>{goal.amount} ₽</span>
                      <span className="text-gray-500">
                        Выведено:{' '}
                        {goal.withdrawnAt
                          ? new Date(goal.withdrawnAt).toLocaleDateString()
                          : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="p-3 bg-green-100 text-green-700 rounded-lg">
              {success}
            </div>
          )}
        </div>
      </div>

      {/* Модальное окно подтверждения удаления */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Удалить цель?"
        message="Вы уверены, что хотите удалить эту запланированную цель? Это действие нельзя отменить."
        confirmText="Удалить"
        cancelText="Отмена"
      />

      {/* Модальное окно подтверждения вывода */}
      <Modal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        onConfirm={confirmWithdraw}
        title="Вывод средств из копилки"
        message={
          withdrawMessage ||
          'Вы уверены, что хотите перевести деньги из копилки на баланс?'
        }
        confirmText="Да, перевести"
        cancelText="Отмена"
      />
    </div>
  );
};
