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
  const { query: queryParams, pathname } = router
  const query = queryParams?.q
  const isSearchPage = pathname === '/search'

  const [originalRoute, setOriginalRoute] = useState(null)
  const [initialResults, setInitialResults] = useState(null)
  const [results, setResults] = useState(null)
  const [tagResults, setTagResults] = useState(null)
  const [busy, setBusy] = useState(false)

  const prevSearchQuery = useRef(null)
  const debouncedSearchQuery = useDebouncedValue(query, 500)

  useEffect(() => {
    fetchIntialResults().then(setInitialResults)
  }, [])

  const setQuery = (query) => {
    console.log('setQuery', query)

    if (isBlank(originalRoute)) {
      setOriginalRoute({ pathname, queryParams })
    }

    if (isSearchPage) {
      const stringifiedQuery = new URLSearchParams({ q: query }).toString()

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
    } else {
      router.push(
        {
          pathname: isSearchPage ? pathname : '/search',
          query: { ...queryParams, q: query },
        },
        undefined,
        {
          shallow: true,
        }
      )
    }
  }

  const clear = () => {
    console.log('clear')

    router.replace(
      {
        pathname,
        query: { ...queryParams, q: undefined },
      },
      `/search`,
      {
        shallow: true,
      }
    )
  }

  const reset = () => {
    console.log('reset')

    if (isBlank(originalRoute)) {
      return undefined
    }

    router.replace(
      {
        pathname: originalRoute?.pathname,
        query: originalRoute?.queryParams,
      },
      originalRoute?.pathname,
      {
        shallow: true,
      }
    )

    setOriginalRoute(null)
  }

  // useEffect(() => {
  //   if (!isReady) return undefined

  //   setQuery(queryParams?.q.trim())
  // }, [isReady, queryParams])

  // useEffect(() => {
  //   if (!isReady) return undefined

  //   if (query && query !== queryParams?.q) {
  //     const stringifiedQuery = new URLSearchParams({ q: query }).toString()

  //     router.replace(
  //       {
  //         pathname,
  //         query: { ...queryParams, q: query },
  //       },
  //       `/search?${stringifiedQuery}`,
  //       {
  //         shallow: true,
  //       }
  //     )
  //   } else {
  //     console.log('fuck you')
  //     router.replace(
  //       {
  //         pathname,
  //         query: { ...queryParams, q: undefined },
  //       },
  //       pathname,
  //       {
  //         shallow: true,
  //       }
  //     )
  //   }
  // }, [query])

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
    clear,
    isSearchPage,
  }
}

export default useSearch
