import { useState } from 'react'
import { Link } from 'react-router-dom'

const GAMES = [
  {
    to: '/games/listening',
    icon: '👂',
    title: 'Listening Match',
    description: 'Escolta una paraula i tria la correcta entre 4 opcions.',
    info: 'Entrenes l\'oïda: la IA diu una paraula en anglès i tu tries quin és entre 4 opcions. Ideal per distingir paraules similars i millorar la comprensió oral. L\'àudio sempre va primer.',
    level: 'A1',
    color: 'bg-blue-50 border-blue-200',
    badge: 'bg-blue-100 text-blue-700',
  },
  {
    to: '/games/shadowing',
    icon: '🔁',
    title: 'Shadowing Blitz',
    description: 'Escolta una frase i repeteix-la. Puntuació per precisió.',
    info: 'Tècnica de "shadowing": escoltes una frase en anglès i la repeteixes en veu alta. L\'app compara el que has dit amb l\'original i et puntua. Millora molt la pronunciació i la fluïdesa oral.',
    level: 'A1',
    color: 'bg-emerald-50 border-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  {
    to: '/games/verbs',
    icon: '⚡',
    title: 'Verb Blitz',
    description: 'Verbs irregulars + traducció. Tria o di el passat. MC o oral.',
    info: 'Entrenament exprés de verbs irregulars. Veus el verb en infinitiu (amb traducció al català), i has de dir o triar la forma de passat. Pots triar mode Multiple Choice (4 opcions) o Oral (di la resposta en veu alta).',
    level: 'A2',
    color: 'bg-amber-50 border-amber-200',
    badge: 'bg-amber-100 text-amber-700',
  },
  {
    to: '/games/modals',
    icon: '🔧',
    title: 'Modal Verbs',
    description: 'Completa frases amb can, should, must, would, might...',
    info: 'Practica els verbs modals en context real. Veus una frase amb un buit i has de triar el modal correcte (can, could, should, must, would, might...). Cada resposta té una explicació del perquè. Nivells A1 fins a C1.',
    level: 'A2',
    color: 'bg-rose-50 border-rose-200',
    badge: 'bg-rose-100 text-rose-700',
  },
  {
    to: '/games/pronouns',
    icon: '👤',
    title: 'Pronouns',
    description: 'Català → Anglès: subjecte, objecte, possessiu, reflexiu.',
    info: 'Aprèn els pronoms anglesos per categories: subjecte (I, he, she...), objecte (me, him, her...), possessiu adjectiu (my, his, her...), possessiu pronom (mine, his, hers...) i reflexiu (myself, himself...). Pots filtrar per categoria o barrejar-los tots.',
    level: 'A1',
    color: 'bg-teal-50 border-teal-200',
    badge: 'bg-teal-100 text-teal-700',
  },
  {
    to: '/conversation',
    icon: '🎭',
    title: 'Roleplay',
    description: 'Conversa completa amb IA en un escenari real.',
    info: 'El joc principal! Tries un escenari (café, aeroport, empresa, viatge per Europa...) i converses amb la IA en anglès. Pots parlar per veu o escriure. Al final reps un anàlisi complet dels teus errors amb correccions i suggeriments de vocabulari.',
    level: 'A1',
    color: 'bg-purple-50 border-purple-200',
    badge: 'bg-purple-100 text-purple-700',
  },
]

function InfoTooltip({ text }) {
  const [open, setOpen] = useState(false)
  return (
    <span className="relative inline-block">
      <button
        onClick={() => setOpen(v => !v)}
        className="text-gray-400 hover:text-indigo-500 transition-colors text-sm font-bold w-5 h-5 flex items-center justify-center rounded-full border border-gray-300 hover:border-indigo-400"
      >
        i
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-7 w-64 bg-gray-900 text-white text-xs rounded-xl p-3 z-20 shadow-xl leading-relaxed">
            {text}
          </div>
        </>
      )}
    </span>
  )
}

export default function GamesHub() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">🎮 Games</h1>
        <p className="text-gray-500 mt-1">Tots els jocs disponibles sempre. El nivell indica la dificultat.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {GAMES.map(g => (
          <div key={g.to} className={`border-2 ${g.color} rounded-2xl p-5`}>
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{g.icon}</span>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${g.badge}`}>
                  {g.level}
                </span>
                <InfoTooltip text={g.info} />
              </div>
            </div>
            <h3 className="font-bold text-gray-900 mb-1">{g.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{g.description}</p>
            <Link
              to={g.to}
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-xl text-sm transition-colors"
            >
              Play now →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
