import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://investemika.ru',
      lastModified: new Date('2025-08-13'),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
