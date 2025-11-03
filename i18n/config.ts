
import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import fr from './translations/fr.json';

const i18n = new I18n({
  fr,
});

// Set the locale once at the beginning of your app
const deviceLanguage = getLocales()[0]?.languageCode || 'fr';
i18n.locale = deviceLanguage;

// When a value is missing from a language it'll fall back to French
i18n.enableFallback = true;
i18n.defaultLocale = 'fr';

export default i18n;
