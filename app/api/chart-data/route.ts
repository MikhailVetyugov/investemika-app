import { NextRequest, NextResponse } from 'next/server';

import { fetchChartData } from '@/services/fetch-chart-data';
import { TTicker } from '@/types/ticker';

interface IRequestBody {
  ticker: TTicker;
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

    const result = await fetchChartData(ticker);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in API route (chart data):', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
