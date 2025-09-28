import { TChartDataInternalResponse } from "@/types/response/internal";
import { TTicker } from "@/types/ticker";

export async function fetchChartDataFromAPI(ticker: TTicker): Promise<TChartDataInternalResponse> {
  try {
    const response = await fetch(`${window.location.origin}/api/chart-data`, {
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
    console.error('Error while fetching chart data', error);
  }

  return null;
}
