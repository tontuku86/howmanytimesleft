// @ts-nocheck
import { ReactNode } from 'react';
import type { Metadata } from "next";
import { localeMetadata } from './metadata';

type LayoutProps = {
  children: React.ReactNode;
  params: {
    locale: string;
  };
};

// 動的メタデータ生成（サーバーコンポーネントで実行される）
export const generateMetadata = ({ params }: LayoutProps): Metadata => {
  const locale = params.locale as keyof typeof localeMetadata;
  
  // localeMetadataから言語に対応するメタデータを取得
  // 対応する言語がない場合はjaのメタデータをデフォルトとして使用
  const metadata = localeMetadata[locale] || localeMetadata.ja;
  
  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    openGraph: {
      title: metadata.title,
      description: metadata.ogDescription,
    },
    twitter: {
      title: metadata.title,
      description: metadata.twitterDescription,
    },
  };
};

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
