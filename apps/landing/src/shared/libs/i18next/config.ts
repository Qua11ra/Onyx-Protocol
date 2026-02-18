import i18n from "i18next"
import {initReactI18next} from "react-i18next"

import ruLocale from "./locales/ru.common.json"
import enLocale from "./locales/en.common.json"

const resources = {
    en: {
        translation: enLocale
    },
    ru: {
        translation: ruLocale
    }
}

i18n
.use(initReactI18next)
.init({
    resources,
    lng: "en",
    fallbackLng: "ru",
    interpolation: {
        escapeValue: false
    }
})

export default i18n