import { TCurrency } from "@/types/currency";
import { TIndustry } from "@/types/industry";
import { TTicker } from "@/types/ticker";

export type TScreenerMetricId =
  | 'revenue'
  | 'operatingIncome'
  | 'netIncome'
  | 'totalAssets'
  | 'equity'
  | 'fcf'
  | 'roe'
  | 'roa'
  | 'operatingMargin'
  | 'netMargin'
  | 'currentRatio'
  | 'equityRatio'
  | 'revenueGrowth'
  | 'netIncomeGrowth';

export type TScreenerMetricGroup = 'scale' | 'profitability' | 'stability' | 'growth';

/** bln — млрд рублей, percent — проценты, ratio — безразмерный коэффициент. */
export type TScreenerMetricUnit = 'bln' | 'percent' | 'ratio';

export interface IScreenerMetric {
  id: TScreenerMetricId;
  title: string;
  /** Короткое название для заголовков колонок, карточек и чипов. */
  shortTitle: string;
  description: string;
  group: TScreenerMetricGroup;
  unit: TScreenerMetricUnit;
  /** Показывать колонку, даже если по показателю нет фильтра и сортировки. */
  defaultVisible: boolean;
}

/** Одна компания в скринере. Значения показателей — за последний отчётный год. */
export interface IScreenerRow {
  id: number;
  name: string;
  tickers: TTicker[];
  urlName: string;
  industry: TIndustry;
  year: number;
  currency: TCurrency;
  /** null — показатель неприменим к компании или его нельзя посчитать. */
  metrics: Record<TScreenerMetricId, number | null>;
}

/** Границы диапазона в том виде, в каком их ввёл пользователь. */
export interface IScreenerRange {
  min: string;
  max: string;
}

export interface IScreenerFilters {
  ranges: Partial<Record<TScreenerMetricId, IScreenerRange>>;
  industries: TIndustry[];
  profitableOnly: boolean;
}

export type TScreenerSortKey = 'name' | TScreenerMetricId;

export interface IScreenerSort {
  key: TScreenerSortKey;
  direction: 'asc' | 'desc';
}
