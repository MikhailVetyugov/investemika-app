import { use, useCallback, useEffect, useState } from "react";

import { DataContext } from "@/components/data-context";
import { fetchAggregatedStockData } from "@/services/fetch-aggregated-stock-data";
import { IStock } from "@/types/stock";
import { getStockByUrlName } from "@/utils/get-stock-by-url-name";
import { getUrlNameByStock } from "@/utils/get-url-name-by-stock";

export const useStockSelection = (initialStock: IStock) => {
  const [stock, setStock] = useState<IStock>(initialStock);
  const { updateMarketData, resetMarketData } = use(DataContext);

  const stockSelectionHandler = async (stock: IStock) => {
    setStock(stock);
    resetMarketData();

    // Не используем useRouter, чтобы это не привело к размонтированию страницы.
    window.history.pushState(null, "", `/${getUrlNameByStock(stock)}`);

    const marketData = await fetchAggregatedStockData(stock);
    updateMarketData(marketData);
  };

  const popStateHandler = useCallback(() => {
    const urlName = window.location.pathname.slice(1);
    setStock(getStockByUrlName(urlName));
  }, []);

  useEffect(() => {
    window.addEventListener("popstate", popStateHandler);
    return () => window.removeEventListener("popstate", popStateHandler);
  }, []);

  return [
    stock,
    stockSelectionHandler,
  ] as const;
}
