import { IStockDataInternalResponse } from "@/types/response/internal";

export async function fetchSingleIssueDataFromAPI(ticker: string): Promise<IStockDataInternalResponse> {
  try {
    const response = await fetch(`${window.location.origin}/api/single-issue-stock-data`, {
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
    console.error('Error while fetching stock data', error);
  }

  return {
    price: null,
    issueCapitalization: null,
  };
}
