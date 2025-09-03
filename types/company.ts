export type TCompany = IRegularCompany | IBank | IExchange;

interface ICompany {
  id: number;
  name: string;
  tickers: string[];
  unitsText: string;
  units: number;
  type: string;
  years: number[];

  netIncomes: number[];
  shareholdersNetIncomes?: number[];
  totalAssets?: number[];
  totalEquity: number[];
  shareholdersEquity?: number[];

  nonTradableShareCount?: number;
  coefficientsNote?: string;
  financialStatementsNote?: string;
}

interface IRegularCompany extends ICompany {
  type: 'regular';
  revenues: number[];
  grossMargins?: number[];
  operatingIncomes: number[];
  currentAssets?: number[];
  currentLiabilities?: number[];
  netChangeInCash: number[];
  operatingCashFlow: number[];
  tangibleAssetsExpenditure?: number[];
  intangibleAssetsExpenditure?: number[];
  investingCashFlow?: number[];
  financingCashFlow?: number[];
}

interface IBank extends ICompany {
  type: 'bank';
  operatingIncomes?: number[];
  netInterestIncomes: number[];
}

interface IExchange extends ICompany {
  type: 'exchange';
  commissionIncomes:  number[];
  revenues: number[];
  operatingIncomes: number[];
  netChangeInCash: number[];
  operatingCashFlow: number[];
  tangibleAssetsExpenditure?: number[];
  intangibleAssetsExpenditure?: number[];
  investingCashFlow?: number[];
  financingCashFlow?: number[];
}
