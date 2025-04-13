import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://howmanytimesleft.vercel.app';
  
  const languages = ['ja', 'en', 'zh'];
  
  const routes = [
    '',
    '/ja',
    '/en',
    '/zh',
  ];

  const sitemap: MetadataRoute.Sitemap = routes.map(route => {
    return {
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: route === '' ? 1 : 0.8,
    };
  });

  return sitemap;
} 