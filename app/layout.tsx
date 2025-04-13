import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://howmanytimesleft.vercel.app"),
  title: {
    default: "あと何回？ | How Many Times Left? | 还剩几次？",
    template: "%s | How Many Times Left",
  },
  description: "「いつでもできる」は、意外と少ないかも。あなたの人生でコーヒーを飲む回数、映画を見る回数、親に会える回数などを計算できます。多言語対応の残り回数計算アプリ。",
  keywords: [
    // 日本語キーワード
    "あと何回", "残り時間", "人生計算", "寿命計算", "コーヒー", "映画", "旅行", "家族", 
    // 英語キーワード
    "How Many Times Left", "Life Calculator", "Remaining Time", "Coffee Counter", "Movie Counter", "Life Expectancy", 
    // 中国語キーワード
    "还剩几次", "人生计算器", "剩余时间", "咖啡次数", "电影次数", "预期寿命"
  ],
  creator: "Remaining Times Team",
  openGraph: {
    title: "あと何回？ | How Many Times Left? | 还剩几次？",
    description: "「いつでもできる」は、意外と少ないかも。あなたの人生であと何回、好きなことができるか計算するアプリ。",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "あと何回？",
      },
    ],
    locale: "ja_JP",
    type: "website",
    siteName: "あと何回？ | How Many Times Left",
  },
  twitter: {
    card: "summary_large_image",
    title: "あと何回？ | How Many Times Left? | 还剩几次？",
    description: "人生であと何回、好きなことができるか計算するアプリ",
    images: ["/og-image.png"],
    creator: "@your_twitter_handle",
  },
  alternates: {
    languages: {
      'ja': '/ja',
      'en': '/en',
      'zh': '/zh'
    },
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        
        {/* Cloudflare Web Analytics */}
        {process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN && (
          <Script
            strategy="afterInteractive"
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={`{"token": "${process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN}"}`}
          />
        )}
      </body>
    </html>
  );
}
