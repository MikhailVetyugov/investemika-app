import { IStock } from "./stock";

export type TDataContext = {
  stock: IStock | null;
  setStock: (stock: IStock | null) => void;

  marketData: TMarketData;
  updateMarketData: (marketData: Partial<TMarketData>) => void;
  resetMarketData: () => void;

  currencyRate: number | null;
};

export type TInitialDataContext = Omit<TDataContext, 'setStock' | 'updateMarketData' | 'resetMarketData'>;

export type TMarketData = {
  price: number | null;
  fullCapitalization: number | null;
}
