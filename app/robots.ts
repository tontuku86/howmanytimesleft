import { MetadataRoute } from 'next';

// 静的エクスポート対応のための設定
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  // 静的エクスポートでは、ビルド時にこの値が埋め込まれます
  const baseUrl = 'https://howmanytimesleft.vercel.app';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
} 