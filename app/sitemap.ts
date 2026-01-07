import { MetadataRoute } from 'next';

import { ALL_STOCKS } from '@/lib/data';
import { getUrlNameByStock } from '@/utils/transliteration/get-url-name-by-stock';
import { GORDON_CALCULATOR_URL, IRR_CALCULATOR_URL } from '@/constants/urls';

const lastModified = new Date();

export default function sitemap(): MetadataRoute.Sitemap {
  const stockPages = ALL_STOCKS.map(stock => ({
    url: `https://investemika.ru/${getUrlNameByStock(stock)}`,
    lastModified,
    priority: 1,
  }));

  const downloadPages = ALL_STOCKS
    .filter(stock => stock.firstCompanyTicker === stock.ticker)
    .map(stock => ({
      url: `https://investemika.ru/${getUrlNameByStock(stock)}/download`,
      lastModified,
      priority: 0.9,
    }));

  return [
    {
      url: 'https://investemika.ru',
      lastModified,
      priority: 0.7,
    },
    ...stockPages,
    ...downloadPages,
    {
      url: `https://investemika.ru${GORDON_CALCULATOR_URL}`,
      lastModified,
      priority: 1,
    },
    {
      url: `https://investemika.ru${IRR_CALCULATOR_URL}`,
      lastModified,
      priority: 1,
    },
  ];
}
