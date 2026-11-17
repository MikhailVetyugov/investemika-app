import { describe, expect, it } from 'vitest';

import type { IStock } from '../../types/stock';
import type { TIndustry } from '../../types/industry';
import { getIndustryPeers, getCompanyStocks } from '../get-related-stocks';

const makeStock = (name: string, ticker: string, firstCompanyTicker: string, industry: TIndustry): IStock => ({
  name,
  ticker,
  firstCompanyTicker,
  company: { industry },
} as IStock);

const SBER = makeStock('Сбербанк', 'SBER', 'SBER', 'banks');
const SBERP = makeStock('Сбербанк - привилегированные акции', 'SBERP', 'SBER', 'banks');
const VTBR = makeStock('ВТБ', 'VTBR', 'VTBR', 'banks');
const BSPB = makeStock('Банк «Санкт-Петербург»', 'BSPB', 'BSPB', 'banks');
const BSPBP = makeStock('Банк «Санкт-Петербург» - привилегированные акции', 'BSPBP', 'BSPB', 'banks');
const YDEX = makeStock('Яндекс', 'YDEX', 'YDEX', 'it');
const HEAD = makeStock('Хэдхантер', 'HEAD', 'HEAD', 'recruitment');

const ALL = [SBER, SBERP, VTBR, BSPB, BSPBP, YDEX, HEAD];

describe('getCompanyStocks', () => {
  it('returns both common and preferred stocks from either side', () => {
    expect(getCompanyStocks(SBER, ALL)).toEqual([SBER, SBERP]);
    expect(getCompanyStocks(SBERP, ALL)).toEqual([SBER, SBERP]);
  });

  it('returns a single stock for a company with one ticker', () => {
    expect(getCompanyStocks(VTBR, ALL)).toEqual([VTBR]);
  });
});

describe('getIndustryPeers', () => {
  it('excludes the current company and preferred duplicates, sorted by name', () => {
    expect(getIndustryPeers(SBERP, ALL)).toEqual([BSPB, VTBR]);
    expect(getIndustryPeers(VTBR, ALL)).toEqual([BSPB, SBER]);
  });

  it('returns an empty list when the company is alone in its industry', () => {
    expect(getIndustryPeers(HEAD, ALL)).toEqual([]);
  });
});
