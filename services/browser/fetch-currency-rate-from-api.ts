import { RUR_CURRENCY_RATE } from "@/constants/currencies";
import { TCurrency } from "@/types/currency";

export async function fetchCurrencyRateFromAPI(currency: TCurrency = 'RUR'): Promise<number | null> {
  if (currency === 'RUR') {
    return RUR_CURRENCY_RATE;
  }

  try {
    const response = await fetch(`${window.location.origin}/api/currency-rate?currency=${currency}`);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    return await response.json();
  } catch (error) {
    console.error('Error while fetching currency rate', error);
  }

  return null;
}
