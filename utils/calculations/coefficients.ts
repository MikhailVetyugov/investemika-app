import { TMarketData } from "@/types/data-context";
import { IStock } from "@/types/stock";
import { isFinancialCompany } from "@/utils/is-financial-company";
import { getFCF } from "./cash-flow";

interface IParams {
  stock: IStock;
  marketData: TMarketData;
  currencyRate: number | null;
}

export const getPE = ({ stock, marketData, currencyRate }: IParams) => {
  const earnings = stock.company.shareholdersNetIncomes?.[0] || stock.company.netIncomes[0];

  return getCoefficient(stock, marketData, currencyRate, earnings);
}

export const getPB = ({ stock, marketData, currencyRate }: IParams) => {
  const equity = stock.company.shareholdersEquity?.[0] || stock.company.totalEquity[0];

  return getCoefficient(stock, marketData, currencyRate, equity);
}

export const getPS = ({ stock, marketData, currencyRate }: IParams) => {
  const { company } = stock;

  if (!isFinancialCompany(company)) {
    return getCoefficient(stock, marketData, currencyRate, company.revenues[0]);
  }

  return null;
}

export const getPFCF = ({ stock, marketData, currencyRate }: IParams) => {
  const FCF = getFCF(stock.company);

  if (FCF) {
    return getCoefficient(stock, marketData, currencyRate, FCF);
  }

  return null;
}

function getCoefficient(stock: IStock, marketData: TMarketData, currencyRate: number | null, rawDenominator: number) {
  if (!marketData.fullCapitalization || !currencyRate) return null;

  let numerator = marketData.fullCapitalization;
  const denominator = rawDenominator * stock.company.units * currencyRate;

  if (stock.company.nonTradableShareCount) {
    if (!marketData.price) {
      return null;
    }

    const capitalizationAdjustment = stock.company.nonTradableShareCount * marketData.price;
    numerator += capitalizationAdjustment;
  }

  return Math.round((numerator / denominator) * 100) / 100;
}
