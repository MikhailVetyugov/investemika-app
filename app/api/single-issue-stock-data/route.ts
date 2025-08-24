import { NextRequest, NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';

import { fetchSingleIssueData } from '@/services/fetch-single-issue-stock-data';

const responseCache = new LRUCache({
  max: 50,
  ttl: 1000 * 60 * 30,
});

interface IRequestBody {
  ticker: string;
}

export async function POST(request: NextRequest) {
  const body: IRequestBody = await request.json();
  const { ticker } = body;

  try {
    if (!ticker) {
      return NextResponse.json(
        { error: 'Ticker is required' },
        { status: 400 }
      );
    }

    const result = await fetchSingleIssueData(ticker);

    if (!result.price) {
      throw new Error('No filled price found for the given ticker');
    }

    responseCache.set(ticker, result);

    return NextResponse.json(result);
  } catch (error) {
    const staleData = responseCache.get(ticker);

    if (staleData) {
      console.error('Stale data returned due to error:', error);

      return NextResponse.json({
        ...staleData,
        stale: true,
      });
    }

    console.error('Error in API route:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
