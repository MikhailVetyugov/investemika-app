import { TInitialDataContext } from "@/types/data-context";

export function getEmptyInitialDataContext(): TInitialDataContext {
  return {
    stock: null,
    marketData: { price: null, fullCapitalization: null },
    currencyRate: null,
    averageCoefficients: null,
  };
}
