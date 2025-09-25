import { TMarketData } from "@/types/data-context";
import { IStock } from "@/types/stock";
import { isFinancialCompany } from "@/utils/is-financial-company";
import { getFCF } from "./cash-flow";
import { getAdjustedCapitalization } from "./get-adjusted-capitalization";

interface IParams {
  stock: IStock;
  marketData: TMarketData;
  currencyRate: number | null;
}

export const getPE = ({ stock, marketData, currencyRate }: IParams) => {
  const earnings = stock.company.shareholdersNetIncomes?.[0] || stock.company.netIncomes[0];

  return getMultiplier(stock, marketData, currencyRate, earnings);
}

export const getPB = ({ stock, marketData, currencyRate }: IParams) => {
  const equity = stock.company.shareholdersEquity?.[0] || stock.company.totalEquity[0];

  return getMultiplier(stock, marketData, currencyRate, equity);
}

export const getPS = ({ stock, marketData, currencyRate }: IParams) => {
  const { company } = stock;

  if (!isFinancialCompany(company)) {
    return getMultiplier(stock, marketData, currencyRate, company.revenues[0]);
  }

  return null;
}

export const getPFCF = ({ stock, marketData, currencyRate }: IParams) => {
  const FCF = getFCF(stock.company);

  if (FCF) {
    return getMultiplier(stock, marketData, currencyRate, FCF);
  }

  return null;
}

function getMultiplier(stock: IStock, marketData: TMarketData, currencyRate: number | null, rawDenominator: number) {
  if (!currencyRate) return null;
  
  const numerator = getAdjustedCapitalization(stock, marketData);

  if (!numerator) {
    return null;
  }

  const denominator = rawDenominator * stock.company.units * currencyRate;

  return Math.round((numerator / denominator) * 100) / 100;
}
