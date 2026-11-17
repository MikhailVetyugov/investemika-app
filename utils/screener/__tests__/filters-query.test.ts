import { describe, expect, it } from 'vitest';

import type { IScreenerFilters, IScreenerSort } from '../../../types/screener';
import { parseScreenerQuery, serializeScreenerQuery } from '../filters-query';

const EMPTY_FILTERS: IScreenerFilters = { ranges: {}, industries: [], profitableOnly: false };
const DEFAULT_SORT: IScreenerSort = { key: 'name', direction: 'asc' };

describe('serializeScreenerQuery', () => {
  it('returns an empty string for the default state', () => {
    expect(serializeScreenerQuery(EMPTY_FILTERS, DEFAULT_SORT)).toBe('');
  });

  it('serializes ranges, industries, the profitable switch and sorting', () => {
    const filters: IScreenerFilters = {
      ranges: { revenue: { min: '100', max: '' }, roe: { min: '7,5', max: '30' } },
      industries: ['banks', 'it'],
      profitableOnly: true,
    };

    expect(serializeScreenerQuery(filters, { key: 'roe', direction: 'desc' }))
      .toBe('revenue=100..&roe=7.5..30&industry=banks,it&profitable=1&sort=-roe');
  });

  it('skips empty and invalid ranges', () => {
    const filters: IScreenerFilters = {
      ...EMPTY_FILTERS,
      ranges: { revenue: { min: '', max: '' }, roe: { min: '30', max: '10' } },
    };

    expect(serializeScreenerQuery(filters, DEFAULT_SORT)).toBe('');
  });
});

describe('parseScreenerQuery', () => {
  it('returns the default state for an empty query', () => {
    expect(parseScreenerQuery('')).toEqual({ filters: EMPTY_FILTERS, sort: DEFAULT_SORT });
  });

  it('restores the serialized state', () => {
    const filters: IScreenerFilters = {
      ranges: { revenue: { min: '100', max: '' }, roe: { min: '7,5', max: '30' }, netIncomeGrowth: { min: '-10', max: '' } },
      industries: ['banks', 'e-commerce'],
      profitableOnly: true,
    };
    const sort: IScreenerSort = { key: 'revenue', direction: 'asc' };

    expect(parseScreenerQuery(`?${serializeScreenerQuery(filters, sort)}`)).toEqual({ filters, sort });
  });

  it('ignores unknown and malformed parameters', () => {
    const query = '?revenue=abc&roe=..&netMargin=5&unknown=1..2&industry=banks,nope,banks&profitable=yes&sort=-price';

    expect(parseScreenerQuery(query)).toEqual({
      filters: { ranges: {}, industries: ['banks'], profitableOnly: false },
      sort: DEFAULT_SORT,
    });
  });
});
