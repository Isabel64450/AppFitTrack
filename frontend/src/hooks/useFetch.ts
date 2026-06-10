import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'

interface UseFetchResult<T> {
  data:    T | null
  loading: boolean
  error:   string | null
  refetch: () => void
}

export function useFetch<T>(url: string): UseFetchResult<T> {
  const [data,    setData]    = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState<string | null>(null)

  const fetchData = useCallback(() => {
    setLoading(true)
    setError(null)
    api.get<T>(url)
      .then((res: { data: T }) => setData(res.data))
      .catch(() => setError('Impossible de charger les données'))
      .finally(() => setLoading(false))
  }, [url])
  // useCallback : fetchData ne change de référence QUE si url change
  // Évite une boucle infinie dans useEffect

  useEffect(() => {
    fetchData()
  }, [fetchData])
  // fetchData comme dépendance : se relance si l'URL change

  return { data, loading, error, refetch: fetchData }
  // refetch() permet de relancer manuellement (ex: après une modification)
}

