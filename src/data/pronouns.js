export const PRONOUN_CATEGORIES = {
  subject:    { label: 'Subject Pronouns',      icon: '👤', color: 'blue',   desc: 'Qui fa l\'acció: jo, tu, ell...' },
  object:     { label: 'Object Pronouns',       icon: '🎯', color: 'purple', desc: 'Qui rep l\'acció: em, et, el...' },
  possAdj:    { label: 'Possessive Adjectives', icon: '🏷️', color: 'emerald',desc: 'Acompanyen un nom: el meu, el teu...' },
  possPron:   { label: 'Possessive Pronouns',   icon: '💎', color: 'amber',  desc: 'Substitueixen el nom: el meu, el teu...' },
  reflexive:  { label: 'Reflexive Pronouns',    icon: '🔄', color: 'red',    desc: 'Acció sobre un mateix: jo mateix...' },
}

export const PRONOUNS = [
  // Subject
  { cat: 'jo',        en: 'I',         type: 'subject',   level: 'A1' },
  { cat: 'tu',        en: 'you',       type: 'subject',   level: 'A1' },
  { cat: 'ell',       en: 'he',        type: 'subject',   level: 'A1' },
  { cat: 'ella',      en: 'she',       type: 'subject',   level: 'A1' },
  { cat: 'això / allò', en: 'it',      type: 'subject',   level: 'A1' },
  { cat: 'nosaltres', en: 'we',        type: 'subject',   level: 'A1' },
  { cat: 'vosaltres / vostès', en: 'you', type: 'subject',level: 'A1' },
  { cat: 'ells / elles', en: 'they',   type: 'subject',   level: 'A1' },

  // Object
  { cat: 'a mi / em', en: 'me',        type: 'object',    level: 'A1' },
  { cat: 'a tu / et', en: 'you',       type: 'object',    level: 'A1' },
  { cat: 'a ell / el', en: 'him',      type: 'object',    level: 'A1' },
  { cat: 'a ella / la', en: 'her',     type: 'object',    level: 'A1' },
  { cat: 'a això',    en: 'it',        type: 'object',    level: 'A1' },
  { cat: 'a nosaltres / ens', en: 'us',type: 'object',    level: 'A1' },
  { cat: 'a ells / els', en: 'them',   type: 'object',    level: 'A1' },

  // Possessive adjectives
  { cat: 'el meu / la meva',     en: 'my',    type: 'possAdj', level: 'A1' },
  { cat: 'el teu / la teva',     en: 'your',  type: 'possAdj', level: 'A1' },
  { cat: 'el seu / la seva (ell)', en: 'his', type: 'possAdj', level: 'A1' },
  { cat: 'el seu / la seva (ella)', en: 'her',type: 'possAdj', level: 'A1' },
  { cat: 'el seu / la seva (cosa)', en: 'its',type: 'possAdj', level: 'A2' },
  { cat: 'el nostre / la nostra', en: 'our',  type: 'possAdj', level: 'A2' },
  { cat: 'el vostre / la vostra', en: 'your', type: 'possAdj', level: 'A2' },
  { cat: 'el seu / la seva (ells)', en: 'their', type: 'possAdj', level: 'A2' },

  // Possessive pronouns
  { cat: 'el meu / la meva (substituint)',  en: 'mine',   type: 'possPron', level: 'B1' },
  { cat: 'el teu / la teva (substituint)',  en: 'yours',  type: 'possPron', level: 'B1' },
  { cat: 'el seu / la seva (ell, subst.)',  en: 'his',    type: 'possPron', level: 'B1' },
  { cat: 'el seu / la seva (ella, subst.)', en: 'hers',   type: 'possPron', level: 'B1' },
  { cat: 'el nostre (substituint)',          en: 'ours',   type: 'possPron', level: 'B1' },
  { cat: 'el vostre (substituint)',          en: 'yours',  type: 'possPron', level: 'B1' },
  { cat: 'el seu (ells, substituint)',       en: 'theirs', type: 'possPron', level: 'B1' },

  // Reflexive
  { cat: 'jo mateix / jo mateixa',      en: 'myself',     type: 'reflexive', level: 'B1' },
  { cat: 'tu mateix / tu mateixa',      en: 'yourself',   type: 'reflexive', level: 'B1' },
  { cat: 'ell mateix',                   en: 'himself',    type: 'reflexive', level: 'B1' },
  { cat: 'ella mateixa',                 en: 'herself',    type: 'reflexive', level: 'B1' },
  { cat: 'ell/ella mateix (cosa)',       en: 'itself',     type: 'reflexive', level: 'B1' },
  { cat: 'nosaltres mateixos',           en: 'ourselves',  type: 'reflexive', level: 'B2' },
  { cat: 'vosaltres mateixos',           en: 'yourselves', type: 'reflexive', level: 'B2' },
  { cat: 'ells / elles mateixos',        en: 'themselves', type: 'reflexive', level: 'B2' },
]
