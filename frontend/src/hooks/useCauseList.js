import { useState, useRef } from 'react'

export function useCauseList() {
  const [causeList, setCauseList] = useState(null)
  const [downloadId, setDownloadId] = useState(null)
  const [loading, setLoading] = useState(false)
  const controllerRef = useRef(null)

  const clearCauseList = () => {
    setCauseList(null)
    setDownloadId(null)
  }

  const removeAdvocateCases = async (advoCode) => {
    setCauseList((prev) => {
      if (!prev) return null
      const filtered = prev.filter((item) => item.advoCode !== advoCode)
      if (!filtered.length) return null

      fetch('/api/causelist/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ causelist: filtered }),
      })
        .then((res) => res.json())
        .then((data) => setDownloadId(data.id))
        .catch(console.error)

      return filtered
    })
  }

  const fetchCauseList = async (date, selectedAdvocates) => {
    const advocates = Array.from(selectedAdvocates, ([key, value]) => ({
      name: value.label,
      advoCode: key,
    }))

    if (controllerRef.current) controllerRef.current.abort()
    controllerRef.current = new AbortController()

    setLoading(true)
    try {
      const res = await fetch('/api/causelist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ advocates, date }),
        signal: controllerRef.current.signal,
      })

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.message ?? `HTTP error! status: ${res.status}`)
      }

      const data = await res.json()
      if (!data.response.causelist?.length) throw new Error('No cases found in cause list')

      setCauseList(data.response.causelist)
      setDownloadId(data.id)
      return data
    } catch (err) {
      if (err.name === 'AbortError') return
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { causeList, downloadId, loading, fetchCauseList, clearCauseList, removeAdvocateCases }
}
