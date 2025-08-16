import { IStock } from "@/types/stock";
import { fetchSingleIssueData } from "./fetch-single-issue-stock-data";

interface IResult {
  price: number | null;
  fullCapitalization: number | null;
}

export async function fetchAggregatedStockData(stock: IStock): Promise<IResult> {
  const { price, issueCapitalization } = await fetchSingleIssueData(stock);

  const otherTickers = stock.company.tickers.filter(ticker => ticker !== stock.ticker);
  const otherTickerPromises = otherTickers.map(ticker => fetchSingleIssueData({ ...stock, ticker }));
  const otherResults = await Promise.all(otherTickerPromises);

  const fullCapitalization = otherResults.reduce((acc, { issueCapitalization: currentIssueCapitalization }) => {
    if (acc && currentIssueCapitalization) {
      return acc + currentIssueCapitalization;
    }

    return acc;
  }, issueCapitalization)
  
  return {
    price,
    fullCapitalization,
  }
}
