import { useState, useCallback } from 'react'

const KEY = 'pinnedAdvocates'

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? new Map(JSON.parse(raw)) : new Map()
  } catch { return new Map() }
}

function save(map) {
  try {
    localStorage.setItem(KEY, JSON.stringify([...map]))
  } catch {}
}

export function usePinnedAdvocates() {
  const [pinned, setPinned] = useState(load)

  const pin = useCallback((advocate) => {
    setPinned((prev) => {
      const next = new Map(prev)
      next.set(advocate.keyval, advocate)
      save(next)
      return next
    })
  }, [])

  const unpin = useCallback((keyval) => {
    setPinned((prev) => {
      const next = new Map(prev)
      next.delete(keyval)
      save(next)
      return next
    })
  }, [])

  return { pinned, pin, unpin }
}
