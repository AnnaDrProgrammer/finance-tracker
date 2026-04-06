import { useState, useEffect, useCallback } from 'react';
import type {
  PiggyBankGoal,
  PiggyBankTransaction,
} from '../../types/piggyBank';

export function usePiggyBank() {
  const [goals, setGoals] = useState<PiggyBankGoal[]>(() => {
    const saved = localStorage.getItem('piggyBankGoals');
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState<PiggyBankTransaction[]>(
    () => {
      const saved = localStorage.getItem('piggyBankTransactions');
      return saved ? JSON.parse(saved) : [];
    },
  );

  useEffect(() => {
    localStorage.setItem('piggyBankGoals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('piggyBankTransactions', JSON.stringify(transactions));
  }, [transactions]);

  // Создать запланированную цель
  const createGoal = (amount: number, days: number) => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + days);

    const newGoal: PiggyBankGoal = {
      id: Date.now().toString(),
      amount,
      currentAmount: 0,
      targetDate: targetDate.toISOString(),
      isActive: true,
      isCompleted: false,
      isWithdrawn: false,
      createdAt: new Date().toISOString(),
    };

    setGoals((prev) => [...prev, newGoal]);
    return newGoal;
  };

  // Внести деньги в копилку (завершить цель)
  const depositToPiggyBank = (goalId: string, balance: number) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) {
      throw new Error('Цель не найдена');
    }

    if (!goal.isActive) {
      throw new Error('Цель уже неактивна');
    }

    if (goal.amount > balance) {
      throw new Error(
        `Недостаточно средств. Нужно ${goal.amount} ₽, доступно ${balance} ₽`,
      );
    }

    // Обновляем цель как завершенную
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? {
              ...g,
              currentAmount: g.amount,
              isActive: false,
              isCompleted: true,
              completedAt: new Date().toISOString(),
            }
          : g,
      ),
    );

    // Добавляем транзакцию пополнения
    const newTransaction: PiggyBankTransaction = {
      id: Date.now().toString(),
      amount: goal.amount,
      date: new Date().toISOString(),
      goalId,
      type: 'deposit',
    };
    setTransactions((prev) => [...prev, newTransaction]);

    return goal.amount;
  };

  // Вывести деньги из копилки на баланс
  const withdrawFromPiggyBank = (goalId: string, force?: boolean) => {
    const goal = goals.find((g) => g.id === goalId);
    if (!goal) {
      throw new Error('Цель не найдена');
    }

    if (!goal.isCompleted || goal.isWithdrawn) {
      throw new Error('Деньги уже были выведены или цель не завершена');
    }

    const now = new Date();
    const targetDate = new Date(goal.targetDate);
    const isDatePassed = now >= targetDate;

    if (!isDatePassed && !force) {
      throw new Error(`date_not_reached:${goal.targetDate}`);
    }

    // Обновляем цель как выведенную
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? {
              ...g,
              isWithdrawn: true,
              withdrawnAt: new Date().toISOString(),
            }
          : g,
      ),
    );

    // Добавляем транзакцию вывода
    const newTransaction: PiggyBankTransaction = {
      id: Date.now().toString(),
      amount: goal.amount,
      date: new Date().toISOString(),
      goalId,
      type: 'withdraw',
    };
    setTransactions((prev) => [...prev, newTransaction]);

    return goal.amount;
  };

  // Получить общую сумму в копилке (завершенные, но не выведенные)
  const getTotalInPiggyBank = useCallback(() => {
    return goals.reduce((total, goal) => {
      if (goal.isCompleted && !goal.isWithdrawn) {
        return total + goal.amount;
      }
      return total;
    }, 0);
  }, [goals]);

  // Получить доступный баланс
  const getAvailableBalance = useCallback(
    (totalBalance: number) => {
      const totalInPiggy = getTotalInPiggyBank();
      const available = totalBalance - totalInPiggy;
      return available < 0 ? 0 : available;
    },
    [getTotalInPiggyBank],
  );

  // Получить запланированные цели (активные, без внесенных денег)
  const getPlannedGoals = useCallback(() => {
    return goals.filter((g) => g.isActive && g.currentAmount === 0);
  }, [goals]);

  // Получить завершенные цели (деньги в копилке, не выведены)
  const getCompletedGoals = useCallback(() => {
    return goals.filter((g) => g.isCompleted && !g.isWithdrawn);
  }, [goals]);

  // Получить историю выводов
  const getWithdrawnGoals = useCallback(() => {
    return goals.filter((g) => g.isWithdrawn);
  }, [goals]);

  // Удалить запланированную цель
  const deleteGoal = useCallback(
    (goalId: string) => {
      const goal = goals.find((g) => g.id === goalId);
      if (!goal) {
        throw new Error('Цель не найдена');
      }

      if (!goal.isActive || goal.currentAmount > 0) {
        throw new Error('Нельзя удалить эту цель');
      }

      setGoals((prev) => prev.filter((g) => g.id !== goalId));
    },
    [goals],
  );

  // Проверить просроченные цели (для информации)
  const checkExpiredGoals = useCallback(() => {
    const now = new Date();
    return goals.filter(
      (g) => g.isCompleted && !g.isWithdrawn && new Date(g.targetDate) < now,
    );
  }, [goals]);

  return {
    goals,
    transactions,
    createGoal,
    depositToPiggyBank,
    withdrawFromPiggyBank,
    getTotalInPiggyBank,
    getAvailableBalance,
    getPlannedGoals,
    getCompletedGoals,
    getWithdrawnGoals,
    deleteGoal,
    checkExpiredGoals,
  };
}
