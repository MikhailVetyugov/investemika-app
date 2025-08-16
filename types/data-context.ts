export type TDataContext = {
  marketData: TMarketData;
  updateMarketData: (marketData: Partial<TMarketData>) => void;
  resetMarketData: () => void;
};

export type TInitialDataContext = Omit<TDataContext, 'updateMarketData' | 'resetMarketData'>;

export type TMarketData = {
  price: number | null;
  fullCapitalization: number | null;
}
