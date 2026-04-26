import { useState, useEffect } from 'react'

const BASE = 'https://pokeapi.co/api/v2'

export function usePokemonList(offset, limit = 20) {
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(`${BASE}/pokemon?limit=${limit}&offset=${offset}`)
      .then(r => r.json())
      .then(async json => {
        if (cancelled) return
        setTotal(json.count)
        const details = await Promise.all(
          json.results.map(p => fetch(p.url).then(r => r.json()))
        )
        if (!cancelled) setData(prev => (offset === 0 ? details : [...prev, ...details]))
      })
      .catch(e => { if (!cancelled) setError(e.message) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [offset, limit])

  return { data, total, loading, error }
}

export function usePokemonSearch(query) {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!query) { setResult(null); return }
    let cancelled = false
    setLoading(true)
    setError(null)

    fetch(`${BASE}/pokemon/${query}`)
      .then(r => {
        if (!r.ok) throw new Error('見つかりませんでした')
        return r.json()
      })
      .then(d => { if (!cancelled) setResult(d) })
      .catch(e => { if (!cancelled) setError(e.message) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [query])

  return { result, loading, error }
}

export function usePokemonDetail(id) {
  const [pokemon, setPokemon] = useState(null)
  const [species, setSpecies] = useState(null)
  const [evolution, setEvolution] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    setLoading(true)
    setError(null)
    setPokemon(null)
    setSpecies(null)
    setEvolution(null)

    Promise.all([
      fetch(`${BASE}/pokemon/${id}`).then(r => r.json()),
      fetch(`${BASE}/pokemon-species/${id}`).then(r => r.json()),
    ])
      .then(async ([poke, spec]) => {
        if (cancelled) return
        setPokemon(poke)
        setSpecies(spec)
        const evoRes = await fetch(spec.evolution_chain.url)
        const evoData = await evoRes.json()
        if (!cancelled) setEvolution(flattenEvolution(evoData.chain))
      })
      .catch(e => { if (!cancelled) setError(e.message) })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [id])

  return { pokemon, species, evolution, loading, error }
}

function flattenEvolution(chain) {
  const result = []
  let current = chain
  while (current) {
    result.push(current.species.name)
    current = current.evolves_to?.[0] ?? null
  }
  return result
}
