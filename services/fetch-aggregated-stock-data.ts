import { fetchSingleIssueData } from "@/services/fetch-single-issue-stock-data";
import { IStock } from "@/types/stock";

interface IResult {
  price: number | null;
  fullCapitalization: number | null;
}

export async function fetchAggregatedStockData(stock: IStock): Promise<IResult> {
  const tickerPromises = stock.company.tickers.map(fetchSingleIssueData);
  const results = await Promise.all(tickerPromises);

  const fullCapitalization = results.reduce((acc, { issueCapitalization }) => {
    if (acc !== null && issueCapitalization) {
      return acc + issueCapitalization;
    }

    return null;
  }, 0 as number | null);

  const tickerIndex = stock.company.tickers.findIndex(ticker => ticker === stock.ticker);
  const price = results[tickerIndex].price;
  
  return {
    price,
    fullCapitalization,
  }
}
