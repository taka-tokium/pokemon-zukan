const STAT_LABELS = {
  hp: 'HP',
  attack: '攻撃',
  defense: '防御',
  'special-attack': '特攻',
  'special-defense': '特防',
  speed: '素早さ',
}

const STAT_COLORS = {
  hp: 'bg-green-500',
  attack: 'bg-red-500',
  defense: 'bg-blue-500',
  'special-attack': 'bg-purple-500',
  'special-defense': 'bg-cyan-500',
  speed: 'bg-yellow-500',
}

export default function StatBar({ name, value }) {
  const label = STAT_LABELS[name] ?? name
  const color = STAT_COLORS[name] ?? 'bg-gray-500'
  const pct = Math.min((value / 255) * 100, 100)

  return (
    <div className="flex items-center gap-3">
      <span className="w-14 text-xs text-gray-500 text-right shrink-0">{label}</span>
      <span className="w-8 text-sm font-semibold text-gray-700 shrink-0">{value}</span>
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
