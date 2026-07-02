export default function PinHintModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-stone-900/20 backdrop-blur-[2px] z-[100]"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-[#fffdf6] border-4 border-[#d8cdb5] rounded-xl shadow-2xl shadow-stone-200/50 ring-1 ring-black/5 p-8 max-w-sm w-[90%] flex flex-col items-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-500 hover:text-stone-900 text-lg font-bold cursor-pointer p-2 leading-none"
        >✕</button>

        <span className="text-4xl mb-3">📌</span>
        <h2 className="text-[11px] uppercase tracking-[0.2em] font-black text-[#8b6f47] mb-2">Pin Your Advocates</h2>
        <p className="text-stone-700 text-sm leading-relaxed text-center mb-5">
          Search for your advocates and tap <strong>☆</strong> to pin them. Pinned advocates load automatically every time you open the app.
        </p>

        {/* Visual demo */}
        <div className="w-full bg-[#f4ecd8] rounded-lg px-4 py-3 mb-5 flex flex-wrap gap-2">
          <div className="flex items-center gap-1 px-3 py-1 bg-[#f4ecd8] border border-[#c9b79c] rounded-full text-xs text-[#5a4a33]">
            <span className="font-medium">Advocate Name</span>
            <span className="text-[#8b6f47]">☆</span>
            <span>×</span>
          </div>
          <span className="text-[11px] text-[#8b6f47] self-center">→ tap ☆ to pin</span>
          <div className="flex items-center gap-1 px-3 py-1 bg-[#3b2f2a] border border-[#3b2f2a] rounded-full text-xs text-[#e8dccf]">
            <span className="text-[10px]">📌</span>
            <span className="font-medium">Advocate Name</span>
            <span>★</span>
            <span>×</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl text-white bg-[#8b6f47] hover:bg-[#7a5f3d] transition font-semibold cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  )
}
