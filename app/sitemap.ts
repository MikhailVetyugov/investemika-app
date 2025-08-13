import { MetadataRoute } from 'next';

import { ALL_COMPANIES } from '@/lib/data';
import { getUrlNameByCompany } from '@/utils/get-url-name-by-company';

export default function sitemap(): MetadataRoute.Sitemap {
  const dynamicUrls = ALL_COMPANIES.map(company => ({
    url: `https://investemika.ru/${getUrlNameByCompany(company)}`,
    lastModified: new Date(),
    priority: 0.9,
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
