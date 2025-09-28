import { NextRequest, NextResponse } from 'next/server';

import { fetchCurrencyRate } from '@/services/server';
import { TCurrency } from '@/types/currency';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const currency = searchParams.get('currency') as TCurrency;

  try {
    if (!currency) {
      return NextResponse.json(
        { error: 'Currency is required' },
        { status: 400 }
      );
    }

    const result = await fetchCurrencyRate(currency);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in API route (currency rate):', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
