'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import i18next from '../../i18n/client';

const languages = ['ja', 'en', 'zh'];

export default function LanguageSwitcher({ locale }: { locale: string }) {
  const pathName = usePathname();
  const { i18n } = useTranslation('common');
  
  const redirectedPathName = (locale: string) => {
    if (!pathName) return '/';
    const segments = pathName.split('/');
    segments[1] = locale;
    return segments.join('/');
  };

  const handleLanguageChange = (newLocale: string) => {
    if (i18n.language !== newLocale) {
      console.log('LanguageSwitcher: Changing language to', newLocale);
      i18next.changeLanguage(newLocale);
    }
  };

  const languageNames = {
    ja: '🇯🇵 日本語',
    en: '🇺🇸 English',
    zh: '🇨🇳 中文',
  };

  return (
    <div className="flex space-x-2 justify-center mb-4">
      {languages.map((lang) => (
        <Link
          href={redirectedPathName(lang)}
          key={lang}
          onClick={() => handleLanguageChange(lang)}
          className={`px-3 py-1 text-sm rounded-md transition-colors ${
            locale === lang
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {languageNames[lang as keyof typeof languageNames]}
        </Link>
      ))}
    </div>
  );
} 