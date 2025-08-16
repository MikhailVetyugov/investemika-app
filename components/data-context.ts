import { createContext } from "react";

import { TDataContext } from "@/types/data-context";

export const DataContext = createContext<TDataContext>({
  marketData: {
    price: null,
    fullCapitalization: null,
  },
  updateMarketData: () => {},
  resetMarketData: () => {},
});
