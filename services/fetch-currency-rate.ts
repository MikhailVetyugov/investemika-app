import { TCurrency } from "@/types/currency";
import { ICurrencyRateResponse } from "@/types/currency-rate-response";

export async function fetchCurrencyRate(code: TCurrency): Promise<number | null> {
  if (code === 'RUR') {
    return 1;
  }

  try {
    const start = Date.now();

    const response = await fetch(`https://www.cbr-xml-daily.ru/daily_json.js`, {
      next: { revalidate: 60 * 60 * 6 }
    });

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

    return result.Valute[code].Value;
  } catch (error) {
    console.error('Error while fetching currency rate', error);
  }

  return null;
}
