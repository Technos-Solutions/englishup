// Irish (Gaeilge) grammar — not a mirror of the English topics (Irish
// grammar works very differently: no single "to be", VSO word order,
// initial mutations...). A curated core of the topics a true beginner
// needs most. Native-speaker review recommended before relying on this
// for serious study.

export const GRAMMAR_TOPICS = [
  {
    id: 'ta-vs-is',
    icon: '🔵',
    title: 'Tá vs. Is',
    level: 'A1',
    tag: 'ta-vs-is',
    summary: 'Els dos verbs "ser/estar" de l\'irlandès — no és un de sol!',
    table: [
      { form: 'Tá — Affirmative (estat, lloc)', rows: [
        { cat: 'Jo estic',         en: 'Tá mé',        example: 'Tá mé go maith.' },
        { cat: 'Tu estàs',         en: 'Tá tú',        example: 'Tá tú cliste.' },
        { cat: 'Ell/Ella està',    en: 'Tá sé / Tá sí',example: 'Tá sí tuirseach.' },
        { cat: 'Nosaltres estem',  en: 'Táimid',       example: 'Táimid réidh.' },
        { cat: 'Ells estan',       en: 'Tá siad',      example: 'Tá siad anseo.' },
      ]},
      { form: 'Tá — Negative', rows: [
        { cat: 'Jo no estic',      en: 'Níl mé',       example: 'Níl mé tinn.' },
        { cat: 'Tu no estàs',      en: 'Níl tú',       example: 'Níl tú ceart.' },
        { cat: 'Ell/Ella no està', en: 'Níl sé / Níl sí',example: 'Níl sí sa bhaile.' },
      ]},
      { form: 'Tá — Question', rows: [
        { cat: 'Estàs...?',        en: 'An bhfuil tú...?', example: 'An bhfuil tú réidh?' },
        { cat: 'Està ell/ella...?',en: 'An bhfuil sé/sí...?', example: 'An bhfuil sí ag obair?' },
      ]},
      { form: 'Tá — Past', rows: [
        { cat: 'Jo estava',        en: 'Bhí mé',       example: 'Bhí mé sa bhaile.' },
        { cat: 'No estava',        en: 'Ní raibh mé',  example: 'Ní raibh mé ann.' },
      ]},
      { form: 'Is — Identitat / professió', rows: [
        { cat: 'Jo sóc (professor)', en: 'Is múinteoir mé', example: 'Is múinteoir mé.' },
        { cat: 'Ella és (metgessa)', en: 'Is dochtúir í',   example: 'Is dochtúir í.' },
        { cat: 'No sóc',             en: 'Ní mhúinteoir mé',example: 'Ní mhúinteoir mé.' },
        { cat: 'Ets...?',            en: 'An múinteoir thú?',example: 'An múinteoir thú?' },
      ]},
    ],
    quiz: [
      { q: 'Estic cansat.', options: ['Tá mé tuirseach.', 'Is mé tuirseach.', 'Bhí mé tuirseach.', 'Níl mé tuirseach.'], answer: 'Tá mé tuirseach.' },
      { q: 'Ella és metgessa.', options: ['Is dochtúir í.', 'Tá dochtúir í.', 'Tá sí dochtúir.', 'Is í dochtúir.'], answer: 'Is dochtúir í.' },
      { q: 'No sóc a casa.', options: ['Níl mé sa bhaile.', 'Ní mé sa bhaile.', 'Is mé sa bhaile.', 'An bhfuil mé sa bhaile.'], answer: 'Níl mé sa bhaile.' },
      { q: 'Ets professor?', options: ['An múinteoir thú?', 'An bhfuil múinteoir thú?', 'Tá tú múinteoir?', 'Is tú múinteoir?'], answer: 'An múinteoir thú?' },
    ],
  },
  {
    id: 'ag-pronouns',
    icon: '🟢',
    title: 'Agam, Agat, Aige... (Tenir / Agradar)',
    level: 'A1',
    tag: 'ag-pronouns',
    summary: 'L\'irlandès no té un verb "tenir" — es diu amb "ag" (a).',
    table: [
      { form: 'Ag — Tá ... agam (tenir)', rows: [
        { cat: 'Jo tinc',        en: 'agam',  example: 'Tá carr agam.' },
        { cat: 'Tu tens',        en: 'agat',  example: 'Tá madra agat.' },
        { cat: 'Ell té',         en: 'aige',  example: 'Tá teach aige.' },
        { cat: 'Ella té',        en: 'aici',  example: 'Tá cat aici.' },
        { cat: 'Nosaltres tenim',en: 'againn',example: 'Tá am againn.' },
        { cat: 'Ells tenen',     en: 'acu',   example: 'Tá airgead acu.' },
      ]},
      { form: 'Le — Is maith liom (agradar)', rows: [
        { cat: 'M\'agrada',        en: 'is maith liom', example: 'Is maith liom caife.' },
        { cat: 'T\'agrada',        en: 'is maith leat', example: 'Is maith leat an ceol.' },
        { cat: 'Li agrada (ell)',  en: 'is maith leis', example: 'Is maith leis sacar.' },
        { cat: 'Li agrada (ella)', en: 'is maith léi',  example: 'Is maith léi leabhair.' },
      ]},
    ],
    quiz: [
      { q: 'Tinc un gos.', options: ['Tá madra agam.', 'Tá madra agat.', 'Is maith liom madra.', 'Tá agam madra.'], answer: 'Tá madra agam.' },
      { q: 'M\'agrada el te.', options: ['Is maith liom tae.', 'Tá tae agam.', 'Is maith leat tae.', 'Is maith liom tae agam.'], answer: 'Is maith liom tae.' },
      { q: 'Ella té un cotxe.', options: ['Tá carr aici.', 'Tá carr aige.', 'Is maith léi carr.', 'Tá aici carr.'], answer: 'Tá carr aici.' },
    ],
  },
  {
    id: 'present-tense',
    icon: '🟡',
    title: 'An Aimsir Láithreach (Present Tense)',
    level: 'A1',
    tag: 'present-tense',
    summary: 'Com conjugar un verb regular — l\'exemple: ól (beure).',
    table: [
      { form: 'Affirmative — ól (to drink)', rows: [
        { cat: 'Jo bec',          en: 'Ólaim',       example: 'Ólaim tae gach maidin.' },
        { cat: 'Tu beus',         en: 'Ólann tú',    example: 'Ólann tú uisce.' },
        { cat: 'Ell/Ella beu',    en: 'Ólann sé/sí', example: 'Ólann sí caife.' },
        { cat: 'Nosaltres bevem', en: 'Ólaimid',     example: 'Ólaimid bainne.' },
        { cat: 'Ells beuen',      en: 'Ólann siad',  example: 'Ólann siad fíon.' },
      ]},
      { form: 'Negative', rows: [
        { cat: 'Jo no bec',       en: 'Ní ólaim',    example: 'Ní ólaim caife istoíche.' },
        { cat: 'Tu no beus',      en: 'Ní ólann tú', example: 'Ní ólann tú bainne.' },
      ]},
      { form: 'Question', rows: [
        { cat: 'Beus...?',        en: 'An ólann tú...?', example: 'An ólann tú tae?' },
      ]},
    ],
    quiz: [
      { q: 'Bec cafè cada dia.', options: ['Ólaim caife gach lá.', 'Ólann mé caife gach lá.', 'Tá mé ag ól caife.', 'Ólann caife mé.'], answer: 'Ólaim caife gach lá.' },
      { q: 'Beveu vosaltres te?', options: ['An ólann sibh tae?', 'Ólann sibh tae?', 'An bhfuil sibh ag ól tae?', 'Ólaimid tae?'], answer: 'An ólann sibh tae?' },
    ],
  },
  {
    id: 'past-tense',
    icon: '🟠',
    title: 'An Aimsir Chaite (Past Tense)',
    level: 'A2',
    tag: 'past-tense',
    summary: 'El passat regular — amb mutació inicial (séimhiú) o "d\'" davant vocal.',
    table: [
      { form: 'Affirmative — ól (to drink)', rows: [
        { cat: 'Vaig beure',  en: "D'ól mé",   example: "D'ól mé tae ar maidin." },
        { cat: 'Vas beure',   en: "D'ól tú",   example: "D'ól tú caife." },
        { cat: 'Va beure',    en: "D'ól sé/sí",example: "D'ól sí fíon." },
        { cat: 'Vam beure',   en: "D'ólamar",  example: "D'ólamar go leor uisce." },
        { cat: 'Van beure',   en: "D'ól siad", example: "D'ól siad bainne." },
      ]},
      { form: 'Negative', rows: [
        { cat: 'No vaig beure',en: 'Níor ól mé', example: 'Níor ól mé fíon.' },
      ]},
      { form: 'Question', rows: [
        { cat: 'Vas beure...?',en: 'Ar ól tú...?', example: 'Ar ól tú caife?' },
      ]},
    ],
    quiz: [
      { q: 'Vaig beure aigua.', options: ["D'ól mé uisce.", 'Ólaim uisce.', 'Ól mé uisce.', 'Ní ólaim uisce.'], answer: "D'ól mé uisce." },
      { q: 'No vas beure cafè.', options: ['Níor ól tú caife.', 'Ní ólann tú caife.', "D'ól tú caife.", 'Níl tú ag ól caife.'], answer: 'Níor ól tú caife.' },
    ],
  },
  {
    id: 'pronouns',
    icon: '👤',
    title: 'Forainmneacha (Pronouns)',
    level: 'A1',
    tag: 'pronouns',
    summary: 'Forainmneacha ainmní i aidiachtaí sealbhacha, amb les mutacions.',
    table: [
      { form: 'Forainmneacha Ainmní (Subject)', rows: [
        { cat: 'jo',          en: 'mé',         example: 'Tá mé anseo.' },
        { cat: 'tu',          en: 'tú',         example: 'Tá tú go maith.' },
        { cat: 'ell',         en: 'sé',         example: 'Tá sé ard.' },
        { cat: 'ella',        en: 'sí',         example: 'Tá sí óg.' },
        { cat: 'nosaltres',   en: 'muid / sinn',example: 'Táimid sásta.' },
        { cat: 'vosaltres',   en: 'sibh',       example: 'Tá sibh anseo.' },
        { cat: 'ells/elles',  en: 'siad',       example: 'Tá siad ag obair.' },
      ]},
      { form: 'Aidiachtaí Sealbhacha (Possessive)', rows: [
        { cat: 'el meu (+ séimhiú)',        en: 'mo',  example: 'mo mhadra (my dog)' },
        { cat: 'el teu (+ séimhiú)',        en: 'do',  example: 'do mhadra (your dog)' },
        { cat: 'el seu, d\'ell (+ séimhiú)', en: 'a',   example: 'a mhadra (his dog)' },
        { cat: 'el seu, d\'ella',           en: 'a',   example: 'a madra (her dog)' },
        { cat: 'el nostre',                 en: 'ár',  example: 'ár madra (our dog)' },
        { cat: 'el seu, d\'ells',           en: 'a',   example: 'a madra (their dog)' },
      ]},
    ],
    quiz: [
      { q: 'El meu gos', options: ['mo mhadra', 'do mhadra', 'a mhadra', 'ár madra'], answer: 'mo mhadra' },
      { q: 'El seu gos (d\'ella)', options: ['a madra', 'a mhadra', 'mo mhadra', 'ár madra'], answer: 'a madra' },
      { q: 'Nosaltres', options: ['muid', 'sibh', 'siad', 'sé'], answer: 'muid' },
    ],
  },
]

export const TAG_TO_TOPIC = Object.fromEntries(GRAMMAR_TOPICS.map(t => [t.tag, t]))
