import { useState, useEffect, useRef } from 'react'

const BASE = 'https://cmshck.keralacourts.in/pocketbase'

function loadCalledItems(date) {
  try {
    const raw = sessionStorage.getItem(`calledItems-${date}`)
    return raw ? new Set(JSON.parse(raw)) : new Set()
  } catch { return new Set() }
}

function saveCalledItems(date, set) {
  try {
    sessionStorage.setItem(`calledItems-${date}`, JSON.stringify([...set]))
  } catch {}
}

export function useCurrentItem(date) {
  const [currentItems, setCurrentItems] = useState({})
  const calledItems = useRef(new Set())
  const prevItems = useRef({})

  useEffect(() => {
    if (!date) return

    // restore from session on load
    calledItems.current = loadCalledItems(date)

    let es = null

    const handleUpdate = (prev, next) => {
      Object.keys(next).forEach((courtHall) => {
        const prevNo = Number(prev[courtHall])
        const nextNo = Number(next[courtHall])
        if (!prevNo || !nextNo || isNaN(prevNo) || isNaN(nextNo)) return
        calledItems.current.add(`${courtHall}-${prevNo}`)
        if (calledItems.current.has(`${courtHall}-${nextNo}`)) {
          calledItems.current.delete(`${courtHall}-${nextNo}`)
        }
        saveCalledItems(date, calledItems.current)
      })
    }

    fetch(`${BASE}/api/collections/display/records?page=1&perPage=1&filter=court_date%20%3D%22${date}%22`)
      .then((r) => r.json())
      .then((data) => {
        const record = data?.items?.[0]
        if (!record) return
        prevItems.current = record
        setCurrentItems(record)

        es = new EventSource(`${BASE}/api/realtime`)

        es.addEventListener('PB_CONNECT', (e) => {
          const { clientId } = JSON.parse(e.data)
          fetch(`${BASE}/api/realtime`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clientId, subscriptions: [`display/${record.id}`] }),
          }).catch(() => {})
        })

        es.addEventListener(`display/${record.id}`, (e) => {
          const { action, record: updated } = JSON.parse(e.data)
          if (action === 'update') {
            handleUpdate(prevItems.current, updated)
            prevItems.current = updated
            setCurrentItems(updated)
          }
        })

        es.onerror = () => es.close()
      })
      .catch(() => {})

    return () => {
      es?.close()
      prevItems.current = {}
    }
  }, [date])

  return { currentItems, calledItems: calledItems.current }
}
