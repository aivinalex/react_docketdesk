import { useEffect, useState } from 'react'

export default function Toast({ message, onDone }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const show = setTimeout(() => setVisible(true), 10)
    const hide = setTimeout(() => setVisible(false), 2800)
    const done = setTimeout(onDone, 3200)
    return () => [show, hide, done].forEach(clearTimeout)
  }, [onDone])

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-400 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className="flex items-center gap-2 bg-[#3b2f2a] text-[#e8dccf] text-sm px-4 py-2.5 rounded-xl shadow-lg">
        <span className="text-amber-400">✕</span>
        {message}
      </div>
    </div>
  )
}
