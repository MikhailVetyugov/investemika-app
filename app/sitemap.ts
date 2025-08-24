import { MetadataRoute } from 'next';

import { ALL_STOCKS } from '@/lib/data';
import { getUrlNameByStock } from '@/utils/get-url-name-by-stock';

export default function sitemap(): MetadataRoute.Sitemap {
  const dynamicUrls = ALL_STOCKS.map(stock => ({
    url: `https://investemika.ru/${getUrlNameByStock(stock)}`,
    lastModified: new Date(),
    priority: 0.8,
  }));

  return [
    {
      url: 'https://investemika.ru',
      lastModified: new Date(),
      priority: 1,
    },
    ...dynamicUrls,
  ];
}
