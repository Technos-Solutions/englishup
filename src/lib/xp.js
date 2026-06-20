import { supabase } from './supabase'
import { LEVELS } from '../data/levels'
import { ACHIEVEMENTS } from '../data/achievements'

export const XP_REWARDS = {
  listening_match: 10,
  shadowing: 15,
  verb_blitz: 10,
  roleplay: 20,
  conversation: 30,
}

export function calculateConversationXP(fluencyScore) {
  return Math.round(XP_REWARDS.conversation + fluencyScore * 0.3)
}

export function getLevelFromXP(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) return LEVELS[i]
  }
  return LEVELS[0]
}

export function getProgressInLevel(xp) {
  const level = getLevelFromXP(xp)
  if (level.maxXP === Infinity) return 100
  const progress = xp - level.minXP
  const range = level.maxXP - level.minXP
  return Math.min(100, Math.round((progress / range) * 100))
}

export async function awardXP(userId, amount, gameType, extraData = {}) {
  const { data: profile } = await supabase
    .from('profiles')
    .select('xp, level, streak, last_activity')
    .eq('id', userId)
    .single()

  if (!profile) return null

  const today = new Date().toISOString().split('T')[0]
  const lastActivity = profile.last_activity
  const isNewDay = lastActivity !== today
  const isConsecutive = lastActivity === getPreviousDay(today)

  const newStreak = isNewDay ? (isConsecutive ? profile.streak + 1 : 1) : profile.streak
  const newXP = profile.xp + amount
  const oldLevel = getLevelFromXP(profile.xp)
  const newLevel = getLevelFromXP(newXP)
  const leveledUp = newLevel.code !== oldLevel.code

  await supabase.from('profiles').update({
    xp: newXP,
    level: newLevel.code,
    streak: newStreak,
    last_activity: today,
  }).eq('id', userId)

  await supabase.from('sessions').insert({
    user_id: userId,
    game_type: gameType,
    xp_earned: amount,
    ...extraData,
  })

  await checkAchievements(userId, { xp: newXP, streak: newStreak, level: newLevel.code, gameType, ...extraData })

  return { newXP, newLevel, leveledUp, newStreak }
}

function getPreviousDay(dateStr) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

async function checkAchievements(userId, context) {
  const { data: existing } = await supabase
    .from('achievements')
    .select('achievement_type')
    .eq('user_id', userId)

  const earned = new Set((existing || []).map(a => a.achievement_type))
  const toInsert = []

  for (const ach of ACHIEVEMENTS) {
    if (earned.has(ach.id)) continue
    if (ach.streak_required && context.streak >= ach.streak_required) toInsert.push(ach.id)
    if (ach.level_required && context.level === ach.level_required) toInsert.push(ach.id)
    if (ach.xp_required && context.xp >= ach.xp_required) toInsert.push(ach.id)
    if (ach.id === 'first_conversation' && context.gameType === 'conversation') toInsert.push(ach.id)
  }

  if (toInsert.length > 0) {
    await supabase.from('achievements').insert(
      toInsert.map(type => ({ user_id: userId, achievement_type: type }))
    )
  }

  return toInsert
}
