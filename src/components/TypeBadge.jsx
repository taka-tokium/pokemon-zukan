const TYPE_COLORS = {
  normal: 'bg-gray-400 text-white',
  fire: 'bg-orange-500 text-white',
  water: 'bg-blue-500 text-white',
  electric: 'bg-yellow-400 text-gray-900',
  grass: 'bg-green-500 text-white',
  ice: 'bg-cyan-300 text-gray-900',
  fighting: 'bg-red-700 text-white',
  poison: 'bg-purple-500 text-white',
  ground: 'bg-yellow-600 text-white',
  flying: 'bg-indigo-300 text-gray-900',
  psychic: 'bg-pink-500 text-white',
  bug: 'bg-lime-500 text-white',
  rock: 'bg-yellow-700 text-white',
  ghost: 'bg-purple-800 text-white',
  dragon: 'bg-indigo-700 text-white',
  dark: 'bg-gray-800 text-white',
  steel: 'bg-gray-400 text-gray-900',
  fairy: 'bg-pink-300 text-gray-900',
}

export default function TypeBadge({ type }) {
  const color = TYPE_COLORS[type] ?? 'bg-gray-300 text-gray-900'
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${color}`}>
      {type}
    </span>
  )
}
