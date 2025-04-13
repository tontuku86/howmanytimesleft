import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['ja', 'en', 'zh'];
const defaultLocale = 'ja';

export function middleware(request: NextRequest) {
  // リクエストからパスを取得
  const pathname = request.nextUrl.pathname;

  // パスが /api、_next、静的ファイルなどで始まる場合は無視
  if (
    /^\/api\/.*$/.test(pathname) ||
    /^\/(_next|favicon\.ico|robots\.txt|sitemap\.xml).*$/.test(pathname)
  ) {
    return;
  }

  // ロケールがパスに含まれているかチェック
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // ロケールがない場合、デフォルトロケールにリダイレクト
  if (!pathnameHasLocale) {
    const url = new URL(`/${defaultLocale}${pathname === '/' ? '' : pathname}`, request.url);
    return NextResponse.redirect(url);
  }
}

// 明示的にミドルウェアが適用されるパスを設定
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};