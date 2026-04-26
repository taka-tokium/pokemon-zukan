import { useState } from 'react'
import SearchBar from '../components/SearchBar'
import PokemonCard from '../components/PokemonCard'
import { usePokemonList, usePokemonSearch } from '../hooks/usePokemon'

export default function ListPage() {
  const [offset, setOffset] = useState(0)
  const [searchQuery, setSearchQuery] = useState(null)

  const { data: listData, total, loading: listLoading } = usePokemonList(offset)
  const { result: searchResult, loading: searchLoading, error: searchError } = usePokemonSearch(searchQuery)

  const isSearching = searchQuery !== null
  const loading = isSearching ? searchLoading : listLoading

  function handleSearch(q) {
    setSearchQuery(q)
    if (!q) setOffset(0)
  }

  function handleLoadMore() {
    setOffset(prev => prev + 20)
  }

  const displayList = isSearching
    ? (searchResult ? [searchResult] : [])
    : listData

  return (
    <div className="min-h-screen bg-slate-100">
      {/* ヘッダー */}
      <header className="bg-red-500 text-white px-6 py-4 shadow-md">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-4">
          <h1 className="text-2xl font-bold tracking-tight">ポケモン図鑑</h1>
          <div className="flex-1 flex justify-center">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* 検索エラー */}
        {isSearching && searchError && (
          <div className="text-center py-16 text-gray-500">
            <p className="text-5xl mb-4">?</p>
            <p className="font-medium">「{searchQuery}」は見つかりませんでした</p>
          </div>
        )}

        {/* ローディング */}
        {loading && (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-red-400 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* グリッド */}
        {!loading && (
          <>
            {isSearching && searchResult && (
              <p className="text-sm text-gray-500 mb-4">「{searchQuery}」の検索結果</p>
            )}
            {!isSearching && (
              <p className="text-sm text-gray-500 mb-4">全 {total} 匹中 {listData.length} 匹表示中</p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {displayList.map(p => (
                <PokemonCard key={p.id} pokemon={p} />
              ))}
            </div>

            {/* もっと見る */}
            {!isSearching && listData.length < total && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={handleLoadMore}
                  disabled={listLoading}
                  className="px-8 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  もっと見る
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
