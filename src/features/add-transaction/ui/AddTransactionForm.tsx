import { useState } from 'react';
import { Alert } from '../../../shared/lib/ui/alert';
import { Input } from '../../../shared/lib/ui/input';
import { Label } from '../../../shared/lib/ui/label';
import { Button } from '../../../shared/lib/ui/button';
// import { Button, Input, Label, Alert } from '../../../shared/lib/ui'

interface AddTransactionFormProps {
  onAddTransaction: (
    title: string,
    amount: number,
    type: 'income' | 'expense',
  ) => void;
}

export const AddTransactionForm = ({
  onAddTransaction,
}: AddTransactionFormProps) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [errors, setErrors] = useState({ title: '', amount: '' });

  const validate = () => {
    const newErrors = { title: '', amount: '' };
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = 'Название не может быть пустым';
      isValid = false;
    }

    const numAmount = parseFloat(amount);
    if (!amount || isNaN(numAmount) || numAmount <= 0) {
      newErrors.amount = 'Сумма должна быть больше 0';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validate()) {
      onAddTransaction(title.trim(), parseFloat(amount), type);
      setTitle('');
      setAmount('');
      setType('income');
      setErrors({ title: '', amount: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-lg">
      <h2 className="text-lg font-semibold">Добавить транзакцию</h2>

      <div className="space-y-2">
        <Label htmlFor="title">Название</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Введите название"
        />
        {errors.title && (
          <Alert variant="destructive" className="text-sm">
            {errors.title}
          </Alert>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Сумма</Label>
        <Input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Введите сумму"
        />
        {errors.amount && (
          <Alert variant="destructive" className="text-sm">
            {errors.amount}
          </Alert>
        )}
      </div>

      <div className="space-y-2">
        <Label>Тип</Label>
        <div className="flex gap-4">
          <Button
            type="button"
            variant={type === 'income' ? 'default' : 'outline'}
            onClick={() => setType('income')}
          >
            Доход
          </Button>
          <Button
            type="button"
            variant={type === 'expense' ? 'default' : 'outline'}
            onClick={() => setType('expense')}
          >
            Расход
          </Button>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Добавить
      </Button>
    </form>
  );
};
