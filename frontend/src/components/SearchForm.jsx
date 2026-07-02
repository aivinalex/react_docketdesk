import { useState, useEffect, useRef } from 'react'
import { useAdvocateSearch } from '../hooks/useAdvocateSearch'

function debounce(fn, delay) {
  let timer
  const debounced = (...args) => { clearTimeout(timer); timer = setTimeout(() => fn(...args), delay) }
  debounced.cancel = () => clearTimeout(timer)
  return debounced
}

export default function SearchForm({ onSearch, onAdvocateRemoved, onAdvocateAdded, pinned, onPin, onUnpin }) {
  const [inputValue, setInputValue] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [nameError, setNameError] = useState(false)
  const [dateError, setDateError] = useState(false)
  const { suggestions, selectedAdvocates, search, clearSuggestions, selectAdvocate, removeAdvocate } = useAdvocateSearch(pinned)
  const debouncedSearch = useRef(debounce(search, 500))
  const inputRef = useRef(null)
  const suggestionsRef = useRef(null)

  useEffect(() => {
    debouncedSearch.current = debounce(search, 500)
  }, [search])

  const handleInput = (e) => {
    const val = e.target.value
    setInputValue(val)
    const trimmed = val.trim().toLowerCase()
    if (!trimmed || trimmed.length < 4) {
      debouncedSearch.current.cancel()
      clearSuggestions()
      return
    }
    debouncedSearch.current(trimmed)
  }

  useEffect(() => {
    const handler = (e) => {
      if (!inputRef.current?.contains(e.target) && !suggestionsRef.current?.contains(e.target)) {
        clearSuggestions()
      }
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [clearSuggestions])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') { e.preventDefault(); handleSearch() }
  }

  const handleSearch = () => {
    const isNameEmpty = selectedAdvocates.size === 0
    const isDateEmpty = !date
    setNameError(isNameEmpty)
    setDateError(isDateEmpty)
    if (isNameEmpty || isDateEmpty) return
    onSearch(date, selectedAdvocates)
  }

  const handleSelect = (keyval) => {
    if (keyval === null) return
    selectAdvocate(keyval)
    setInputValue('')
    onAdvocateAdded?.()
  }

  const handleUnpin = (adv) => {
    onUnpin(adv.keyval)
  }

  return (
    <section id="search-section" className="max-w-4xl mx-auto px-8">
      <form
        id="search-form"
        className="flex flex-col sm:flex-row flex-wrap gap-4 items-stretch sm:items-start px-6 sm:px-12 py-8 sm:py-12 bg-[#fffdf6] border border-[#d8cdb5] rounded-2xl"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* Advocate search */}
        <div className="flex-1 min-w-full md:min-w-55">
          <div className="relative">
            <input
              ref={inputRef}
              id="adv-search-input"
              type="text"
              placeholder="Search Advocate"
              value={inputValue}
              onChange={handleInput}
              onFocus={() => setNameError(false)}
              onKeyDown={handleKeyDown}
              className={`w-full px-6 py-4 text-lg bg-white border rounded-xl placeholder:text-[#9a8f7a] focus:outline-none transition-all ${nameError ? 'ring-4 ring-red-500/30 border-red-500' : 'border-[#c9b79c]'}`}
            />
            {suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                id="advocateSuggestions"
                className="absolute w-full max-h-60 overflow-y-auto left-0 top-full bg-[#fffdf6] rounded-b-xl shadow-lg z-50"
              >
                {suggestions.map((s) => (
                  <div
                    key={s.keyval ?? s.label}
                    className="px-6 py-3 text-sm cursor-pointer hover:bg-[#f4ecd8]"
                    onClick={() => handleSelect(s.keyval)}
                  >
                    {s.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          {nameError && <p className="text-red-600 text-xs mt-2 ml-2 font-medium">Please select at least one advocate</p>}
        </div>

        {/* Date */}
        <div className="flex flex-col w-full md:w-auto">
          <input
            id="adv-search-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            onFocus={() => setDateError(false)}
            onKeyDown={handleKeyDown}
            className={`w-full px-6 py-4 text-lg rounded-xl bg-white border text-[#5a4a33] focus:outline-none transition-all ${dateError ? 'ring-4 ring-red-500/30 border-red-500' : 'border-[#c9b79c]'}`}
          />
          {dateError && <p className="text-red-600 text-xs mt-2 ml-2 font-medium">Please select a date</p>}
        </div>

        <button
          id="adv-search-button"
          type="button"
          onClick={handleSearch}
          className="w-full md:w-auto px-8 py-4 text-lg rounded-xl text-white bg-[#8b6f47] hover:bg-[#7a5f3d] transition cursor-pointer"
        >
          Search
        </button>

        {/* Selected advocate pills */}
        <div id="selected-advocates-container" className="w-full flex flex-wrap gap-2 mt-2">
          {Array.from(selectedAdvocates.values()).map((adv) => {
            const isPinned = pinned?.has(adv.keyval)
            return (
              <div
                key={adv.keyval}
                className={`flex items-center gap-1 sm:gap-2 px-2 py-0.5 sm:px-3 sm:py-1 border rounded-full text-xs sm:text-sm shadow-sm ${
                  isPinned
                    ? 'bg-[#3b2f2a] border-[#3b2f2a] text-[#e8dccf]'
                    : 'bg-[#f4ecd8] border-[#c9b79c] text-[#5a4a33]'
                }`}
              >
                {isPinned && <span className="text-[10px]">📌</span>}
                <span className="font-medium">{adv.label}</span>
                <button
                  type="button"
                  title={isPinned ? 'Unpin advocate' : 'Pin advocate'}
                  className={`text-[11px] cursor-pointer transition-colors ${isPinned ? 'text-[#e8dccf] hover:text-red-300' : 'text-[#8b6f47] hover:text-[#3b2f2a]'}`}
                  onClick={() => isPinned ? handleUnpin(adv) : onPin(adv)}
                >
                  {isPinned ? '★' : '☆'}
                </button>
                <button
                  type="button"
                  className={`remove-pill-btn font-bold ml-0.5 cursor-pointer transition-colors ${isPinned ? 'text-[#e8dccf] hover:text-red-300' : 'hover:text-red-700'}`}
                  onClick={() => removeAdvocate(adv.keyval, (keyval) => onAdvocateRemoved(keyval, adv.label))}
                >×</button>
              </div>
            )
          })}
        </div>
      </form>
    </section>
  )
}
