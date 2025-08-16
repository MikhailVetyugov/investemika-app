import { IStock } from "@/types/stock";
import { IStockDataResponse } from "@/types/stock-data-response";

interface IResult {
  price: number | null;
  issueCapitalization: number | null;
}

const SHARE_BOARD_ID = 'TQBR';

const BOARD_ID_COLUMN = 'BOARDID';
const LAST_PRICE_COLUMN = 'LAST';
const ISSUE_CAPITALIZATION_COLUMN = 'ISSUECAPITALIZATION';

export async function fetchSingleIssueData({ ticker }: IStock): Promise<IResult> {
  try {
    const response = await fetch(`https://iss.moex.com/iss/engines/stock/markets/shares/securities/${ticker}.json`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result: IStockDataResponse = await response.json();

    const price = getColumnValue(LAST_PRICE_COLUMN, result);
    const issueCapitalization = getColumnValue(ISSUE_CAPITALIZATION_COLUMN, result);

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

function getColumnValue(columnName: string, result: IStockDataResponse) {
  const boardIdColumnIndex = result.marketdata.columns.findIndex(column => column === BOARD_ID_COLUMN)!;
  const neededColumnIndex = result.marketdata.columns.findIndex(column => column === columnName)!;

  const boardIdDatum = result.marketdata.data.find(datum => datum[boardIdColumnIndex] === SHARE_BOARD_ID)!;

  return boardIdDatum[neededColumnIndex];
}
