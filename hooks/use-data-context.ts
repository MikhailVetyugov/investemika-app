import { useCallback, useMemo, useState } from "react";

import { TDataContext, TInitialDataContext, TMarketData } from "@/types/data-context";
import { IStock } from "@/types/stock";

export const useDataContext = (initialDataContext: TInitialDataContext): TDataContext => {
  const [stock, setStock] = useState<IStock | null>(initialDataContext.stock);
  const [marketData, setMarketData] = useState<TMarketData>(initialDataContext.marketData);

  const updateMarketData = useCallback((newMarketData: Partial<TMarketData>) => {
    setMarketData(prevMarketData => ({
      ...prevMarketData,
      ...newMarketData
    }));
  }, []);

  const resetMarketData = useCallback(() => {
    setMarketData({
      price: null,
      fullCapitalization: null,
    });
  }, [])

  return useMemo(() => ({
    stock,
    setStock,

    marketData,
    updateMarketData,
    resetMarketData,
  }), [stock, marketData, updateMarketData]);
}
