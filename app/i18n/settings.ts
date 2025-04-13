export const fallbackLng = 'ja';
export const languages = ['ja', 'en', 'zh'];
export const defaultNS = 'common';

export function getOptions(lng = fallbackLng, ns = defaultNS) {
  return {
    // debug: true,
    supportedLngs: languages,
    fallbackLng,
    lng,
    fallbackNS: defaultNS,
    defaultNS,
    ns,
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
      transEmptyNodeValue: '',
    },
    load: 'currentOnly',
    // cacheを有効にすることで、言語ファイルを再ロードする回数を減らす
    cacheName: 'i18next',
    // 言語切り替えの即時反映のためにlocalStorageキャッシュを無効化
    cache: { enabled: false },
  };
} 