import { X } from "lucide-react";

import { SCROLLBAR_CLASSES } from "@/constants/classes";
import { INDUSTRY_NAMES } from "@/constants/industries";
import { SCREENER_METRICS } from "@/constants/screener-metrics";
import { cn } from "@/lib/utils"
import { IScreenerFilters } from "@/types/screener";
import { getRangeBounds } from "@/utils/screener/filter-rows";
import { getRangeLabel } from "@/utils/screener/format";

interface IActiveFiltersProps {
  filters: IScreenerFilters;
  onChange: (filters: IScreenerFilters) => void;
}

interface IChip {
  key: string;
  label: string;
  remove: () => void;
}

/** Чипы активных фильтров. Каждый снимается по клику. */
export const ActiveFilters: React.FC<IActiveFiltersProps> = ({ filters, onChange }) => {
  const chips: IChip[] = [];

  for (const industry of filters.industries) {
    chips.push({
      key: `industry-${industry}`,
      label: INDUSTRY_NAMES[industry],
      remove: () => onChange({ ...filters, industries: filters.industries.filter(item => item !== industry) }),
    });
  }

  if (filters.profitableOnly) {
    chips.push({
      key: 'profitable',
      label: 'Только прибыльные',
      remove: () => onChange({ ...filters, profitableOnly: false }),
    });
  }

  for (const metric of SCREENER_METRICS) {
    const { min, max, isActive } = getRangeBounds(filters.ranges[metric.id]);

    if (!isActive) continue;

    chips.push({
      key: metric.id,
      label: getRangeLabel(metric, min, max),
      remove: () => {
        const ranges = { ...filters.ranges };
        delete ranges[metric.id];

        onChange({ ...filters, ranges });
      },
    });
  }

  if (chips.length === 0) {
    return null;
  }

  return (
    <ul className={cn("-mx-8 px-8 flex gap-2 overflow-x-auto pb-1 lg:mx-0 lg:px-0 lg:flex-wrap lg:overflow-visible lg:pb-0", SCROLLBAR_CLASSES)} aria-label="Активные фильтры">
      {chips.map(chip => (
        <li key={chip.key} className="shrink-0">
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-full border bg-muted px-2.5 py-1 text-xs whitespace-nowrap cursor-pointer transition-colors hover:border-investemika-primary hover:text-investemika-primary"
            aria-label={`Убрать фильтр: ${chip.label}`}
            onClick={chip.remove}
          >
            {chip.label}
            <X className="size-3" aria-hidden />
          </button>
        </li>
      ))}
    </ul>
  );
};
