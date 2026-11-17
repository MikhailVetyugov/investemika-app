import type { IStock } from "@/types/stock";

/** Все акции компании (обыкновенные и привилегированные) в порядке `company.tickers`. */
export const getCompanyStocks = (stock: IStock, allStocks: IStock[]): IStock[] => {
  return allStocks.filter(item => item.firstCompanyTicker === stock.firstCompanyTicker);
};

/** Другие компании той же отрасли: по одной акции (первый тикер) на компанию, по алфавиту. */
export const getIndustryPeers = (stock: IStock, allStocks: IStock[]): IStock[] => {
  return allStocks
    .filter(item =>
      item.ticker === item.firstCompanyTicker
      && item.company.industry === stock.company.industry
      && item.firstCompanyTicker !== stock.firstCompanyTicker
    )
    .sort((a, b) => a.name.localeCompare(b.name, 'ru'));
};
