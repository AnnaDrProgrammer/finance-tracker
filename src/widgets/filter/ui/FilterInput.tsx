import { Input } from '../../../shared/lib/ui/input';

interface FilterInputProps {
  filter: string;
  onFilterChange: (value: string) => void;
}

export const FilterInput = ({ filter, onFilterChange }: FilterInputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Фильтр по названию</label>
      <Input
        type="text"
        value={filter}
        onChange={(e) => onFilterChange(e.target.value)}
        placeholder="Введите название..."
      />
    </div>
  );
};
