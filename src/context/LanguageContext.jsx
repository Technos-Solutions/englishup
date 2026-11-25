import { createContext, useContext, useState } from 'react'
import { LANGUAGES, getLanguageInfo } from '../data/languages'

const KEY = 'eu_target_lang'
const LanguageContext = createContext({})

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => localStorage.getItem(KEY) || 'en')

  function setLang(code) {
    localStorage.setItem(KEY, code)
    setLangState(code)
  }

  const info = getLanguageInfo(lang)

  return (
    <LanguageContext.Provider value={{ lang, setLang, info, languages: LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
