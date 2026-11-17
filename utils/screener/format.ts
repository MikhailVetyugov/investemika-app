import { NBSP } from "@/constants/symbols";
import { SCREENER_UNIT_LABELS } from "@/constants/screener-metrics";
import { IScreenerMetric, TScreenerMetricUnit } from "@/types/screener";

export const EMPTY_VALUE = '—';

const FORMATTERS: Record<TScreenerMetricUnit, Intl.NumberFormat> = {
  bln: new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 }),
  percent: new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 1 }),
  ratio: new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 2 }),
};

export const formatMetricValue = (value: number | null, unit: TScreenerMetricUnit) => {
  return value === null ? EMPTY_VALUE : FORMATTERS[unit].format(value);
};

/** Название показателя с единицей измерения: «Выручка, млрд ₽». */
export const getMetricLabel = (metric: IScreenerMetric, short = false) => {
  const title = short ? metric.shortTitle : metric.title;
  const unit = SCREENER_UNIT_LABELS[metric.unit];

  return unit ? `${title}, ${unit}` : title;
};

/** Подпись чипа активного диапазона: «Выручка от 100 до 500». */
export const getRangeLabel = (metric: IScreenerMetric, min: number | null, max: number | null) => {
  const parts = [metric.shortTitle];

  if (min !== null) parts.push(`от${NBSP}${formatMetricValue(min, 'ratio')}`);
  if (max !== null) parts.push(`до${NBSP}${formatMetricValue(max, 'ratio')}`);

  return parts.join(' ');
};

/** «1 компанию», «3 компании», «12 компаний» — для кнопки «Показать …». */
export const pluralizeCompanies = (count: number) => {
  const lastTwoDigits = count % 100;
  const lastDigit = count % 10;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) return `${count}${NBSP}компаний`;
  if (lastDigit === 1) return `${count}${NBSP}компанию`;
  if (lastDigit >= 2 && lastDigit <= 4) return `${count}${NBSP}компании`;

  return `${count}${NBSP}компаний`;
};
