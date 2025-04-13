import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "あと何回？ | How Many Times Left? | 还剩几次？",
  description: "多言語対応の残り回数計算アプリ",
  openGraph: {
    title: "あと何回？ | How Many Times Left?",
    description: "人生であと何回、好きなことができるか計算するアプリ",
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
  },
  twitter: {
    card: "summary_large_image",
    title: "あと何回？ | How Many Times Left?",
    description: "人生であと何回、好きなことができるか計算するアプリ",
    images: ["/og-image.png"],
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
      </body>
    </html>
  );
}
