import { StockPage } from "@/components/stock-page";
import { fetchAggregatedStockData } from "@/services/fetch-aggregated-stock-data";
import { getStockByUrlName } from "@/utils/get-stock-by-url-name";

export default async function Stock({ params }: { params: Promise<{ stock: string }> }) {
  const { stock: stockUrlName } = await params;
  const stock = getStockByUrlName(stockUrlName)

  const marketData = await fetchAggregatedStockData(stock);
  const initialDataContext = { marketData };

  return <StockPage initialStock={stock} initialDataContext={initialDataContext} />;
}
