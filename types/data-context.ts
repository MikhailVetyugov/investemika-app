import { IStock } from "./stock";

export type TDataContext = {
  stock: IStock | null;
  setStock: (stock: IStock | null) => void;

  marketData: TMarketData;
  updateMarketData: (marketData: Partial<TMarketData>) => void;
  resetMarketData: () => void;

  currencyRate: number | null;
  setCurrencyRate: (currencyRate: number | null) => void;
};

export type TInitialDataContext = Omit<
  TDataContext,
  'setStock' | 'updateMarketData' | 'resetMarketData' | 'setCurrencyRate'
>;

export type TMarketData = {
  price: number | null;
  fullCapitalization: number | null;
}
