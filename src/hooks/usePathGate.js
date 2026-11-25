import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import { getPathForLang, getCompletedStepIds, getCurrentStepIndex } from '../lib/path'

// Gates a screen behind the learning path: given a matcher that picks out
// this screen's step in the curriculum, returns whether it's still locked
// (an earlier step hasn't been completed yet). Screens with no matching
// step (English, or content outside the curriculum) are never locked.
export function usePathGate(matcher) {
  const { profile } = useAuth()
  const { lang } = useLanguage()
  const [state, setState] = useState({ loading: true, locked: false })

  useEffect(() => {
    let cancelled = false
    const path = getPathForLang(lang)
    const step = path.find(matcher)
    if (!step || !profile) { setState({ loading: false, locked: false }); return }

    setState(s => ({ ...s, loading: true }))
    getCompletedStepIds(profile.id, lang).then(completed => {
      if (cancelled) return
      const currentIdx = getCurrentStepIndex(path, completed)
      setState({ loading: false, locked: path.indexOf(step) > currentIdx })
    })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, profile?.id])

  return state
}
