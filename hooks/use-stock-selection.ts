import { use, useCallback, useEffect } from "react";
import { useRouter } from 'nextjs-toploader/app';

import { DataContext } from "@/components/data-context";
import { fetchCurrencyRateFromAPI } from "@/services/browser";
import { fetchAggregatedStockData } from "@/services/shared";
import { IStock } from "@/types/stock";
import { getStockByUrlName } from "@/utils/get-stock-by-url-name";
import { getUrlNameByStock } from "@/utils/get-url-name-by-stock";
import { getStockPageSeoTitle } from "@/utils/get-stock-page-seo-title";

export const useStockSelection = (stockPage: boolean) => {
  const { setStock, updateMarketData, resetMarketData, setCurrencyRate } = use(DataContext);
  const router = useRouter();

  const fetchAndUpdateData = async (stock: IStock) => {
    const [marketData, currencyRate] = await Promise.all([
      fetchAggregatedStockData(stock),
      fetchCurrencyRateFromAPI(stock.company.currency)
    ]);

    updateMarketData(marketData);
    setCurrencyRate(currencyRate);
  };

  const stockSelectionHandler = async (stock: IStock) => {
    setStock(stock);
    resetMarketData();

    const nextUrl = `/${getUrlNameByStock(stock)}`;

    if (stockPage) {
      // Не используем useRouter, чтобы это не привело к размонтированию страницы.
      window.history.pushState(null, "", nextUrl);

      await fetchAndUpdateData(stock);
      
      window.document.title = getStockPageSeoTitle(stock);
    } else {
      router.push(nextUrl);
    }
  };

  const popStateHandler = useCallback(async () => {
    const urlName = window.location.pathname.slice(1);
    const stock = getStockByUrlName(urlName) as IStock;

    setStock(stock);
    resetMarketData();

    await fetchAndUpdateData(stock);
  }, []);

  useEffect(() => {
    window.addEventListener("popstate", popStateHandler);
    return () => window.removeEventListener("popstate", popStateHandler);
  }, []);

  return {
    stockSelectionHandler
  };
}
