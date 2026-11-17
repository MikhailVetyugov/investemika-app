import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IScreenerRange } from "@/types/screener";
import { getRangeBounds } from "@/utils/screener/filter-rows";

interface IRangeFilterProps {
  id: string;
  label: string;
  description: string;
  range: IScreenerRange | undefined;
  onChange: (range: IScreenerRange) => void;
}

/** Оставляет только то, из чего может состоять число: цифры, разделитель и минус. */
const sanitize = (value: string) => value.replace('−', '-').replace(/[^\d.,-]/g, '');

export const RangeFilter: React.FC<IRangeFilterProps> = ({ id, label, description, range, onChange }) => {
  const min = range?.min ?? '';
  const max = range?.max ?? '';
  const { isInvalid } = getRangeBounds(range);

  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={`${id}-min`} title={description}>{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          id={`${id}-min`}
          inputMode="decimal"
          autoComplete="off"
          placeholder="от"
          aria-label={`${label}: от`}
          aria-invalid={isInvalid}
          value={min}
          onChange={event => onChange({ min: sanitize(event.target.value), max })}
        />
        <span className="text-muted-foreground" aria-hidden>–</span>
        <Input
          id={`${id}-max`}
          inputMode="decimal"
          autoComplete="off"
          placeholder="до"
          aria-label={`${label}: до`}
          aria-invalid={isInvalid}
          value={max}
          onChange={event => onChange({ min, max: sanitize(event.target.value) })}
        />
      </div>
      {isInvalid && (
        <p className="text-xs text-destructive" role="alert">Значение «от» больше значения «до»</p>
      )}
    </div>
  );
};
