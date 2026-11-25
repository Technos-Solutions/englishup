export const LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', speechLang: 'en-GB', recognitionLang: 'en-US' },
  { code: 'ga', name: 'Irish',   nativeName: 'Gaeilge',  flag: '🇮🇪', speechLang: 'ga-IE', recognitionLang: 'ga-IE' },
]

export function getLanguageInfo(code) {
  return LANGUAGES.find(l => l.code === code) || LANGUAGES[0]
}
