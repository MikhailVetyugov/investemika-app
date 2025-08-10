import { IPriceApiResponse } from "@/types/price-api-response";

const SHARE_BOARD_ID = 'TQBR';
const BOARD_ID_COLUMN = 'BOARDID';
const LAST_PRICE_COLUMN = 'LAST';

export async function fetchPrice(ticker: string): Promise<number | null> {
  try {
    const response = await fetch(`https://iss.moex.com/iss/engines/stock/markets/shares/securities/${ticker}.json`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result: IPriceApiResponse = await response.json();

    const boardIdColumnIndex = result.marketdata.columns.findIndex(column => column === BOARD_ID_COLUMN)!;
    const lastPriceColumnIndex = result.marketdata.columns.findIndex(column => column === LAST_PRICE_COLUMN)!;
    const datum = result.marketdata.data.find(datum => datum[boardIdColumnIndex] === SHARE_BOARD_ID)!;

    return datum[lastPriceColumnIndex];
  } catch (error) {
    console.error('Error while fetching price', error);
  }

  return null;
}
