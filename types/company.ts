export type TCompany = IRegularCompany | IBank;

interface ICompany {
  id: number;
  name: string;
  tickers: string[];
  unitsText: string;
  units: number;
  type: string;
  years: [number, number, number, number, ...number[]];

  netIncomes: [number, number, number, number, ...number[]];
  shareholdersNetIncomes?: [number, number, number, number, ...number[]];
  totalAssets?: [number, number, number, number, ...number[]];
  totalEquity: [number, number, number, number, ...number[]];
  shareholdersEquity?: [number, number, number, number, ...number[]];

  nonTradableShareCount?: number;
  coefficientsNote?: string;
}

interface IRegularCompany extends ICompany {
  type: 'regular';
  revenues: [number, number, number, number, ...number[]];
  grossMargins?: [number, number, number, number, ...number[]];
  operatingIncomes: [number, number, number, number, ...number[]];
  currentLiabilities?: [number, number, number, number, ...number[]];
  netChangeInCash:[number, number, number, number, ...number[]];
  operatingCashFlow: [number, number, number, number, ...number[]];
  tangibleAssetsExpenditure?: [number, number, number, number, ...number[]];
  intangibleAssetsExpenditure?: [number, number, number, number, ...number[]];
  investingCashFlow?: [number, number, number, number, ...number[]];
  financingCashFlow?: [number, number, number, number, ...number[]];
}

interface IBank extends ICompany {
  type: 'bank';
  netInterestIncomes: [number, number, number, number, ...number[]];
  operatingIncomes?: [number, number, number, number, ...number[]];
}
