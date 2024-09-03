import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import styles from './SearchResults.module.css'

import { isPresent } from 'helpers'
import useSearch from 'hooks/useSearch'

import SketchplanationsGrid from './SketchplanationsGrid'
import Tags from './Tags'

const loadingMessages = [
  'Finding some spectacular sketches…',
  'Sketching up a storm…',
  'Searching the archives…',
  'Let me find that for you…',
  'Where did I put that sketch…',
]

const SearchResults = () => {
  const { initialResults, results, tagResults, called, busy } = useSearch()

  const [randomHandle, setRandomHandle] = useState(null)

  useEffect(() => {
    const fetchRandomHandle = async () => {
      try {
        const res = await fetch('/api/random')
        const { handle } = await res.json()
        setRandomHandle(handle)
      } catch (error) {
        console.error(error)
      }
    }

    fetchRandomHandle()
  }, [])

  // const header = isPresent(query) ? `All results for “${query}”` : 'Search'

  // if (!called) return null

  if (!called) {
    return (
      <div className={styles['search-results']}>
        <div className={styles.links}>
          <Link href='/tags' className={styles.link}>
            Tags
          </Link>
          <Link href='/archive' className={styles.link}>
            Archive
          </Link>
        </div>
        <SketchplanationsGrid prismicDocs={initialResults} />
      </div>
    )
  }

  const loadingMessage = useMemo(() => {
    // Get random loading message
    const index = Math.floor(Math.random() * loadingMessages.length)
    return loadingMessages[index]
  }, [busy])

  return (
    <div className={styles['search-results']}>
      {busy ? (
        <div className={styles['loading-indicator']}>
          <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
            <path d='M0 11c.511-6.158 5.685-11 12-11s11.489 4.842 12 11h-2.009c-.506-5.046-4.793-9-9.991-9s-9.485 3.954-9.991 9h-2.009zm21.991 2c-.506 5.046-4.793 9-9.991 9s-9.485-3.954-9.991-9h-2.009c.511 6.158 5.685 11 12 11s11.489-4.842 12-11h-2.009z' />
          </svg>
          {loadingMessage}
        </div>
      ) : (
        <>
          {/* <h1 className='text-lg px-6'>{header}</h1> */}
          {/* {isPresent(tagResults) && ( */}
          <div className={styles['search-results__tags']}>
            <Tags tags={tagResults} align='left' />
          </div>
          {/* )} */}
          {isPresent(results) ? (
            <div className={styles['search-results__sketches']}>
              <SketchplanationsGrid prismicDocs={results} />
            </div>
          ) : (
            <div className={styles['search-results__empty']}>
              <p>No sketches found</p>
              <Link href={`/${randomHandle}`} className={!randomHandle && 'invisible'}>
                Try something random
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default SearchResults
