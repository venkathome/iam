import { useState, useCallback } from 'react'

const STEPS = [0, 25, 50, 75, 100]

export function useTherapyProgress(profileId) {
  const storageKey = `therapy-progress-${profileId || 'default'}`

  const [data, setData] = useState(() => {
    try { return JSON.parse(localStorage.getItem(storageKey) || '{}') }
    catch { return {} }
  })

  const persist = useCallback((next) => {
    setData(next)
    try { localStorage.setItem(storageKey, JSON.stringify(next)) } catch {}
  }, [storageKey])

  const get = useCallback((key) => data[key] ?? 0, [data])

  const cycle = useCallback((key) => {
    const cur = data[key] ?? 0
    const idx = STEPS.indexOf(cur)
    const next = idx === -1 || idx === STEPS.length - 1 ? 0 : STEPS[idx + 1]
    persist({ ...data, [key]: next })
  }, [data, persist])

  const toggle = useCallback((key) => {
    persist({ ...data, [key]: (data[key] ?? 0) === 100 ? 0 : 100 })
  }, [data, persist])

  const stats = useCallback((keys) => {
    if (!keys.length) return { done: 0, total: 0, pct: 0 }
    const done = keys.filter(k => (data[k] ?? 0) === 100).length
    const pct  = Math.round(keys.reduce((s, k) => s + (data[k] ?? 0), 0) / keys.length)
    return { done, total: keys.length, pct }
  }, [data])

  return { get, cycle, toggle, stats }
}
