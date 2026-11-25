import { supabase } from './supabase'
import { IRISH_PATH } from '../data/path.ga'

export function getPathForLang(lang) {
  return lang === 'ga' ? IRISH_PATH : []
}

export function stepHref(step) {
  if (step.type === 'grammar') return `/grammar?topic=${step.tag}`
  if (step.type === 'scenario') return `/conversation?scenario=${step.scenarioId}`
  return step.route
}

// Index of the first not-yet-completed step — this is the one unlocked
// step the learner should do next. Everything before it is done,
// everything after it stays locked.
export function getCurrentStepIndex(path, completedIds) {
  const idx = path.findIndex(s => !completedIds.has(s.id))
  return idx === -1 ? path.length : idx
}

export async function getCompletedStepIds(userId, lang) {
  if (!userId || lang === 'en') return new Set()
  try {
    const { data, error } = await supabase
      .from('lesson_progress')
      .select('step_id')
      .eq('user_id', userId)
      .eq('lang', lang)
    if (error) throw error
    return new Set((data || []).map(r => r.step_id))
  } catch (err) {
    console.error('getCompletedStepIds failed (has the lesson_progress table been created?)', err)
    return new Set()
  }
}

export async function markStepComplete(userId, lang, stepId) {
  if (!userId || !lang || !stepId) return
  try {
    await supabase.from('lesson_progress').upsert(
      { user_id: userId, lang, step_id: stepId },
      { onConflict: 'user_id,lang,step_id', ignoreDuplicates: true }
    )
  } catch (err) {
    console.error('markStepComplete failed (has the lesson_progress table been created?)', err)
  }
}

// Called from awardXP whenever a game/conversation finishes, so the
// learning path advances automatically without every game needing to
// know about the curriculum itself.
export async function markStepCompleteForActivity(userId, lang, gameType, scenarioId) {
  const path = getPathForLang(lang)
  if (!path.length) return
  const step = gameType === 'conversation' && scenarioId
    ? path.find(s => s.type === 'scenario' && s.scenarioId === scenarioId)
    : path.find(s => s.type === 'game' && s.gameKey === gameType)
  if (step) await markStepComplete(userId, lang, step.id)
}
