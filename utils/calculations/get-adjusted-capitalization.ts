import { TMarketData } from "@/types/data-context";
import { IStock } from "@/types/stock";

export const getAdjustedCapitalization = (stock: IStock, marketData: TMarketData) => {
  if (!marketData.fullCapitalization) return null;

  let result = marketData.fullCapitalization;

  if (stock.company.nonTradableShareCount) {
    if (!marketData.price) {
      return null;
    }

    const capitalizationAdjustment = stock.company.nonTradableShareCount * marketData.price;
    result += capitalizationAdjustment;
  }

  return result;
};
