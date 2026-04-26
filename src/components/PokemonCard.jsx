import { Link } from 'react-router-dom'
import TypeBadge from './TypeBadge'

export default function PokemonCard({ pokemon }) {
  const id = pokemon.id
  const image =
    pokemon.sprites?.other?.['official-artwork']?.front_default ??
    pokemon.sprites?.front_default

  return (
    <Link
      to={`/pokemon/${id}`}
      className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 cursor-pointer"
    >
      <span className="text-xs text-gray-400 self-end">#{String(id).padStart(3, '0')}</span>
      {image ? (
        <img src={image} alt={pokemon.name} className="w-24 h-24 object-contain" />
      ) : (
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 text-3xl">?</div>
      )}
      <p className="font-semibold text-gray-800 capitalize text-sm">{pokemon.name}</p>
      <div className="flex gap-1 flex-wrap justify-center">
        {pokemon.types.map(t => (
          <TypeBadge key={t.type.name} type={t.type.name} />
        ))}
      </div>
    </Link>
  )
}
