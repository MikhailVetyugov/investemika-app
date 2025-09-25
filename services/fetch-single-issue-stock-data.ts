import { fetchSingleIssueDataFromAPI } from "@/services/api";
import { fetchPriceFromAlternateSource } from "@/services/fetch-price-from-alternate-source";
import { IStockDataExternalResponse } from "@/types/response/external";
import { IStockDataInternalResponse } from "@/types/response/internal";
import { TTicker } from "@/types/ticker";

const SHARE_BOARD_ID = 'TQBR';

const BOARD_ID_COLUMN = 'BOARDID';
const LAST_PRICE_COLUMN = 'LAST';
const ISSUE_CAPITALIZATION_COLUMN = 'ISSUECAPITALIZATION';

// TODO: Refactor to call this function only on server side to remove a browser condition below.
export async function fetchSingleIssueData(ticker: TTicker): Promise<IStockDataInternalResponse> {
  try {
    const isBrowser = typeof window !== 'undefined';

    if (isBrowser) {
      return fetchSingleIssueDataFromAPI(ticker);
    }

    const response = await fetch(`https://iss.moex.com/iss/engines/stock/markets/shares/securities/${ticker}.json`, {
      next: {
        tags: [`${ticker}-main-source`],
        revalidate: 5,
      },
      cache: 'force-cache',
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const jsonResponse: IStockDataExternalResponse = await response.json();

    let price = getColumnValue(LAST_PRICE_COLUMN, jsonResponse);
    const issueCapitalization = getColumnValue(ISSUE_CAPITALIZATION_COLUMN, jsonResponse);

    if (!price) {
      console.warn('Using an alternate source for price', ticker);
      price = await fetchPriceFromAlternateSource(ticker);
    }

    return {
      price,
      issueCapitalization,
    };
  } catch (error) {
    console.error('Error while fetching stock data', error);
  }

  return {
    price: null,
    issueCapitalization: null,
  };
}

function getColumnValue(columnName: string, response: IStockDataExternalResponse) {
  const boardIdColumnIndex = response.marketdata.columns.findIndex(column => column === BOARD_ID_COLUMN)!;
  const neededColumnIndex = response.marketdata.columns.findIndex(column => column === columnName)!;

  const boardIdDatum = response.marketdata.data.find(datum => datum[boardIdColumnIndex] === SHARE_BOARD_ID)!;

  return boardIdDatum[neededColumnIndex];
}
