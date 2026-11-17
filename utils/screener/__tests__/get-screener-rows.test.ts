import { describe, expect, it } from 'vitest';

import type { TCompany } from '../../../types/company';
import type { IStock } from '../../../types/stock';
import { getScreenerRows } from '../get-screener-rows';

const makeStock = (company: Partial<TCompany>, ticker?: string): IStock => {
  const tickers = company.tickers ?? ['LKOH'];

  return {
    name: company.name ?? 'Компания',
    ticker: ticker ?? tickers[0],
    firstCompanyTicker: tickers[0],
    company: { id: 1, name: 'Компания', tickers, ...company },
  } as IStock;
};

const REGULAR: Partial<TCompany> = {
  type: 'regular',
  industry: 'oilAndGas',
  units: 1_000_000,
  years: [2025, 2024, 2023],
  revenues: [2000, 1600, 1000],
  operatingIncomes: [500, 400, 300],
  netIncomes: [330, 220, 110],
  shareholdersNetIncomes: [300, 200, 100],
  currentAssets: [900, 800, 700],
  currentLiabilities: [600, 500, 400],
  totalAssets: [6000, 5000, 4000],
  totalEquity: [3000, 2500, 2000],
  shareholdersEquity: [2400, 2000, 1600],
  operatingCashFlow: [700, 600, 500],
  tangibleAssetsExpenditure: [250, 200, 150],
  intangibleAssetsExpenditure: [50, 40, 30],
};

const BANK: Partial<TCompany> = {
  type: 'bank',
  industry: 'banks',
  tickers: ['SBER', 'SBERP'],
  units: 1_000_000_000,
  years: [2025, 2024],
  netInterestIncomes: [3000, 2500],
  commissionIncomes: [900, 800],
  commissionExpenses: [100, 90],
  netIncomes: [1700, 1600],
  shareholdersNetIncomes: [1700, 1600],
  totalAssets: [60000, 50000],
  totalEquity: [7000, 6000],
  shareholdersEquity: [6800, 5900],
};

describe('getScreenerRows', () => {
  it('computes metrics of a regular company for the latest year', () => {
    const [row] = getScreenerRows([makeStock(REGULAR)], null);

    expect(row.year).toBe(2025);
    expect(row.currency).toBe('RUR');
    expect(row.metrics).toEqual({
      revenue: 2,
      operatingIncome: 0.5,
      netIncome: 0.3,
      totalAssets: 6,
      equity: 2.4,
      fcf: 0.4,
      roe: 12.5,
      roa: 5,
      operatingMargin: 25,
      netMargin: 15,
      currentRatio: 1.5,
      equityRatio: 50,
      revenueGrowth: 25,
      netIncomeGrowth: 50,
    });
  });

  it('normalizes units to billions of rubles', () => {
    const [thousands] = getScreenerRows([makeStock({ ...REGULAR, units: 1000, revenues: [5_000_000, 1, 1] })], null);
    const [billions] = getScreenerRows([makeStock({ ...REGULAR, units: 1_000_000_000, revenues: [12, 1, 1] })], null);

    expect(thousands.metrics.revenue).toBe(5);
    expect(billions.metrics.revenue).toBe(12);
  });

  it('converts USD statements with the given rate and leaves ratios untouched', () => {
    const [row] = getScreenerRows([makeStock({ ...REGULAR, currency: 'USD' })], 80);

    expect(row.currency).toBe('USD');
    expect(row.metrics.revenue).toBe(160);
    expect(row.metrics.netIncome).toBe(24);
    expect(row.metrics.roe).toBe(12.5);
  });

  it('returns null absolute metrics for USD companies when the rate is unavailable', () => {
    const [row] = getScreenerRows([makeStock({ ...REGULAR, currency: 'USD' })], null);

    expect(row.metrics.revenue).toBeNull();
    expect(row.metrics.totalAssets).toBeNull();
    expect(row.metrics.fcf).toBeNull();
    expect(row.metrics.netMargin).toBe(15);
    expect(row.metrics.revenueGrowth).toBe(25);
  });

  it('returns one row per company with all its tickers', () => {
    const rows = getScreenerRows([makeStock(BANK, 'SBER'), makeStock(BANK, 'SBERP')], null);

    expect(rows).toHaveLength(1);
    expect(rows[0].tickers).toEqual(['SBER', 'SBERP']);
  });

  it('returns null for metrics that do not apply to a bank', () => {
    const [row] = getScreenerRows([makeStock(BANK)], null);

    expect(row.metrics.revenue).toBeNull();
    expect(row.metrics.operatingIncome).toBeNull();
    expect(row.metrics.fcf).toBeNull();
    expect(row.metrics.netMargin).toBeNull();
    expect(row.metrics.currentRatio).toBeNull();
    expect(row.metrics.revenueGrowth).toBeNull();
    expect(row.metrics.netIncome).toBe(1700);
    expect(row.metrics.roe).toBe(25);
  });

  it('does not compute growth when the previous year is missing', () => {
    const [row] = getScreenerRows([makeStock({ ...REGULAR, years: [2025, 2023, 2022] })], null);

    expect(row.metrics.revenueGrowth).toBeNull();
    expect(row.metrics.netIncomeGrowth).toBeNull();
  });

  it('does not compute growth from a non-positive base', () => {
    const [row] = getScreenerRows([makeStock({ ...REGULAR, shareholdersNetIncomes: [300, -200, 100] })], null);

    expect(row.metrics.netIncomeGrowth).toBeNull();
    expect(row.metrics.revenueGrowth).toBe(25);
  });

  it('does not compute ROE for non-positive equity', () => {
    const [row] = getScreenerRows([makeStock({ ...REGULAR, shareholdersEquity: [-100, 2000, 1600] })], null);

    expect(row.metrics.roe).toBeNull();
  });
});
