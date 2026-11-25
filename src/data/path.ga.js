// A linear, Duolingo-style curriculum for Irish — sequences the existing
// grammar topics, conversation scenarios and games into a recommended
// beginner-first order. Each step is completed by doing the normal
// activity (finishing a grammar quiz, a game round, or reviewing a
// conversation's mistakes at least once); see lib/path.js.
export const IRISH_PATH = [
  { id: 'ga-1',  type: 'grammar',  tag: 'ta-vs-is',      title: 'Tá vs. Is',                    icon: '🔵', level: 'A1' },
  { id: 'ga-2',  type: 'scenario', scenarioId: 'ga-cafe', title: 'Sa Chaifé',                    icon: '☕', level: 'A1' },
  { id: 'ga-3',  type: 'grammar',  tag: 'ag-pronouns',   title: 'Agam, Agat, Aige… (Tenir)',     icon: '🟢', level: 'A1' },
  { id: 'ga-4',  type: 'game',     gameKey: 'pronouns',      route: '/games/pronouns',  title: 'Pronouns',        icon: '👤', level: 'A1' },
  { id: 'ga-5',  type: 'game',     gameKey: 'listening_match', route: '/games/listening', title: 'Listening Match', icon: '👂', level: 'A1' },
  { id: 'ga-6',  type: 'scenario', scenarioId: 'ga-shopping', title: 'Ag Siopadóireacht',         icon: '🛍️', level: 'A1' },
  { id: 'ga-7',  type: 'grammar',  tag: 'present-tense', title: 'An Aimsir Láithreach',          icon: '🟡', level: 'A1' },
  { id: 'ga-8',  type: 'game',     gameKey: 'verb_blitz', route: '/games/verbs',    title: 'Verb Blitz',      icon: '⚡', level: 'A1' },
  { id: 'ga-9',  type: 'scenario', scenarioId: 'ga-directions', title: 'Ag Lorg Treoracha',        icon: '🗺️', level: 'A1' },
  { id: 'ga-10', type: 'game',     gameKey: 'shadowing',  route: '/games/shadowing', title: 'Shadowing Blitz', icon: '🔁', level: 'A1' },
  { id: 'ga-11', type: 'grammar',  tag: 'past-tense',    title: 'An Aimsir Chaite',              icon: '🟠', level: 'A2' },
  { id: 'ga-12', type: 'scenario', scenarioId: 'ga-meet-someone', title: 'Ag Bualadh le Duine Nua', icon: '🤝', level: 'A2' },
  { id: 'ga-13', type: 'grammar',  tag: 'pronouns',      title: 'Forainmneacha',                 icon: '👤', level: 'A1' },
  { id: 'ga-14', type: 'game',     gameKey: 'modal_verbs', route: '/games/modals',  title: 'Modal Verbs',     icon: '🔧', level: 'A2' },
  { id: 'ga-15', type: 'scenario', scenarioId: 'ga-airport', title: 'Ag an Aerfort',               icon: '✈️', level: 'A2' },
  { id: 'ga-16', type: 'scenario', scenarioId: 'ga-restaurant', title: 'Sa Bhialann',               icon: '🍽️', level: 'A2' },
  { id: 'ga-17', type: 'scenario', scenarioId: 'ga-doctor', title: 'Ag an Dochtúir',              icon: '🏥', level: 'A2' },
]
