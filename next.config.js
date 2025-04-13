/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Routerではi18n設定は使用しません
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true
  }
};

module.exports = nextConfig; 