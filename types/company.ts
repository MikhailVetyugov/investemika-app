import { MakeRequired } from "@/types/common";
import { TCurrency } from "@/types/currency";
import { TTicker } from "@/types/ticker";

export type TCompany = IRegularCompany | IBank | IExchange | IInsuranceCompany;

interface ICompany {
  id: number;
  name: string;
  tickers: TTicker[];
  unitsText: string;
  units: number;
  type: string;
  years: number[];

  netIncomes: number[];
  shareholdersNetIncomes: number[];
  totalAssets: number[];
  totalEquity: number[];
  shareholdersEquity: number[];
  operatingCashFlow?: number[];
  tangibleAssetsExpenditure?: number[];
  intangibleAssetsExpenditure?: number[];
  investingCashFlow?: number[];
  financingCashFlow?: number[];
  netChangeInCash?: number[];

  nonTradableShareCount?: number;
  financialStatementsNote?: string;
  capitalizationNote?: string;
  currency?: TCurrency;
}

interface IRegularCompany extends MakeRequired<
  ICompany,
  | 'operatingCashFlow'
  | 'investingCashFlow'
  | 'financingCashFlow'
  | 'netChangeInCash'
  > {
  type: 'regular';
  revenues: number[];
  grossMargins?: number[];
  operatingIncomes: number[];
  currentAssets: number[];
  currentLiabilities: number[];
}

interface IBank extends ICompany {
  type: 'bank';
  netInterestIncomes: number[];
  operatingIncomes?: number[];
}

interface IExchange extends MakeRequired<
  ICompany,
  | 'operatingCashFlow'
  | 'tangibleAssetsExpenditure'
  | 'intangibleAssetsExpenditure'
  | 'investingCashFlow'
  | 'financingCashFlow'
  | 'netChangeInCash'
  > {
  type: 'exchange';
  commissionIncomes: number[];
  operatingIncomes: number[];
  revenues: number[];
}

interface IInsuranceCompany extends MakeRequired<
  ICompany,
  | 'operatingCashFlow'
  | 'tangibleAssetsExpenditure'
  | 'intangibleAssetsExpenditure'
  | 'investingCashFlow'
  | 'financingCashFlow'
  | 'netChangeInCash'
  > {
  type: 'insurance';
  netEarnedPremiums: number[];
  netIncurredLosses: number[];
  insuranceServiceResult: number[];
  otherOperatingIncomes: number[];
  profitBeforeTax: number[];
}
