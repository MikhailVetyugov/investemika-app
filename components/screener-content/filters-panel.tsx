import { Label } from "@/components/ui/label";
import { SCREENER_METRIC_GROUPS, SCREENER_METRICS } from "@/constants/screener-metrics";
import { TIndustry } from "@/types/industry";
import { IScreenerFilters } from "@/types/screener";
import { getMetricLabel } from "@/utils/screener/format";
import { IndustryFilter } from "./industry-filter";
import { RangeFilter } from "./range-filter";

interface IFiltersPanelProps {
  /** Панель рендерится дважды (сайдбар и мобильный диалог), поэтому id полей должны различаться. */
  idPrefix: string;
  filters: IScreenerFilters;
  industries: TIndustry[];
  onChange: (filters: IScreenerFilters) => void;
}

export const FiltersPanel: React.FC<IFiltersPanelProps> = ({ idPrefix, filters, industries, onChange }) => {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${idPrefix}-industry`}>Отрасль</Label>
        <IndustryFilter
          id={`${idPrefix}-industry`}
          options={industries}
          selected={filters.industries}
          onChange={selected => onChange({ ...filters, industries: selected })}
        />
      </div>

      <label className="flex items-center gap-2 text-sm font-medium cursor-pointer select-none">
        <input
          type="checkbox"
          className="size-4 accent-investemika-primary cursor-pointer"
          checked={filters.profitableOnly}
          onChange={event => onChange({ ...filters, profitableOnly: event.target.checked })}
        />
        Только прибыльные
      </label>

      {SCREENER_METRIC_GROUPS.map(group => (
        <div
          key={group.id}
          role="group"
          aria-labelledby={`${idPrefix}-group-${group.id}`}
          className="flex flex-col gap-3 border-t pt-4"
        >
          <h3
            id={`${idPrefix}-group-${group.id}`}
            className="text-xs font-bold uppercase tracking-wide text-muted-foreground"
          >
            {group.title}
          </h3>
          {SCREENER_METRICS.filter(metric => metric.group === group.id).map(metric => (
            <RangeFilter
              key={metric.id}
              id={`${idPrefix}-${metric.id}`}
              label={getMetricLabel(metric)}
              description={metric.description}
              range={filters.ranges[metric.id]}
              onChange={range => onChange({ ...filters, ranges: { ...filters.ranges, [metric.id]: range } })}
            />
          ))}
        </div>
      ))}
    </div>
  );
};
