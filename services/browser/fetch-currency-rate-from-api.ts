import { TCurrency } from "@/types/currency";

export async function fetchCurrencyRateFromAPI(currency: TCurrency): Promise<number | null> {
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
