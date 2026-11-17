import { SCREENER_METRICS } from "@/constants/screener-metrics";
import { IScreenerFilters, IScreenerRange, IScreenerRow, IScreenerSort } from "@/types/screener";

/** Разбирает границу диапазона, введённую пользователем. Пустая или нечисловая строка даёт null. */
export const parseBound = (raw: string | undefined): number | null => {
  const text = (raw ?? '').replace(/\s/g, '').replace('−', '-').replace(',', '.');

  if (text === '') {
    return null;
  }

  const value = Number(text);

  return Number.isFinite(value) ? value : null;
};

export const getRangeBounds = (range: IScreenerRange | undefined) => {
  const min = parseBound(range?.min);
  const max = parseBound(range?.max);
  const isInvalid = min !== null && max !== null && min > max;

  return {
    min,
    max,
    /** «От» больше «до». Такой диапазон не применяется. */
    isInvalid,
    isActive: !isInvalid && (min !== null || max !== null),
  };
};

export const countActiveFilters = (filters: IScreenerFilters) => {
  const activeRangeCount = SCREENER_METRICS.filter(metric => getRangeBounds(filters.ranges[metric.id]).isActive).length;

  return activeRangeCount + (filters.industries.length > 0 ? 1 : 0) + (filters.profitableOnly ? 1 : 0);
};

/** Компания без значения показателя (null) не проходит активный фильтр по этому показателю. */
export const filterScreenerRows = (rows: IScreenerRow[], filters: IScreenerFilters): IScreenerRow[] => {
  const activeRanges = SCREENER_METRICS
    .map(metric => ({ id: metric.id, ...getRangeBounds(filters.ranges[metric.id]) }))
    .filter(range => range.isActive);

  return rows.filter(row => {
    if (filters.industries.length > 0 && !filters.industries.includes(row.industry)) {
      return false;
    }

    if (filters.profitableOnly && !((row.metrics.netIncome ?? 0) > 0)) {
      return false;
    }

    return activeRanges.every(({ id, min, max }) => {
      const value = row.metrics[id];

      if (value === null) {
        return false;
      }

      return (min === null || value >= min) && (max === null || value <= max);
    });
  });
};

const compareNames = (a: IScreenerRow, b: IScreenerRow) => a.name.localeCompare(b.name, 'ru');

/** Строки без значения всегда в конце, в каком бы направлении ни шла сортировка. */
export const sortScreenerRows = (rows: IScreenerRow[], sort: IScreenerSort): IScreenerRow[] => {
  const sign = sort.direction === 'asc' ? 1 : -1;
  const { key } = sort;

  if (key === 'name') {
    return [...rows].sort((a, b) => sign * compareNames(a, b));
  }

  return [...rows].sort((a, b) => {
    const aValue = a.metrics[key];
    const bValue = b.metrics[key];

    if (aValue === null || bValue === null) {
      if (aValue === bValue) return compareNames(a, b);

      return aValue === null ? 1 : -1;
    }

    return sign * (aValue - bValue) || compareNames(a, b);
  });
};
