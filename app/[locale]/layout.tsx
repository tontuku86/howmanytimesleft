// @ts-nocheck
import { ReactNode } from 'react';

export default function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  // 静的エクスポートの場合はシンプルに
  return (
    <div lang={params.locale} className="locale-container">
      {children}
    </div>
  );
}

// 静的に生成される言語パス
export function generateStaticParams() {
  return [
    { locale: 'ja' },
    { locale: 'en' },
    { locale: 'zh' },
  ];
}
