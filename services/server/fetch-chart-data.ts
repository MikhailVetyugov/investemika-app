import { TTicker } from "@/types/ticker";
import { TChartDataInternalResponse } from "@/types/response/internal";
import { IChartDataExternalResponse } from "@/types/response/external";
import { formatDate } from "@/utils/formatters";
import { createCacheWrapper } from './cache-wrapper';

const DATE_COLUMN = 'begin';
const CLOSE_PRICE_COLUMN = 'close';

const INTERVAL = 7;
const YEARS_COUNT = 4;

const { withCache } = createCacheWrapper<TChartDataInternalResponse>({
  max: 100,
  ttl: 1000 * 60 * 60 * 8,
});


export async function fetchChartData(ticker: TTicker) {
  return withCache(fetchChartDataRaw, ticker);
}

async function fetchChartDataRaw(ticker: TTicker): Promise<TChartDataInternalResponse> {
  console.info('fetchChartDataRaw call');

  try {
    const response = await fetch(`https://iss.moex.com/iss/engines/stock/markets/shares/securities/${ticker}/candles.json?interval=${INTERVAL}&from=${getFromParam(YEARS_COUNT)}`);

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

    const result = {
      values,
      labels,
    };

    return result;
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
