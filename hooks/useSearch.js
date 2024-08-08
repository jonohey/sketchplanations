import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'

import { isBlank, isPresent } from 'helpers'
import { searchSketchplanations, searchTags } from 'helpers'

import useDebouncedValue from './useDebouncedValue'

const fetchIntialResults = async () => {
  const response = await fetch('/api/initial-search-results')
  const results = await response.json()

  return results
}

const useSearch = () => {
  const router = useRouter()
  const { query: queryParams, pathname, isReady } = router
  const isSearchPage = pathname === '/search'

  const [query, setQuery] = useState(queryParams?.q || '')
  const [initialResults, setInitialResults] = useState(null)
  const [results, setResults] = useState(null)
  const [tagResults, setTagResults] = useState(null)
  const [busy, setBusy] = useState(false)

  const prevSearchQuery = useRef(null)
  const debouncedSearchQuery = useDebouncedValue(query, 500)

  useEffect(() => {
    fetchIntialResults().then(setInitialResults)
  }, [])

  const reset = () => {
    setQuery('')
  }

  useEffect(() => {
    if (!isReady) return undefined

    setQuery(queryParams?.q?.trim() || '')
  }, [isReady, queryParams])

  useEffect(() => {
    if (!isReady) return undefined

    if (query.trim() === '') {
      router.replace(
        {
          pathname,
          query: { ...queryParams, q: undefined },
        },
        pathname,
        {
          shallow: true,
        }
      )
    } else if (query !== queryParams?.q) {
      const stringifiedQuery = new URLSearchParams({ q: query.trim() }).toString()

      router.replace(
        {
          pathname,
          query: { ...queryParams, q: query },
        },
        `/search?${stringifiedQuery}`,
        {
          shallow: true,
        }
      )
    }
  }, [query])

  useEffect(() => {
    console.log('useSearch', prevSearchQuery.current, debouncedSearchQuery)

    if (prevSearchQuery.current === debouncedSearchQuery && isPresent(results)) {
      return undefined
    }

    if (isBlank(debouncedSearchQuery)) {
      setResults(null)
      setTagResults(null)

      return undefined
    }

    const search = async () => {
      setBusy(true)

      try {
        const [sketchplanationResults, tagResults] = await Promise.all([
          searchSketchplanations(debouncedSearchQuery),
          searchTags(debouncedSearchQuery),
        ])

        setResults(sketchplanationResults)
        setTagResults(tagResults)
      } catch (error) {
        console.error(error)
      } finally {
        setBusy(false)
      }
    }

    prevSearchQuery.current = debouncedSearchQuery

    search()
  }, [debouncedSearchQuery])

  const called = isPresent(debouncedSearchQuery)

  return {
    query,
    setQuery,
    initialResults,
    results,
    tagResults,
    called,
    busy,
    reset,
    isSearchPage,
  }
}

export default useSearch
