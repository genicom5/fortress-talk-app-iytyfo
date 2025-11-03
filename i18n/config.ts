
import { I18n } from 'i18n-js';
import { getLocales } from 'expo-localization';
import fr from './translations/fr.json';

const i18n = new I18n({
  fr,
});

// Set the locale once at the beginning of your app
try {
  const locales = getLocales();
  const deviceLanguage = locales && locales[0] ? locales[0].languageCode : 'fr';
  i18n.locale = deviceLanguage || 'fr';
  console.log('i18n initialized with locale:', i18n.locale);
} catch (error) {
  console.log('Error getting locale, defaulting to French:', error);
  i18n.locale = 'fr';
}

// When a value is missing from a language it'll fall back to French
i18n.enableFallback = true;
i18n.defaultLocale = 'fr';

export default i18n;
