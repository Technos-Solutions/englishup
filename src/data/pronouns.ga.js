// Irish (Gaeilge) pronouns. Categories are reinterpreted rather than
// mirrored 1:1: Irish has no distinct object-pronoun forms (subject
// pronouns double as objects), but it has two pronoun systems English
// doesn't — the "ag" (at) forms used to express possession/"having",
// and the emphatic "le" forms used for "mine/yours/...". The "en" field
// name is kept (rather than renamed) so existing game code needs no changes.

export const PRONOUN_CATEGORIES = {
  subject:   { label: 'Forainmneacha Ainmní',          icon: '👤', color: 'blue',    desc: 'Qui fa l\'acció: mé, tú, sé...' },
  object:    { label: 'Ag + Forainm (Tenir)',          icon: '🎯', color: 'purple',  desc: 'L\'irlandès no té "tenir" — es diu amb "ag": agam, agat...' },
  possAdj:   { label: 'Aidiachtaí Sealbhacha',         icon: '🏷️', color: 'emerald', desc: 'Acompanyen un nom (amb mutació): mo mhadra, do mhadra...' },
  possPron:  { label: 'Le + Forainm Treise',           icon: '💎', color: 'amber',   desc: 'Formes amb èmfasi: liomsa, leatsa... ("és meu", "és teu")' },
  reflexive: { label: 'Forainmneacha Athfhillteacha',  icon: '🔄', color: 'red',     desc: 'Acció sobre un mateix: mé féin, tú féin...' },
}

export const PRONOUNS = [
  // Subject
  { cat: 'jo',          en: 'mé',   type: 'subject', level: 'A1' },
  { cat: 'tu',          en: 'tú',   type: 'subject', level: 'A1' },
  { cat: 'ell',         en: 'sé',   type: 'subject', level: 'A1' },
  { cat: 'ella',        en: 'sí',   type: 'subject', level: 'A1' },
  { cat: 'nosaltres',   en: 'muid', type: 'subject', level: 'A1' },
  { cat: 'vosaltres',   en: 'sibh', type: 'subject', level: 'A1' },
  { cat: 'ells / elles',en: 'siad', type: 'subject', level: 'A1' },

  // "Ag" forms (possession / "tenir")
  { cat: 'jo tinc (... agam)',        en: 'agam',   type: 'object', level: 'A1' },
  { cat: 'tu tens (... agat)',        en: 'agat',   type: 'object', level: 'A1' },
  { cat: 'ell té (... aige)',         en: 'aige',   type: 'object', level: 'A1' },
  { cat: 'ella té (... aici)',        en: 'aici',   type: 'object', level: 'A1' },
  { cat: 'nosaltres tenim (... againn)', en: 'againn', type: 'object', level: 'A2' },
  { cat: 'vosaltres teniu (... agaibh)', en: 'agaibh', type: 'object', level: 'A2' },
  { cat: 'ells tenen (... acu)',      en: 'acu',    type: 'object', level: 'A2' },

  // Possessive adjectives
  { cat: 'el meu (+ séimhiú)',         en: 'mo',  type: 'possAdj', level: 'A1' },
  { cat: 'el teu (+ séimhiú)',         en: 'do',  type: 'possAdj', level: 'A1' },
  { cat: 'el seu, d\'ell (+ séimhiú)', en: 'a',   type: 'possAdj', level: 'A1' },
  { cat: 'el seu, d\'ella (sense mutació)', en: 'a', type: 'possAdj', level: 'A1' },
  { cat: 'el nostre',                  en: 'ár',  type: 'possAdj', level: 'A2' },
  { cat: 'el vostre',                  en: 'bhur',type: 'possAdj', level: 'A2' },
  { cat: 'el seu, d\'ells (+ urú)',    en: 'a',   type: 'possAdj', level: 'A2' },

  // Emphatic "le" forms (mine / yours / his...)
  { cat: 'és meu (liomsa)',   en: 'liomsa',     type: 'possPron', level: 'B1' },
  { cat: 'és teu (leatsa)',   en: 'leatsa',     type: 'possPron', level: 'B1' },
  { cat: 'és seu, d\'ell',    en: 'leis-sean',  type: 'possPron', level: 'B1' },
  { cat: 'és seu, d\'ella',   en: 'léise',      type: 'possPron', level: 'B1' },
  { cat: 'és nostre',         en: 'linne',      type: 'possPron', level: 'B1' },
  { cat: 'és vostre',         en: 'libhse',     type: 'possPron', level: 'B1' },
  { cat: 'és seu, d\'ells',   en: 'leosan',     type: 'possPron', level: 'B1' },

  // Reflexive ("féin")
  { cat: 'jo mateix',          en: 'mé féin',  type: 'reflexive', level: 'B1' },
  { cat: 'tu mateix',          en: 'tú féin',  type: 'reflexive', level: 'B1' },
  { cat: 'ell mateix',         en: 'é féin',   type: 'reflexive', level: 'B1' },
  { cat: 'ella mateixa',       en: 'í féin',   type: 'reflexive', level: 'B1' },
  { cat: 'nosaltres mateixos', en: 'muid féin',type: 'reflexive', level: 'B2' },
  { cat: 'vosaltres mateixos', en: 'sibh féin',type: 'reflexive', level: 'B2' },
  { cat: 'ells mateixos',      en: 'iad féin', type: 'reflexive', level: 'B2' },
]
