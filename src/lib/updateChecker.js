const CURRENT = import.meta.env.PROD ? String(__BUILD_TIME__) : null

export function checkVersionOnLoad() {
  if (!CURRENT) return false
  const stored = localStorage.getItem('app_version')
  localStorage.setItem('app_version', CURRENT)
  return !!stored && stored !== CURRENT
}
