// The 11 classic irregular verbs of Irish. "participle" is repurposed to
// hold the verbal noun (ainm briathartha) — Irish doesn't have a direct
// past-participle equivalent, but the verbal noun plays a similar role
// (e.g. "ag dul" = going).
export const IRREGULAR_VERBS = [
  { base: 'bí',      translation: 'ser / estar',  past: 'bhí',     participle: 'bheith',    level: 'A1', example: 'Bhí sí an-tuirseach tar éis an lae oibre.' },
  { base: 'abair',   translation: 'dir',          past: 'dúirt',   participle: 'rá',        level: 'A1', example: 'Dúirt sí "Dia duit" agus í ag meangadh gáire.' },
  { base: 'déan',    translation: 'fer',          past: 'rinne',   participle: 'déanamh',   level: 'A1', example: 'Rinne sé a chuid obair bhaile roimh an dinnéar.' },
  { base: 'téigh',   translation: 'anar',         past: 'chuaigh', participle: 'dul',       level: 'A1', example: 'Chuaigh siad go dtí an trá Dé Domhnaigh seo caite.' },
  { base: 'abair',   translation: 'dir',          past: 'dúirt',   participle: 'rá',        level: 'A1', example: 'Cad a dúirt tú?' },
  { base: 'faigh',   translation: 'aconseguir / obtenir', past: 'fuair', participle: 'fáil', level: 'A1', example: 'Fuair mé post nua an mhí seo caite.' },
  { base: 'feic',    translation: 'veure',        past: 'chonaic', participle: 'feiceáil',  level: 'A1', example: 'Chonaic mé scannán iontach inné.' },
  { base: 'tar',     translation: 'venir',        past: 'tháinig', participle: 'teacht',    level: 'A1', example: 'Tháinig sé abhaile go han-déanach.' },
  { base: 'tabhair', translation: 'donar',        past: 'thug',    participle: 'tabhairt',  level: 'A1', example: 'Thug sí bronntanas álainn dom.' },
  { base: 'ith',     translation: 'menjar',       past: "d'ith",   participle: 'ithe',      level: 'A2', example: "D'ith sí úll don lón." },
  { base: 'clois',   translation: 'sentir / escoltar', past: 'chuala', participle: 'cloisteáil', level: 'A2', example: 'Chuala mé fuaim aisteach aréir.' },
  { base: 'beir',    translation: 'agafar / portar', past: 'rug',   participle: 'breith',    level: 'B1', example: 'Rug sí ar an liathróid go tapa.' },
]
