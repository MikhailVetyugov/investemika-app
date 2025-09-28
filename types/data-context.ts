import { IAggregatedDataInternalResponse, TAverageCoefficientsInternalResponse } from "./response/internal";
import { IStock } from "./stock";

export type TDataContext = {
  stock: IStock | null;
  setStock: (stock: IStock | null) => void;

  marketData: TMarketData;
  updateMarketData: (marketData: Partial<TMarketData>) => void;
  resetMarketData: () => void;

  currencyRate: number | null;
  setCurrencyRate: (currencyRate: number | null) => void;

  averageCoefficients: TAverageCoefficients;
  setAverageCoefficients: (averageCoefficients: TAverageCoefficients) => void;
};

export type TInitialDataContext = Omit<
  TDataContext,
  'setStock' | 'updateMarketData' | 'resetMarketData' | 'setCurrencyRate' | 'setAverageCoefficients'
>;

export type TMarketData = IAggregatedDataInternalResponse;
export type TAverageCoefficients = TAverageCoefficientsInternalResponse;
