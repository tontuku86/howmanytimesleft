import { MetadataRoute } from 'next';

// 静的エクスポート対応のための設定
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  // 静的エクスポートでは、ビルド時にこの値が埋め込まれます
  const baseUrl = 'https://howmanytimesleft.vercel.app';
  
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