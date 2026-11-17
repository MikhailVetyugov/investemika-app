import { describe, expect, it } from 'vitest';

import type { TIndustry } from '../../../types/industry';
import type { IScreenerFilters, IScreenerRow } from '../../../types/screener';
import { countActiveFilters, filterScreenerRows, getRangeBounds, parseBound, sortScreenerRows } from '../filter-rows';

const makeRow = (name: string, industry: TIndustry, metrics: Partial<IScreenerRow['metrics']>): IScreenerRow => ({
  name,
  industry,
  metrics: { revenue: null, netIncome: null, roe: null, ...metrics },
} as IScreenerRow);

const GAZP = makeRow('Газпром', 'oilAndGas', { revenue: 9770, netIncome: 1306, roe: 7.2 });
const LKOH = makeRow('Лукойл', 'oilAndGas', { revenue: 3767, netIncome: -1064, roe: -31.7 });
const SBER = makeRow('Сбербанк', 'banks', { netIncome: 1700, roe: 25 });
const YDEX = makeRow('Яндекс', 'it', { revenue: 1400, netIncome: 80, roe: 25 });

const ROWS = [SBER, YDEX, GAZP, LKOH];

const makeFilters = (filters: Partial<IScreenerFilters>): IScreenerFilters => ({
  ranges: {},
  industries: [],
  profitableOnly: false,
  ...filters,
});

const names = (rows: IScreenerRow[]) => rows.map(row => row.name);

describe('parseBound', () => {
  it('parses numbers with a comma, spaces and a minus sign', () => {
    expect(parseBound('1,5')).toBe(1.5);
    expect(parseBound(' 1 000 ')).toBe(1000);
    expect(parseBound('−10')).toBe(-10);
    expect(parseBound('0')).toBe(0);
  });

  it('returns null for empty and non-numeric input', () => {
    expect(parseBound('')).toBeNull();
    expect(parseBound(undefined)).toBeNull();
    expect(parseBound('-')).toBeNull();
    expect(parseBound('abc')).toBeNull();
  });
});

describe('getRangeBounds', () => {
  it('marks a range with min greater than max as invalid and inactive', () => {
    expect(getRangeBounds({ min: '10', max: '5' })).toMatchObject({ isInvalid: true, isActive: false });
  });

  it('treats an empty range as inactive', () => {
    expect(getRangeBounds({ min: '', max: '' }).isActive).toBe(false);
    expect(getRangeBounds(undefined).isActive).toBe(false);
  });
});

describe('filterScreenerRows', () => {
  it('returns all rows without filters', () => {
    expect(filterScreenerRows(ROWS, makeFilters({}))).toEqual(ROWS);
  });

  it('includes range boundaries', () => {
    const filters = makeFilters({ ranges: { revenue: { min: '1400', max: '3767' } } });

    expect(names(filterScreenerRows(ROWS, filters))).toEqual(['Яндекс', 'Лукойл']);
  });

  it('excludes rows without a value for a filtered metric', () => {
    const filters = makeFilters({ ranges: { revenue: { min: '0', max: '' } } });

    expect(names(filterScreenerRows(ROWS, filters))).not.toContain('Сбербанк');
  });

  it('combines several ranges', () => {
    const filters = makeFilters({ ranges: { revenue: { min: '1000', max: '' }, roe: { min: '', max: '10' } } });

    expect(names(filterScreenerRows(ROWS, filters))).toEqual(['Газпром', 'Лукойл']);
  });

  it('ignores an invalid range', () => {
    const filters = makeFilters({ ranges: { revenue: { min: '5000', max: '100' } } });

    expect(filterScreenerRows(ROWS, filters)).toEqual(ROWS);
  });

  it('filters by industries', () => {
    const filters = makeFilters({ industries: ['banks', 'it'] });

    expect(names(filterScreenerRows(ROWS, filters))).toEqual(['Сбербанк', 'Яндекс']);
  });

  it('keeps only profitable companies', () => {
    const filters = makeFilters({ profitableOnly: true });

    expect(names(filterScreenerRows(ROWS, filters))).toEqual(['Сбербанк', 'Яндекс', 'Газпром']);
  });
});

describe('sortScreenerRows', () => {
  it('sorts by name', () => {
    expect(names(sortScreenerRows(ROWS, { key: 'name', direction: 'asc' }))).toEqual(['Газпром', 'Лукойл', 'Сбербанк', 'Яндекс']);
    expect(names(sortScreenerRows(ROWS, { key: 'name', direction: 'desc' }))).toEqual(['Яндекс', 'Сбербанк', 'Лукойл', 'Газпром']);
  });

  it('keeps rows without a value at the end in both directions', () => {
    expect(names(sortScreenerRows(ROWS, { key: 'revenue', direction: 'desc' }))).toEqual(['Газпром', 'Лукойл', 'Яндекс', 'Сбербанк']);
    expect(names(sortScreenerRows(ROWS, { key: 'revenue', direction: 'asc' }))).toEqual(['Яндекс', 'Лукойл', 'Газпром', 'Сбербанк']);
  });

  it('breaks ties by name', () => {
    expect(names(sortScreenerRows(ROWS, { key: 'roe', direction: 'desc' }))).toEqual(['Сбербанк', 'Яндекс', 'Газпром', 'Лукойл']);
  });

  it('does not mutate the input', () => {
    const input = [...ROWS];

    sortScreenerRows(input, { key: 'name', direction: 'asc' });

    expect(input).toEqual(ROWS);
  });
});

describe('countActiveFilters', () => {
  it('counts active ranges, the industry filter and the profitable switch', () => {
    const filters = makeFilters({
      ranges: { revenue: { min: '1', max: '' }, roe: { min: '', max: '' }, netIncome: { min: '5', max: '1' } },
      industries: ['banks', 'it'],
      profitableOnly: true,
    });

    expect(countActiveFilters(filters)).toBe(3);
    expect(countActiveFilters(makeFilters({}))).toBe(0);
  });
});
