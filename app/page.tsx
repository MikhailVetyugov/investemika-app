import { StockPage } from "@/components/stock-page";
import { ALL_STOCKS } from "@/lib/data";
import { fetchAggregatedStockData } from "@/services/fetch-aggregated-stock-data";

export default async function Home() {
  const initialStock = ALL_STOCKS[0];

  const marketData = await fetchAggregatedStockData(initialStock);
  const initialDataContext = { marketData };

  return <StockPage initialStock={initialStock} initialDataContext={initialDataContext} />;
}
