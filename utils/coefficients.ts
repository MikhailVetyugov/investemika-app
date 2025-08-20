import { TMarketData } from "@/types/data-context";
import { IStock } from "@/types/stock";

export const getPE = (stock: IStock, marketData: TMarketData) => getCoefficient(stock, marketData, stock.company.netIncomes[0]);

export const getPB = (stock: IStock, marketData: TMarketData) => getCoefficient(stock, marketData, stock.company.shareCapital[0]);

export const getPS = (stock: IStock, marketData: TMarketData) => {
  if ('revenues' in stock.company) {
    return getCoefficient(stock, marketData, stock.company.revenues[0]);
  }

  return null;
}

export const getPFCF = (stock: IStock, marketData: TMarketData) => {
  const { company } = stock;

  if ('operatingCashFlow' in company && company.tangibleAssetsExpenditure && company.intangibleAssetsExpenditure) {
    return getCoefficient(
      stock,
      marketData,
      company.operatingCashFlow[0] - company.tangibleAssetsExpenditure[0] - company.intangibleAssetsExpenditure[0]
    );
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
