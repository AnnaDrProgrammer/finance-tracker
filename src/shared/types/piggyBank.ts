export interface PiggyBankGoal {
  id: string;
  amount: number; // Сумма, которую хотим накопить
  currentAmount: number; // Текущая сумма в копилке
  targetDate: string; // Дата, до которой нельзя выводить (ISO строка)
  isActive: boolean; // Активна ли цель (в процессе накопления)
  isCompleted: boolean; // Завершена ли цель (деньги в копилке)
  isWithdrawn: boolean; // Выведены ли деньги на баланс
  createdAt: string; // Дата создания
  completedAt?: string; // Дата завершения накопления
  withdrawnAt?: string; // Дата вывода на баланс
}

export interface PiggyBankTransaction {
  id: string;
  amount: number; // Сумма перевода
  date: string; // Дата перевода
  goalId: string; // ID цели
  type: 'deposit' | 'withdraw'; // Пополнение или вывод
}
