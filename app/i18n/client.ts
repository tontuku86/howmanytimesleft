'use client';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import resourcesToBackend from 'i18next-resources-to-backend';
import { getOptions } from './settings';
import LanguageDetector from 'i18next-browser-languagedetector';

// 言語ファイルをインポート
import jaCommon from '../../public/locales/ja/common.json';
import enCommon from '../../public/locales/en/common.json';
import zhCommon from '../../public/locales/zh/common.json';

// Japanese, English, and Chinese translations
const resources = {
  ja: {
    common: jaCommon
  },
  en: {
    common: enCommon
  },
  zh: {
    common: zhCommon
  }
};

const i18nInstance = i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(resourcesToBackend((language: string, namespace: string) => 
    import(`../../public/locales/${language}/${namespace}.json`)
  ));

// 初期化を一度だけ実行
let initialized = false;

if (!initialized) {
  i18nInstance.init({
    ...getOptions(),
    resources,
    detection: {
      order: ['path', 'htmlTag', 'cookie', 'navigator'],
      caches: ['cookie']
    },
    fallbackLng: 'ja',
    preload: ['ja', 'en', 'zh'],
    react: {
      useSuspense: false,
    },
    interpolation: {
      escapeValue: false
    }
  });
  initialized = true;
}

export default i18next; 