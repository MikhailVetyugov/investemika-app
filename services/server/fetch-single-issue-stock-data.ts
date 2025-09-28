import { LRUCache } from 'lru-cache';

import { fetchPriceFromAlternateSource } from "@/services/server";
import { IStockDataExternalResponse } from "@/types/response/external";
import { IStockDataInternalResponse } from "@/types/response/internal";
import { TTicker } from "@/types/ticker";
import { createCacheWrapper } from './cache-wrapper';

const SHARE_BOARD_ID = 'TQBR';

const BOARD_ID_COLUMN = 'BOARDID';
const LAST_PRICE_COLUMN = 'LAST';
const ISSUE_CAPITALIZATION_COLUMN = 'ISSUECAPITALIZATION';

const { withCache } = createCacheWrapper<IStockDataExternalResponse>({
  max: 100,
  ttl: 1000 * 5,
});

export async function fetchSingleIssueData(ticker: TTicker): Promise<IStockDataInternalResponse> {
  try {
    const jsonResponse = await withCache(fetchSingleIssueDataFromMOEX, ticker)

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

async function fetchSingleIssueDataFromMOEX(ticker: TTicker): Promise<IStockDataExternalResponse> {
  const response = await fetch(`https://iss.moex.com/iss/engines/stock/markets/shares/securities/${ticker}.json`);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return await response.json();
}

function getColumnValue(columnName: string, response: IStockDataExternalResponse) {
  const boardIdColumnIndex = response.marketdata.columns.findIndex(column => column === BOARD_ID_COLUMN)!;
  const neededColumnIndex = response.marketdata.columns.findIndex(column => column === columnName)!;

  const boardIdDatum = response.marketdata.data.find(datum => datum[boardIdColumnIndex] === SHARE_BOARD_ID)!;

  return boardIdDatum[neededColumnIndex];
}
