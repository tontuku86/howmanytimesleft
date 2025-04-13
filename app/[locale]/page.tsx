'use client';  

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Calculator from '../components/Calculator';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import '../i18n/client';

export default function Home() {
  const params = useParams();
  const locale = (params.locale as string) || 'en';
  const { t, i18n } = useTranslation('common');
  const [currentLocale, setCurrentLocale] = useState(locale);

  useEffect(() => {
    if (i18n.language !== locale) {
      console.log('Page: Changing language from', i18n.language, 'to', locale);
      i18n.changeLanguage(locale).then(() => {
        setCurrentLocale(locale);
        console.log('Page: Language changed successfully');
      });
    }
  }, [locale, i18n]);

  // 言語が変わったらページを強制的に再レンダリング
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      console.log('Page: Language changed event detected:', lng);
      setCurrentLocale(lng);
    };

    i18n.on('languageChanged', handleLanguageChanged);

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('title')}
          </h1>
          <LanguageSwitcher locale={currentLocale} />
        </header>
        
        <Calculator locale={currentLocale} />
        
        <footer className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} {t('title')}</p>
        </footer>
      </div>
    </div>
  );
}
