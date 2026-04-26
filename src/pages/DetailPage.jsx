import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { usePokemonDetail } from '../hooks/usePokemon'
import TypeBadge from '../components/TypeBadge'
import StatBar from '../components/StatBar'

export default function DetailPage() {
  const { id } = useParams()
  const { pokemon, species, evolution, loading, error } = usePokemonDetail(id)

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !pokemon) {
    return (
      <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center gap-4 text-gray-500">
        <p className="text-5xl">?</p>
        <p>読み込みに失敗しました</p>
        <Link to="/" className="text-blue-500 underline text-sm">一覧に戻る</Link>
      </div>
    )
  }

  const image =
    pokemon.sprites?.other?.['official-artwork']?.front_default ??
    pokemon.sprites?.front_default

  const jaName = species?.names?.find(n => n.language.name === 'ja-Hrkt')?.name
    ?? species?.names?.find(n => n.language.name === 'ja')?.name

  const flavorText = species?.flavor_text_entries
    ?.filter(e => e.language.name === 'ja')
    ?.at(-1)?.flavor_text?.replace(/\f/g, ' ')

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-red-500 text-white px-6 py-4 shadow-md">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Link to="/" className="text-white hover:opacity-80 transition-opacity">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-xl font-bold capitalize">{jaName ?? pokemon.name}</h1>
          <span className="ml-auto text-red-200 font-mono">#{String(pokemon.id).padStart(3, '0')}</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 grid gap-6">
        {/* 基本情報カード */}
        <div className="bg-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row gap-6 items-center">
          {image && (
            <img src={image} alt={pokemon.name} className="w-40 h-40 object-contain" />
          )}
          <div className="flex-1 space-y-3">
            <h2 className="text-2xl font-bold text-gray-800">
              {jaName ?? pokemon.name}
              {jaName && <span className="text-sm text-gray-400 ml-2 lowercase capitalize">({pokemon.name})</span>}
            </h2>
            <div className="flex gap-2 flex-wrap">
              {pokemon.types.map(t => (
                <TypeBadge key={t.type.name} type={t.type.name} />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <span>高さ: {(pokemon.height / 10).toFixed(1)} m</span>
              <span>重さ: {(pokemon.weight / 10).toFixed(1)} kg</span>
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium">特性: </span>
              {pokemon.abilities.map(a => (
                <span key={a.ability.name} className={`mr-2 capitalize ${a.is_hidden ? 'text-purple-500' : ''}`}>
                  {a.ability.name}{a.is_hidden && ' ★'}
                </span>
              ))}
            </div>
            {flavorText && (
              <p className="text-sm text-gray-500 italic">{flavorText}</p>
            )}
          </div>
        </div>

        {/* ステータス */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-4">基本ステータス</h3>
          <div className="space-y-3">
            {pokemon.stats.map(s => (
              <StatBar key={s.stat.name} name={s.stat.name} value={s.base_stat} />
            ))}
          </div>
        </div>

        {/* 進化チェーン */}
        {evolution && evolution.length > 1 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-gray-700 mb-4">進化チェーン</h3>
            <div className="flex items-center gap-2 flex-wrap">
              {evolution.map((name, i) => (
                <div key={name} className="flex items-center gap-2">
                  {i > 0 && <span className="text-gray-400 text-xl">→</span>}
                  <EvolutionChip name={name} currentName={pokemon.name} />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function EvolutionChip({ name, currentName }) {
  const [pokeId, setPokeId] = useState(null)

  useEffect(() => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
      .then(r => r.json())
      .then(d => setPokeId(d.id))
      .catch(() => {})
  }, [name])

  const isCurrent = name === currentName

  return (
    <Link
      to={pokeId ? `/pokemon/${pokeId}` : '#'}
      className={`px-3 py-1 rounded-xl text-sm capitalize font-medium transition-colors ${
        isCurrent
          ? 'bg-red-100 text-red-600 cursor-default pointer-events-none'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      {name}
    </Link>
  )
}
