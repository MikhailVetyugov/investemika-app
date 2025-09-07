import { MakeRequired } from "@/types/common";
import { TCurrency } from "@/types/currency";

export type TCompany = IRegularCompany | IBank | IExchange | IInsuranceCompany;

interface ICompany {
  id: number;
  name: string;
  tickers: string[];
  unitsText: string;
  units: number;
  type: string;
  years: number[];

  netIncomes: number[];
  shareholdersNetIncomes?: number[]; // TODO: Убрать опциональность, когда будет у всех компаний.
  totalAssets?: number[]; // TODO: Убрать опциональность, когда будет у всех компаний.
  totalEquity: number[];
  shareholdersEquity?: number[]; // TODO: Убрать опциональность, когда будет у всех компаний.
  operatingCashFlow?: number[];
  tangibleAssetsExpenditure?: number[];
  intangibleAssetsExpenditure?: number[];
  investingCashFlow?: number[];
  financingCashFlow?: number[];
  netChangeInCash?: number[];

  nonTradableShareCount?: number;
  coefficientsNote?: string;
  financialStatementsNote?: string;
  currency?: TCurrency;
}

interface IRegularCompany extends MakeRequired<
  ICompany,
  | 'operatingCashFlow'
  | 'netChangeInCash'
  > { // TODO: Добавить investingCashFlow и financingCashFlow, когда будет у всех regular компаний.
  type: 'regular';
  revenues: number[];
  grossMargins?: number[];
  operatingIncomes: number[];
  currentAssets?: number[];
  currentLiabilities?: number[];
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
