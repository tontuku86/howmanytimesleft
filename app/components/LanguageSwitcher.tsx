'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import i18next from '../i18n/client';
import { useEffect } from 'react';

const languages = ['ja', 'en', 'zh'];

export default function LanguageSwitcher({ locale }: { locale: string }) {
  const pathName = usePathname();
  const router = useRouter();
  const { i18n } = useTranslation('common');
  
  // 現在の言語と渡されたlocaleが同期するように
  useEffect(() => {
    if (i18n.language !== locale) {
      i18next.changeLanguage(locale);
    }
  }, [locale, i18n.language]);
  
  const redirectedPathName = (newLocale: string) => {
    if (!pathName) return '/';
    const segments = pathName.split('/');
    segments[1] = newLocale;
    return segments.join('/');
  };

  const handleLanguageChange = (newLocale: string) => {
    console.log('LanguageSwitcher: Changing language to', newLocale);
    // 即座に言語を変更
    i18next.changeLanguage(newLocale);
  };

  const languageNames = {
    ja: '🇯🇵 日本語',
    en: '🇺🇸 English',
    zh: '🇨🇳 中文',
  };

  // モバイル用の短いラベル
  const shortLanguageNames = {
    ja: '🇯🇵',
    en: '🇺🇸',
    zh: '🇨🇳',
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-4">
      {languages.map((lang) => (
        <Link
          href={redirectedPathName(lang)}
          key={lang}
          onClick={() => handleLanguageChange(lang)}
          className={`px-2 sm:px-3 py-1 text-sm rounded-md transition-colors ${
            locale === lang
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          <span className="hidden sm:inline">{languageNames[lang as keyof typeof languageNames]}</span>
          <span className="sm:hidden">{shortLanguageNames[lang as keyof typeof shortLanguageNames]}</span>
        </Link>
      ))}
    </div>
  );
} 