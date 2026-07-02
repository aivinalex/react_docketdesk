import { useState, useRef, useCallback } from 'react'

export function useAdvocateSearch(initialAdvocates = new Map()) {
  const [suggestions, setSuggestions] = useState([])
  const [selectedAdvocates, setSelectedAdvocates] = useState(initialAdvocates)
  const cacheRef = useRef(new Map())
  const controllerRef = useRef(null)

  const search = useCallback(async (advocateName) => {
    if (controllerRef.current) controllerRef.current.abort()
    controllerRef.current = new AbortController()
    try {
      const params = new URLSearchParams({ name: advocateName })
      const res = await fetch(`/api/advocates?${params}`, { signal: controllerRef.current.signal })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      cacheRef.current.clear()
      data.results.forEach((el) => cacheRef.current.set(el.keyval, el))
      setSuggestions(data.results)
    } catch (err) {
      if (err.name === 'AbortError') return
      setSuggestions([{ keyval: null, label: err.toString().split(':')[1]?.trim() ?? 'Error' }])
    }
  }, [])

  const clearSuggestions = useCallback(() => {
    setSuggestions([])
    cacheRef.current.clear()
  }, [])

  const selectAdvocate = useCallback((keyval) => {
    const data = cacheRef.current.get(keyval)
    if (!data) return
    setSelectedAdvocates((prev) => {
      if (prev.has(keyval)) return prev
      const next = new Map(prev)
      next.set(keyval, data)
      return next
    })
    clearSuggestions()
  }, [clearSuggestions])

  const removeAdvocate = useCallback((keyval, onRemoved) => {
    setSelectedAdvocates((prev) => {
      const next = new Map(prev)
      next.delete(keyval)
      return next
    })
    if (onRemoved) onRemoved(keyval)
  }, [])

  return { suggestions, selectedAdvocates, search, clearSuggestions, selectAdvocate, removeAdvocate }
}
