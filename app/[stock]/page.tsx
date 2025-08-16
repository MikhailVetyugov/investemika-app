import { StockPage } from "@/components/stock-page";
import { getStockByUrlName } from "@/utils/get-stock-by-url-name";

export default async function Stock({ params }: { params: Promise<{ stock: string }> }) {
  const { stock } = await params;

  return <StockPage initialStock={getStockByUrlName(stock)} />;
}
