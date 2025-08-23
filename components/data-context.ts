import { createContext } from "react";

import { TDataContext } from "@/types/data-context";

export const DataContext = createContext<TDataContext>({
  stock: null,
  setStock: () => {},

  marketData: {
    price: null,
    fullCapitalization: null,
  },
  updateMarketData: () => {},
  resetMarketData: () => {},
});
