/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Routerではi18n設定は使用しません
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true
  },
  experimental: {
    // Next.js 14互換モードを有効にする
    serverComponentsExternalPackages: [],
    useNextHeaders: false
  }
};

module.exports = nextConfig; 