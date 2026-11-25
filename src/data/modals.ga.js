// Irish doesn't have single-word modal verbs like English (can/must/should).
// Modality is expressed through set phrases built on "is", "ba" and
// particles like "caithfidh"/"ní gá". These exercises target the most
// common beginner-to-intermediate phrases for ability, obligation, advice
// and possibility. Same field shape as modals.js so ModalVerbs.jsx needs
// no changes.

export const MODAL_EXERCISES = [
  // A2 — ability (is féidir liom)
  { id: 'g1', sentence: 'Is ___ liom snámh go maith.',                cat: 'Jo ___ nedar molt bé.',                        answer: 'féidir',  options: ['féidir', 'maith', 'ceart', 'mian'],       level: 'A2', tip: '"Is féidir liom" = puc (aptitud / capacitat).' },
  { id: 'g2', sentence: 'An ___ leat an doras a dhúnadh?',             cat: 'Podries tancar la porta?',                     answer: 'bhféidir',options: ['bhféidir', 'maith', 'gcóir', 'mbeidh'],   level: 'B1', tip: '"An bhféidir leat...?" = podries...? (petició educada).' },
  { id: 'g3', sentence: 'Ní ___ liom an fuinneog a oscailt — tá sí ceangailte.', cat: 'No puc obrir la finestra — està encallada.', answer: 'féidir', options: ['féidir', 'maith', 'ceart', 'gá'], level: 'A2', tip: '"Ní féidir liom" = no puc (incapacitat).' },

  // B1 — obligation (caithfidh / ní gá)
  { id: 'g4', sentence: '___ mé dul abhaile anois.',                   cat: '___ anar a casa ara (he de).',                 answer: 'Caithfidh', options: ['Caithfidh', "B'fhéidir", 'Ba mhaith', 'Ba chóir'], level: 'B1', tip: '"Caithfidh mé" = haig de / he de (obligació forta).' },
  { id: 'g5', sentence: 'Ní ___ duit dul ag obair inniu — lá saoire atá ann.', cat: 'No cal que vagis a treballar avui — és festa.', answer: 'gá', options: ['gá', 'cóir', 'féidir', 'mhaith'], level: 'B1', tip: '"Ní gá duit" = no cal que (no és necessari).' },
  { id: 'g6', sentence: '___ linn an obair a chríochnú roimh am lóin.', cat: 'Hem d\'acabar la feina abans de dinar.',        answer: 'Caithfidh', options: ['Caithfidh', 'Ba chóir', "B'fhéidir", 'Is maith'], level: 'B1', tip: '"Caithfidh linn" = hem de (obligació del grup).' },

  // A2-B1 — advice (ba chóir do)
  { id: 'g7', sentence: '___ dom scíth a ligean.',                     cat: '___ descansar (hauria de).',                   answer: 'Ba chóir', options: ['Ba chóir', 'Caithfidh', 'Is féidir', "B'fhéidir"], level: 'B1', tip: '"Ba chóir dom" = hauria de (consell).' },
  { id: 'g8', sentence: 'Ní ___ duit an iomarca siúcra a ithe.',       cat: 'No hauries de menjar tant sucre.',             answer: 'cheart', options: ['cheart', 'gá', 'féidir', 'mhaith'], level: 'B1', tip: '"Ní cheart duit" = no hauries de (consell negatiu).' },

  // A2 — polite want (ba mhaith liom)
  { id: 'g9', sentence: '___ liom cupán tae, le do thoil.',            cat: '___ (m\'agradaria) una tassa de te, si us plau.', answer: 'Ba mhaith', options: ['Ba mhaith', 'Is maith', 'Caithfidh', "B'fhéidir"], level: 'A2', tip: '"Ba mhaith liom" = m\'agradaria (petició educada).' },
  { id: 'g10', sentence: 'Cad ___ leat a dhéanamh anocht?',            cat: 'Què t\'agradaria fer aquesta nit?',            answer: 'ba mhaith', options: ['ba mhaith', 'is maith', 'caithfidh', 'is féidir'], level: 'A2', tip: '"Ba mhaith leat" = t\'agradaria.' },

  // B2 — possibility (b'fhéidir go)
  { id: 'g11', sentence: "B'fhéidir ___ sí tinn.",                     cat: 'Potser és malalta.',                           answer: 'go bhfuil', options: ['go bhfuil', 'go raibh', 'is maith', 'is féidir'], level: 'B2', tip: '"B\'fhéidir go bhfuil" = potser és/està (possibilitat present).' },
  { id: 'g12', sentence: "B'fhéidir ___ sé déanach don chruinniú.",    cat: 'Potser va arribar tard a la reunió.',          answer: 'go raibh', options: ['go raibh', 'go bhfuil', 'is féidir', 'is maith'], level: 'B2', tip: '"B\'fhéidir go raibh" = potser va ser/estar (possibilitat passada).' },
]
