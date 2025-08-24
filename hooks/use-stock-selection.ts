import { use, useCallback, useEffect } from "react";

import { DataContext } from "@/components/data-context";
import { fetchAggregatedStockData } from "@/services/fetch-aggregated-stock-data";
import { IStock } from "@/types/stock";
import { getStockByUrlName } from "@/utils/get-stock-by-url-name";
import { getUrlNameByStock } from "@/utils/get-url-name-by-stock";

export const useStockSelection = (stockPage: boolean) => {
  const { setStock, updateMarketData, resetMarketData } = use(DataContext);

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
      // Показываем пользователю полную перезагрузку. useRouter + loading файл нельзя использовать из-за SEO.
      window.location.assign(nextUrl);
    }
  };

  const popStateHandler = useCallback(async () => {
    const urlName = window.location.pathname.slice(1);
    const stock = getStockByUrlName(urlName);

    setStock(getStockByUrlName(urlName));
    resetMarketData();

    const marketData = await fetchAggregatedStockData(stock);
    updateMarketData(marketData);
  }, []);

  useEffect(() => {
    window.addEventListener("popstate", popStateHandler);
    return () => window.removeEventListener("popstate", popStateHandler);
  }, []);

  return {
    stockSelectionHandler
  };
}
