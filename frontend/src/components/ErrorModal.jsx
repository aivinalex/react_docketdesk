const typeStyles = {
  error: { border: 'border-red-200/50', text: 'text-red-600' },
  success: { border: 'border-emerald-200/50', text: 'text-emerald-700' },
  warning: { border: 'border-amber-200/50', text: 'text-amber-700' },
}

export default function ErrorModal({ message, messageType, title, onClose }) {
  const style = typeStyles[messageType] ?? typeStyles.warning

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-stone-900/10 backdrop-blur-[2px] z-[100]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className={`bg-[#fffdf6] border-4 ${style.border} rounded-xl shadow-2xl shadow-stone-200/50 ring-1 ring-black/5 p-8 max-w-sm w-[90%] flex flex-col items-center relative`}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-[110] text-stone-500 hover:text-stone-900 text-lg font-bold cursor-pointer p-2 leading-none"
        >✕</button>
        <h2 className={`text-[10px] uppercase tracking-[0.2em] font-black mb-4 ${style.text}`}>
          {title || messageType?.toUpperCase()}
        </h2>
        <p className="text-stone-800 text-sm leading-relaxed text-center font-medium">{message}</p>
      </div>
    </div>
  )
}
