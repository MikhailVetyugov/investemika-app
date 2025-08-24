import { NextRequest, NextResponse } from 'next/server';

import { fetchSingleIssueData } from '@/services/fetch-single-issue-stock-data';

interface IRequestBody {
  ticker: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: IRequestBody = await request.json();
    const { ticker } = body;

    if (!ticker) {
      return NextResponse.json(
        { error: 'Ticker is required' },
        { status: 400 }
      );
    }

    const result = await fetchSingleIssueData(ticker);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in API route:', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
