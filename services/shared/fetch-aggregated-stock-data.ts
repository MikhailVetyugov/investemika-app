import { fetchSingleIssueDataFromAPI } from "@/services/browser";
import { fetchSingleIssueData } from "@/services/server";
import { IStock } from "@/types/stock";

interface IResult {
  price: number | null;
  fullCapitalization: number | null;
}

export async function fetchAggregatedStockData(stock: IStock): Promise<IResult> {
  const isBrowser = typeof window !== 'undefined';

  const tickerPromises = stock.company.tickers.map(isBrowser ? fetchSingleIssueDataFromAPI : fetchSingleIssueData);
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
