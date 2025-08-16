import { useCallback, useMemo, useState } from "react";

import { TDataContext, TInitialDataContext, TMarketData } from "@/types/data-context";

export const useDataContext = (initialDataContext: TInitialDataContext): TDataContext => {
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
    marketData,
    updateMarketData,
    resetMarketData,
  }), [marketData, updateMarketData]);
}
