import { RUR_CURRENCY_RATE } from "@/constants/currencies";
import { TCurrency } from "@/types/currency";
import { ICurrencyRateResponse } from "@/types/response/external";
import { createCacheWrapper } from './cache-wrapper';

type TResult = number | null;

const { withCache } = createCacheWrapper<TResult>({
  max: 100,
  ttl: 1000 * 60 * 60 * 6,
});

export async function fetchCurrencyRate(code: TCurrency = 'RUR') {
  return withCache(fetchCurrencyRateRaw, code);
}

async function fetchCurrencyRateRaw(code: TCurrency): Promise<TResult> {
  if (code === 'RUR') {
    return RUR_CURRENCY_RATE;
  }

  try {
    const start = Date.now();

    const response = await fetch(`https://www.cbr-xml-daily.ru/daily_json.js`);

    const duration = Date.now() - start;

    if (duration >= 10) {
      console.log(`Currency rate is fetched: ${code} | ${duration}ms`);
    }

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const result: ICurrencyRateResponse = await response.json();

    if (!result.Valute[code]) {
      throw new Error('Currency not found');
    }

    const value = result.Valute[code].Value;

    return value;
  } catch (error) {
    console.error('Error while fetching currency rate', error);
  }

  return null;
}
