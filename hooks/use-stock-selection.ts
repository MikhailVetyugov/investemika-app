import { use, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";

import { DataContext } from "@/components/data-context";
import { fetchAggregatedStockData } from "@/services/fetch-aggregated-stock-data";
import { IStock } from "@/types/stock";
import { getStockByUrlName } from "@/utils/get-stock-by-url-name";
import { getUrlNameByStock } from "@/utils/get-url-name-by-stock";

export const useStockSelection = (stockPage: boolean) => {
  const { setStock, updateMarketData, resetMarketData } = use(DataContext);
  const router = useRouter();

  const stockSelectionHandler = async (stock: IStock) => {
    setStock(stock);
    resetMarketData();

    const nextUrl = `/${getUrlNameByStock(stock)}`

    if (stockPage) {
      // Не используем useRouter, чтобы это не привело к размонтированию страницы.
      window.history.pushState(null, "", nextUrl);

      const marketData = await fetchAggregatedStockData(stock);
      updateMarketData(marketData);
    } else {
      router.push(nextUrl);
    }
  };

  const popStateHandler = useCallback(() => {
    const urlName = window.location.pathname.slice(1);
    setStock(getStockByUrlName(urlName));
  }, []);

  useEffect(() => {
    window.addEventListener("popstate", popStateHandler);
    return () => window.removeEventListener("popstate", popStateHandler);
  }, []);

  return {
    stockSelectionHandler
  };
}
