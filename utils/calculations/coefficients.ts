import { TMarketData } from "@/types/data-context";
import { IStock } from "@/types/stock";
import { getFCF } from "./cash-flow";

export const getPE = (stock: IStock, marketData: TMarketData) => {
  const earnings = stock.company.shareholdersNetIncomes?.[0] || stock.company.netIncomes[0];

  return getCoefficient(stock, marketData, earnings);
}

export const getPB = (stock: IStock, marketData: TMarketData) => {
  const equity = stock.company.shareholdersEquity?.[0] || stock.company.totalEquity[0];

  return getCoefficient(stock, marketData, equity);
}

export const getPS = (stock: IStock, marketData: TMarketData) => {
  if ('revenues' in stock.company) {
    return getCoefficient(stock, marketData, stock.company.revenues[0]);
  }

  return null;
}

export const getPFCF = (stock: IStock, marketData: TMarketData) => {
  const FCF = getFCF(stock.company);

  if (FCF) {
    return getCoefficient(stock, marketData, FCF);
  }

  return null;
}

function getCoefficient(stock: IStock, marketData: TMarketData, rawDenominator: number) {
  if (!marketData.fullCapitalization) return null;

  let numerator = marketData.fullCapitalization;
  const denominator = rawDenominator * stock.company.units;

  if (stock.company.nonTradableShareCount) {
    if (!marketData.price) {
      return null;
    }

    const capitalizationAdjustment = stock.company.nonTradableShareCount * marketData.price;
    numerator += capitalizationAdjustment;
  }

  return Math.round((numerator / denominator) * 100) / 100;
}
