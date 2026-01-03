import { MetadataRoute } from 'next';

import { ALL_STOCKS } from '@/lib/data';
import { getUrlNameByStock } from '@/utils/transliteration/get-url-name-by-stock';

export default function sitemap(): MetadataRoute.Sitemap {
  const stockPages = ALL_STOCKS.map(stock => ({
    url: `https://investemika.ru/${getUrlNameByStock(stock)}`,
    lastModified: new Date('2025-12-30'),
    priority: 1,
  }));

  const downloadPages = ALL_STOCKS
    .filter(stock => stock.firstCompanyTicker === stock.ticker)
    .map(stock => ({
      url: `https://investemika.ru/${getUrlNameByStock(stock)}/download`,
      lastModified: new Date('2026-01-03'),
      priority: 0.9,
    }));

  return [
    {
      url: 'https://investemika.ru',
      lastModified: new Date(),
      priority: 0.7,
    },
    ...stockPages,
    ...downloadPages,
  ];
}
