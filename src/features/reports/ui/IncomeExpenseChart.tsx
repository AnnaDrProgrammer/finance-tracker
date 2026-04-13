import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Transaction } from '../../../shared/types/transaction';
import { usePiggyBank } from '../../../shared/lib/hooks/usePiggyBank';

interface IncomeExpenseChartProps {
  transactions: Transaction[];
}

const COLORS = ['#10b981', '#ef4444', '#f59e0b']; // Зеленый, красный, оранжевый

export const IncomeExpenseChart = ({
  transactions,
}: IncomeExpenseChartProps) => {
  const { getTotalInPiggyBank } = usePiggyBank();

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalInPiggyBank = getTotalInPiggyBank();

  const data = [
    { name: 'Доходы', value: totalIncome },
    { name: 'Расходы', value: totalExpense },
    { name: 'В копилке', value: totalInPiggyBank },
  ];

  // Фильтруем нулевые значения
  const filteredData = data.filter((item) => item.value > 0);

  if (filteredData.length === 0) {
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
          <Pie
            data={filteredData}
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
            {filteredData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
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
