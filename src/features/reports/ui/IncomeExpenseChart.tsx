import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Transaction } from '../../../shared/types/transaction';

interface IncomeExpenseChartProps {
  transactions: Transaction[];
}

const COLORS = ['#10b981', '#ef4444']; // Зеленый для доходов, красный для расходов

export const IncomeExpenseChart = ({
  transactions,
}: IncomeExpenseChartProps) => {
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const data = [
    { name: 'Доходы', value: totalIncome },
    { name: 'Расходы', value: totalExpense },
  ];

  if (totalIncome === 0 && totalExpense === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Нет данных для отображения
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer>
        <PieChart>
          {' '}
          {/* Этого тега не хватало */}
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => {
              if (percent === undefined) return '';
              return `${name}: ${(percent * 100).toFixed(0)}%`;
            }}
            outerRadius={80}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: any) => {
              const numValue = typeof value === 'number' ? value : 0;
              return `${numValue.toFixed(2)} ₽`;
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
