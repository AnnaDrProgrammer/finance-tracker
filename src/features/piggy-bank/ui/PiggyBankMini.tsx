import { Card } from '../../../shared/ui/card';

interface PiggyBankMiniProps {
  totalInPiggyBank: number;
  availableBalance: number;
  totalBalance: number; // Добавляем общий баланс
  onGoToPage: () => void;
}

export const PiggyBankMini = ({
  totalInPiggyBank,
  availableBalance,
  totalBalance,
  onGoToPage,
}: PiggyBankMiniProps) => {
  const hasFunds = availableBalance > 0;
  const isBalanceNegative = totalBalance <= 0;

  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-lg font-semibold text-gray-900">🐷 Копилка</h2>
        <button
          onClick={onGoToPage}
          className="text-sm text-blue-600 hover:text-blue-700"
        >
          Управлять →
        </button>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
          <span className="text-yellow-700">В копилке:</span>
          <span className="font-bold text-yellow-700">
            {totalInPiggyBank} ₽
          </span>
        </div>

        {isBalanceNegative || !hasFunds ? (
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-sm text-center">
              Нет доступных средств для накопления. На балансе недостаточно
              средств.
            </p>
          </div>
        ) : (
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <span className="text-green-700">Доступно для перевода:</span>
            <span className="font-bold text-green-700">
              {availableBalance} ₽
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};
