import { NBSP } from "@/constants/symbols";
import {
  IScreenerFilters,
  IScreenerMetric,
  IScreenerSort,
  TScreenerMetricGroup,
  TScreenerMetricUnit,
} from "@/types/screener";

/**
 * Реестр показателей скринера. Из него строятся панель фильтров, колонки таблицы,
 * карточки, чипы и сортировка. Сами значения считаются в `utils/screener/get-screener-rows.ts`.
 */
export const SCREENER_METRICS: IScreenerMetric[] = [
  {
    id: 'revenue',
    title: 'Выручка',
    shortTitle: 'Выручка',
    description: 'Выручка за последний отчётный год',
    group: 'scale',
    unit: 'bln',
    defaultVisible: true,
  },
  {
    id: 'operatingIncome',
    title: 'Операционная прибыль',
    shortTitle: 'Опер. прибыль',
    description: 'Операционная прибыль за последний отчётный год',
    group: 'scale',
    unit: 'bln',
    defaultVisible: true,
  },
  {
    id: 'netIncome',
    title: 'Чистая прибыль',
    shortTitle: 'Чистая прибыль',
    description: 'Чистая прибыль, относящаяся к акционерам',
    group: 'scale',
    unit: 'bln',
    defaultVisible: true,
  },
  {
    id: 'totalAssets',
    title: 'Активы',
    shortTitle: 'Активы',
    description: 'Активы всего',
    group: 'scale',
    unit: 'bln',
    defaultVisible: false,
  },
  {
    id: 'equity',
    title: 'Капитал',
    shortTitle: 'Капитал',
    description: 'Капитал, относящийся к акционерам',
    group: 'scale',
    unit: 'bln',
    defaultVisible: false,
  },
  {
    id: 'fcf',
    title: 'Свободный денежный поток',
    shortTitle: 'FCF',
    description: 'Свободный денежный поток: операционный поток за вычетом капитальных затрат',
    group: 'scale',
    unit: 'bln',
    defaultVisible: false,
  },
  {
    id: 'roe',
    title: 'ROE',
    shortTitle: 'ROE',
    description: 'Рентабельность собственного капитала, относящегося к акционерам',
    group: 'profitability',
    unit: 'percent',
    defaultVisible: true,
  },
  {
    id: 'roa',
    title: 'ROA',
    shortTitle: 'ROA',
    description: 'Рентабельность активов на базе прибыли, относящейся к акционерам',
    group: 'profitability',
    unit: 'percent',
    defaultVisible: false,
  },
  {
    id: 'operatingMargin',
    title: 'Операционная маржа',
    shortTitle: 'Опер. маржа',
    description: 'Отношение операционной прибыли к выручке',
    group: 'profitability',
    unit: 'percent',
    defaultVisible: false,
  },
  {
    id: 'netMargin',
    title: 'Чистая маржа',
    shortTitle: 'Чистая маржа',
    description: 'Отношение чистой прибыли, относящейся к акционерам, к выручке',
    group: 'profitability',
    unit: 'percent',
    defaultVisible: true,
  },
  {
    id: 'currentRatio',
    title: 'Текущая ликвидность',
    shortTitle: 'CR',
    description: 'Коэффициент текущей ликвидности: текущие активы к текущим обязательствам',
    group: 'stability',
    unit: 'ratio',
    defaultVisible: false,
  },
  {
    id: 'equityRatio',
    title: `Доля капитала в${NBSP}активах`,
    shortTitle: 'Капитал / активы',
    description: 'Отношение собственного капитала к активам',
    group: 'stability',
    unit: 'percent',
    defaultVisible: false,
  },
  {
    id: 'revenueGrowth',
    title: 'Рост выручки',
    shortTitle: 'Рост выручки',
    description: 'Изменение выручки к предыдущему году',
    group: 'growth',
    unit: 'percent',
    defaultVisible: true,
  },
  {
    id: 'netIncomeGrowth',
    title: 'Рост чистой прибыли',
    shortTitle: 'Рост прибыли',
    description: 'Изменение чистой прибыли, относящейся к акционерам, к предыдущему году',
    group: 'growth',
    unit: 'percent',
    defaultVisible: false,
  },
];

export const SCREENER_METRIC_GROUPS: { id: TScreenerMetricGroup; title: string }[] = [
  { id: 'scale', title: 'Масштаб' },
  { id: 'profitability', title: 'Рентабельность' },
  { id: 'stability', title: 'Устойчивость' },
  { id: 'growth', title: `Динамика за${NBSP}год` },
];

export const SCREENER_UNIT_LABELS: Record<TScreenerMetricUnit, string> = {
  bln: `млрд${NBSP}₽`,
  percent: '%',
  ratio: '',
};

export const EMPTY_SCREENER_FILTERS: IScreenerFilters = {
  ranges: {},
  industries: [],
  profitableOnly: false,
};

export const DEFAULT_SCREENER_SORT: IScreenerSort = {
  key: 'name',
  direction: 'asc',
};
