import { TTicker } from "@/types/ticker";
import { TChartDataInternalResponse } from "@/types/response/internal";
import { IChartDataExternalResponse } from "@/types/response/external";
import { formatDate } from "@/utils/formatters";

const DATE_COLUMN = 'begin';
const CLOSE_PRICE_COLUMN = 'close';

const INTERVAL = 7;
const YEARS_COUNT = 4;

export async function fetchChartData(ticker: TTicker): Promise<TChartDataInternalResponse> {
  try {
    const response = await fetch(`https://iss.moex.com/iss/engines/stock/markets/shares/securities/${ticker}/candles.json?interval=${INTERVAL}&from=${getFromParam(YEARS_COUNT)}`, {
      next: {
        tags: [`${ticker}-chart`],
        revalidate: 8 * 60 * 60,
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const jsonResponse: IChartDataExternalResponse = await response.json();

    const closePriceColumnIndex = jsonResponse.candles.columns.findIndex(column => column === CLOSE_PRICE_COLUMN)!;
    const dateColumnIndex = jsonResponse.candles.columns.findIndex(column => column === DATE_COLUMN)!;

    const values = jsonResponse.candles.data.map(item => item[closePriceColumnIndex] as number);
    const labels = jsonResponse.candles.data.map(item => {
      const date = new Date(item[dateColumnIndex]);

      return formatDate(date);
    });

    return {
      values,
      labels,
    };
  } catch (error) {
    console.error('Error while fetching chart data', error);
  }

  return null;
}

function getFromParam(yearCount: number) {
  const currentYear = new Date().getFullYear();
  const resultDateInMs = new Date().setFullYear(currentYear - yearCount);
  const resultDate = new Date(resultDateInMs);

  const year = resultDate.getFullYear();
  const month = String(resultDate.getMonth() + 1).padStart(2, '0');
  const day = String(resultDate.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
