import { INDUSTRY_NAMES } from "@/constants/industries";
import { DEFAULT_SCREENER_SORT, SCREENER_METRICS } from "@/constants/screener-metrics";
import { TIndustry } from "@/types/industry";
import { IScreenerFilters, IScreenerSort, TScreenerSortKey } from "@/types/screener";
import { getRangeBounds, parseBound } from "./filter-rows";

const RANGE_SEPARATOR = '..';
const INDUSTRY_PARAM = 'industry';
const PROFITABLE_PARAM = 'profitable';
const SORT_PARAM = 'sort';

/** Число в том виде, в каком оно показывается в поле ввода. */
const toInputValue = (value: number | null) => value === null ? '' : String(value).replace('.', ',');

/**
 * Query-строка (без «?») для фильтров и сортировки.
 * Пример: `revenue=100..&roe=15..30&industry=banks,it&profitable=1&sort=-roe`.
 */
export const serializeScreenerQuery = (filters: IScreenerFilters, sort: IScreenerSort): string => {
  const parts: string[] = [];

  for (const metric of SCREENER_METRICS) {
    const { min, max, isActive } = getRangeBounds(filters.ranges[metric.id]);

    if (isActive) {
      parts.push(`${metric.id}=${min ?? ''}${RANGE_SEPARATOR}${max ?? ''}`);
    }
  }

  if (filters.industries.length > 0) {
    parts.push(`${INDUSTRY_PARAM}=${filters.industries.join(',')}`);
  }

  if (filters.profitableOnly) {
    parts.push(`${PROFITABLE_PARAM}=1`);
  }

  if (sort.key !== DEFAULT_SCREENER_SORT.key || sort.direction !== DEFAULT_SCREENER_SORT.direction) {
    parts.push(`${SORT_PARAM}=${sort.direction === 'desc' ? '-' : ''}${sort.key}`);
  }

  return parts.join('&');
};

/** Разбирает query-строку. Неизвестные и некорректные параметры игнорируются. */
export const parseScreenerQuery = (search: string): { filters: IScreenerFilters; sort: IScreenerSort } => {
  const params = new URLSearchParams(search);
  const filters: IScreenerFilters = { ranges: {}, industries: [], profitableOnly: false };

  for (const metric of SCREENER_METRICS) {
    const raw = params.get(metric.id);

    if (!raw || !raw.includes(RANGE_SEPARATOR)) continue;

    const separatorIndex = raw.indexOf(RANGE_SEPARATOR);
    const min = parseBound(raw.slice(0, separatorIndex));
    const max = parseBound(raw.slice(separatorIndex + RANGE_SEPARATOR.length));

    if (min === null && max === null) continue;

    filters.ranges[metric.id] = { min: toInputValue(min), max: toInputValue(max) };
  }

  const industries = (params.get(INDUSTRY_PARAM) ?? '')
    .split(',')
    .filter((industry): industry is TIndustry => Object.hasOwn(INDUSTRY_NAMES, industry));

  filters.industries = [...new Set(industries)];
  filters.profitableOnly = params.get(PROFITABLE_PARAM) === '1';

  return { filters, sort: parseSort(params.get(SORT_PARAM)) };
};

function parseSort(raw: string | null): IScreenerSort {
  if (!raw) {
    return DEFAULT_SCREENER_SORT;
  }

  const isDescending = raw.startsWith('-');
  const key = isDescending ? raw.slice(1) : raw;
  const isKnownKey = key === 'name' || SCREENER_METRICS.some(metric => metric.id === key);

  if (!isKnownKey) {
    return DEFAULT_SCREENER_SORT;
  }

  return { key: key as TScreenerSortKey, direction: isDescending ? 'desc' : 'asc' };
}
