export const MODAL_EXERCISES = [
  // A1 — can / can't (ability & permission)
  { id: 'm1',  sentence: "I ___ swim very well.",                         cat: "Jo ___ nedar molt bé.",                              answer: 'can',      options: ['can', 'must', 'should', 'would'],    level: 'A1', tip: '"Can" expressa capacitat / habilitat.' },
  { id: 'm2',  sentence: "___ I use your phone, please?",                 cat: "___ fer servir el teu telèfon, si us plau?",          answer: 'Can',      options: ['Can', 'Must', 'Should', 'Would'],    level: 'A1', tip: '"Can" per demanar permís de forma informal.' },
  { id: 'm3',  sentence: "She ___ speak French — she never learned it.",  cat: "Ella ___ parlar francès — mai no l'ha après.",        answer: "can't",    options: ["can't", "mustn't", "shouldn't", "wouldn't"], level: 'A1', tip: '"Can\'t" indica incapacitat.' },
  { id: 'm4',  sentence: "He ___ play the guitar really well.",           cat: "Ell ___ tocar la guitarra molt bé.",                  answer: 'can',      options: ['can', 'must', 'should', 'might'],    level: 'A1', tip: '"Can" per habilitat present.' },

  // A2 — should / shouldn't (advice)
  { id: 'm5',  sentence: "You look tired. You ___ get some rest.",        cat: "Sembles cansat. ___ descansar una mica.",             answer: 'should',   options: ['should', 'can', 'must', 'would'],    level: 'A2', tip: '"Should" dona un consell.' },
  { id: 'm6',  sentence: "You ___ eat so much sugar — it\'s bad for you.",cat: "No ___ menjar tanta sucre — és dolent per tu.",       answer: "shouldn't",options: ["shouldn't", "can't", "mustn't", "wouldn't"], level: 'A2', tip: '"Shouldn\'t" és un consell negatiu.' },
  { id: 'm7',  sentence: "I think you ___ apologise to her.",             cat: "Crec que ___ demanar-li perdó.",                     answer: 'should',   options: ['should', 'can', 'could', 'would'],   level: 'A2', tip: '"Should" suggereix la millor acció.' },

  // B1 — must / mustn't, have to / don't have to
  { id: 'm8',  sentence: "You ___ wear a seatbelt in a car. It\'s the law.", cat: "Has de dur el cinturó de seguretat. És la llei.",  answer: 'must',     options: ['must', 'should', 'could', 'might'],  level: 'B1', tip: '"Must" expressa obligació forta / llei.' },
  { id: 'm9',  sentence: "You ___ smoke inside the building.",            cat: "Està prohibit fumar dins l\'edifici.",                answer: "mustn't",  options: ["mustn't", "shouldn't", "don't have to", "couldn't"], level: 'B1', tip: '"Mustn\'t" és prohibició.' },
  { id: 'm10', sentence: "It\'s a holiday — you ___ go to work today.",   cat: "És festa — avui no cal que vagis a treballar.",       answer: "don't have to", options: ["don't have to", "mustn't", "can't", "shouldn't"], level: 'B1', tip: '"Don\'t have to" = no és necessari (no és prohibit).' },
  { id: 'm11', sentence: "Could you ___ close the window, please?",       cat: "Pots tancar la finestra, si us plau?",                answer: 'close',    options: ['close', 'closes', 'closed', 'closing'], level: 'B1', tip: 'Forma infinitiva després de modal.' },

  // B1-B2 — could / would (polite requests & conditionals)
  { id: 'm12', sentence: "___ you help me with this report?",             cat: "___ ajudar-me amb aquest informe?",                  answer: 'Could',    options: ['Could', 'Can', 'Must', 'Should'],    level: 'B1', tip: '"Could" és més formal i educada que "can".' },
  { id: 'm13', sentence: "If I had more money, I ___ travel the world.",  cat: "Si tingués més diners, ___ viatjar pel món.",        answer: 'would',    options: ['would', 'will', 'should', 'must'],   level: 'B2', tip: '"Would" en condicional (hipotètic).' },
  { id: 'm14', sentence: "___ you like a cup of tea?",                    cat: "___ una tassa de te?",                               answer: 'Would',    options: ['Would', 'Will', 'Could', 'Should'],  level: 'B2', tip: '"Would you like" per oferir educadament.' },
  { id: 'm15', sentence: "I ___ rather stay home tonight.",               cat: "Preferiria quedar-me a casa aquest vespre.",         answer: 'would',    options: ['would', 'could', 'should', 'might'], level: 'B2', tip: '"Would rather" = preferiria.' },

  // B2 — might / may (possibility)
  { id: 'm16', sentence: "Take an umbrella — it ___ rain later.",         cat: "Agafa un paraigua — potser plourà més tard.",        answer: 'might',    options: ['might', 'must', 'should', 'would'],  level: 'B2', tip: '"Might" = possibilitat (50% o menys).' },
  { id: 'm17', sentence: "She ___ be at the office — try calling her.",   cat: "Pot ser que sigui a l\'oficina — prova de trucar-la.", answer: 'may',    options: ['may', 'must', 'will', 'would'],      level: 'B2', tip: '"May" = possibilitat (similar a might, més formal).' },
  { id: 'm18', sentence: "He ___ have forgotten our meeting.",            cat: "Pot ser que hagi oblidat la reunió.",                answer: 'might',    options: ['might', 'should', 'would', 'must'],  level: 'B2', tip: '"Might have + participi" = possibilitat en el passat.' },

  // C1 — ought to, need to, needn't
  { id: 'm19', sentence: "You ___ to be more careful with your words.",   cat: "Hauries de tenir més cura amb les teves paraules.",  answer: 'ought',    options: ['ought', 'should', 'must', 'need'],   level: 'C1', tip: '"Ought to" = deure moral (similar a should, més formal).' },
  { id: 'm20', sentence: "You ___ worry — everything is under control.",  cat: "No cal que et preocupis — tot està controlat.",      answer: "needn't",  options: ["needn't", "mustn't", "shouldn't", "couldn't"], level: 'C1', tip: '"Needn\'t" = no cal / no és necessari.' },
  { id: 'm21', sentence: "By now she ___ have arrived at the airport.",   cat: "A hores d\'ara ja hauria d\'haver arribat.",         answer: 'should',   options: ['should', 'might', 'could', 'would'], level: 'C1', tip: '"Should have + participi" = expectativa sobre el passat.' },
]
