import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { Transaction } from '../../../shared/types/transaction';
import { usePiggyBank } from '../../../shared/lib/hooks/usePiggyBank';

interface IncomeExpenseChartMiniProps {
  transactions: Transaction[];
}

const COLORS = ['#10b981', '#ef4444', '#f59e0b']; // Зеленый, красный, оранжевый

export const IncomeExpenseChartMini = ({
  transactions,
}: IncomeExpenseChartMiniProps) => {
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

  const filteredData = data.filter((item) => item.value > 0);

  if (filteredData.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-500">
        Нет данных для отображения
      </div>
    );
  }

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={filteredData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => {
              if (percent === undefined) return '';
              return `${(percent * 100).toFixed(0)}%`;
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
        </PieChart>
      </ResponsiveContainer>

      {/* Пояснение под диаграммой */}
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full"></div>
          <span className="text-sm text-gray-700">Доходы</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
          <span className="text-sm text-gray-700">Расходы</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
          <span className="text-sm text-gray-700">В копилке</span>
        </div>
      </div>
    </div>
  );
};
