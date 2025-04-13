import Calculator from '../components/Calculator';
import LanguageSwitcher from './components/LanguageSwitcher';
import { useTranslation } from '../i18n';
import React from 'react';

export default function Home({ params }: { params: { locale: string } }) {
  const { locale } = React.use(params);
  const { t } = React.use(useTranslation(locale, 'common'));

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {t('title')}
          </h1>
          <LanguageSwitcher locale={locale} />
        </header>
        
        <Calculator locale={locale} />
        
        <footer className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} {t('title')}</p>
        </footer>
      </div>
    </div>
  );
} 