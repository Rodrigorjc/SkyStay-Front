
const dictionaries = {
    en: () => import('./dictionaries/i18n/en.json').then((module) => module.default),
    es: () => import('./dictionaries/i18n/es.json').then((module) => module.default),
};

export const getDictionary = async (locale: 'en' | 'es') => {
    const loadDictionary = dictionaries[locale] || dictionaries['es'];
    return loadDictionary();
};

export async function fetchDictionary(lang: 'en' | 'es') {
    return await getDictionary(lang);
}