import { StockPage } from "@/components/stock-page";
import { ALL_STOCKS } from "@/lib/data";

export default function Home() {
  return <StockPage initialStock={ALL_STOCKS[0]} />;
}
