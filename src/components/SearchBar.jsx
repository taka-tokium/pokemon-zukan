import { useState } from 'react'

export default function SearchBar({ onSearch }) {
  const [value, setValue] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const q = value.trim().toLowerCase()
    if (q) onSearch(q)
  }

  function handleClear() {
    setValue('')
    onSearch(null)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md">
      <div className="relative flex-1">
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          placeholder="名前 or 図鑑番号で検索..."
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-sm"
        />
        <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors"
      >
        検索
      </button>
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="px-3 py-2 bg-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-300 transition-colors"
        >
          クリア
        </button>
      )}
    </form>
  )
}
