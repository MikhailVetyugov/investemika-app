import { PageShell } from "@/components/page-shell";
import { StockPageContent } from "@/components/stock-page-content";
import { fetchAggregatedStockData } from "@/services/fetch-aggregated-stock-data";
import { getStockByUrlName } from "@/utils/get-stock-by-url-name";

export default async function Stock({ params }: { params: Promise<{ stock: string }> }) {
  const { stock: stockUrlName } = await params;
  const stock = getStockByUrlName(stockUrlName)

  const marketData = await fetchAggregatedStockData(stock);
  const initialDataContext = { stock, marketData };

  return (
    <PageShell initialDataContext={initialDataContext} stockPage>
      <StockPageContent />
    </PageShell>
  );
}
