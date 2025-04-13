import { ReactNode } from 'react';
import React from 'react';

interface LayoutProps {
  children: ReactNode;
  params: { locale: string };
}

export default function LocaleLayout({
  children,
  params,
}: LayoutProps) {
  const locale = React.use(Promise.resolve(params.locale));
  
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
