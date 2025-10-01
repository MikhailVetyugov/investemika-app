import { NextRequest, NextResponse } from 'next/server';

import { fetchAverageCoefficients } from '@/services/server';
import { TIndustry } from '@/types/industry';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const industry = searchParams.get('industry') as TIndustry;

  try {
    if (!industry) {
      return NextResponse.json(
        { error: 'Industry is required' },
        { status: 400 }
      );
    }

    const averageCoefficients = await fetchAverageCoefficients(industry);

    return NextResponse.json(averageCoefficients);
  } catch (error) {
    console.error('Error in API route (average coefficients):', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
