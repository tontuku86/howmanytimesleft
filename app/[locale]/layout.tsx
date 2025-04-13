import { ReactNode } from 'react';

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  return (
    <div lang={locale} className="locale-container">
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
