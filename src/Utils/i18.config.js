
import i18next from 'i18next';
import en from './translations/en.json'
import ar from './translations/ar.json'
import {I18nManager} from 'react-native'
import { initReactI18next } from "react-i18next";

export const languageResources = {
    en: {translation: en},
    ar:{translation: ar}
  
  };
  
  i18next.use(initReactI18next).init({
    debug: true,
    compatibilityJSON: 'v3',
    lng:I18nManager.isRTL ? 'ar' : 'en',
    //fallbackLng: 'en',
    resources: languageResources,
    interpolation: {
        escapeValue: false
      }
  });
  
  export default i18next;