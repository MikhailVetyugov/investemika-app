import { IStockDataResponse } from "@/types/stock-data-response";
import { fetchPriceFromAlternateSource } from "./fetch-price-from-alternate-source";

interface IResult {
  price: number | null;
  issueCapitalization: number | null;
}

const SHARE_BOARD_ID = 'TQBR';

const BOARD_ID_COLUMN = 'BOARDID';
const LAST_PRICE_COLUMN = 'LAST';
const ISSUE_CAPITALIZATION_COLUMN = 'ISSUECAPITALIZATION';

export async function fetchSingleIssueData(ticker: string): Promise<IResult> {
  try {
    const isBrowser = typeof window !== 'undefined';

    if (isBrowser) {
      return fetchSingleIssueDataInBrowser(ticker);
    }
    
    const response = await fetch(`https://iss.moex.com/iss/engines/stock/markets/shares/securities/${ticker}.json`, {
      next: {
        tags: [`${ticker}-main-source`],
        revalidate: 5,
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result: IStockDataResponse = await response.json();

    let price = getColumnValue(LAST_PRICE_COLUMN, result);
    const issueCapitalization = getColumnValue(ISSUE_CAPITALIZATION_COLUMN, result);

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

async function fetchSingleIssueDataInBrowser(ticker: string): Promise<IResult> {
  try {
    const response = await fetch(`${window.location.origin}/api/single-issue-stock-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ticker }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error while fetching stock data', error);
  }

  return {
    price: null,
    issueCapitalization: null,
  };
}

function getColumnValue(columnName: string, result: IStockDataResponse) {
  const boardIdColumnIndex = result.marketdata.columns.findIndex(column => column === BOARD_ID_COLUMN)!;
  const neededColumnIndex = result.marketdata.columns.findIndex(column => column === columnName)!;

  const boardIdDatum = result.marketdata.data.find(datum => datum[boardIdColumnIndex] === SHARE_BOARD_ID)!;

  return boardIdDatum[neededColumnIndex];
}
