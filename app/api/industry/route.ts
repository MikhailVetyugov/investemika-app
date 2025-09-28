import { NextRequest, NextResponse } from 'next/server';
import { LRUCache } from 'lru-cache';

import { ALL_STOCKS } from '@/lib/data';
import { fetchAggregatedStockData } from '@/services/shared';

const responseCache = new LRUCache({
  max: 50,
  ttl: 1000 * 60 * 60 * 24,
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const industry = searchParams.get('industry');

  try {
    if (!industry) {
      return NextResponse.json(
        { error: 'Industry is required' },
        { status: 400 }
      );
    }

    const cachedIndustryData = responseCache.get(industry);

    if (cachedIndustryData) {
      return NextResponse.json({
        industryData: cachedIndustryData,
        stale: true,
      });
    }

    const industryStocks = ALL_STOCKS.filter(stock => stock.company.industry === industry);
    const stockPromises = industryStocks.map(stock => fetchAggregatedStockData(stock).then(data => ({
      data,
      companyId: stock.company.id,
    })));

    const industryData = await Promise.all(stockPromises);
    responseCache.set(industry, industryData);

    return NextResponse.json({ industryData });
  } catch (error) {
    console.error('Error in API route (industry):', error);

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
