import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import { isBlank } from 'helpers'
import { searchSketchplanations, searchTags } from 'helpers'

import useDebouncedValue from './useDebouncedValue'

const useSearch = () => {
  const router = useRouter()
  const { query: queryParams, pathname, isReady } = router

  const [query, setQuery] = useState(queryParams?.q || '')
  const [results, setSketchplanationResults] = useState(null)
  const [tagResults, setTagResults] = useState(null)
  const [busy, setBusy] = useState(true)

  const debouncedSearchQuery = useDebouncedValue(query, 500)

  const reset = () => setQuery('')

  useEffect(() => {
    if (!isReady) return undefined

    setQuery(queryParams?.q || '')
  }, [isReady, queryParams])

  useEffect(() => {
    if (!isReady) return undefined

    if (query.trim() === '') {
      router.replace(
        {
          pathname,
        },
        undefined,
        {
          shallow: true,
        }
      )
    } else if (query !== queryParams?.q) {
      router.replace(
        {
          pathname,
          query: { q: query },
        },
        undefined,
        {
          shallow: true,
        }
      )
    }
  }, [query])

  useEffect(() => {
    setBusy(true)

    if (isBlank(debouncedSearchQuery)) {
      setSketchplanationResults(null)
      setTagResults(null)
      setBusy(false)

      return undefined
    }

    const search = async () => {
      setSketchplanationResults(await searchSketchplanations(debouncedSearchQuery))
      setTagResults(await searchTags(debouncedSearchQuery))
      setBusy(false)
    }

    search()
  }, [debouncedSearchQuery])

  return {
    query,
    setQuery,
    results,
    tagResults,
    busy,
    reset,
  }
}

export default useSearch
