import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import SearchForm from 'components/SearchForm'
import SketchplanationsGrid from 'components/SketchplanationsGrid'
import Tags from 'components/Tags'
import { isBlank, isPresent, searchSketchplanations, searchTags } from 'helpers'
import useDebouncedValue from 'hooks/useDebouncedValue'
import { client } from 'services/prismic'

import styles from './explore.module.css'

const Explore = ({ initialSketchplanations }) => {
  const router = useRouter()
  const { query, isReady } = router

  const [routerIsReady, setRouterIsReady] = useState(false)
  const [searchQuery, setSearchQuery] = useState(query?.q)
  const [sketchplanationResults, setSketchplanationResults] = useState(null)
  const [tagResults, setTagResults] = useState(null)
  const [isSearching, setIsSearching] = useState(false)

  const debouncedSearchQuery = useDebouncedValue(searchQuery, 500)

  useEffect(() => {
    setRouterIsReady(isReady)
  }, [isReady])

  useEffect(() => {
    if (!isReady) return undefined

    setIsSearching(isPresent(query?.q))
    setSearchQuery(query?.q || '')
  }, [isReady])

  useEffect(() => {
    if (!isReady) return undefined

    if (isBlank(debouncedSearchQuery)) {
      setSketchplanationResults(null)
      setTagResults(null)

      router.replace({
        pathname: '/explore',
      })

      return undefined
    }

    if (query.q !== debouncedSearchQuery)
      router.replace({
        pathname: '/explore',
        query: { q: encodeURI(debouncedSearchQuery) },
      })

    const search = async () => {
      setIsSearching(true)
      setSketchplanationResults(await searchSketchplanations(debouncedSearchQuery))
      setTagResults(await searchTags(debouncedSearchQuery))
      setIsSearching(false)
    }

    search()
  }, [debouncedSearchQuery])

  return (
    <div className={styles.root}>
      <SearchForm
        isBusy={isSearching}
        value={searchQuery}
        onChange={setSearchQuery}
        onReset={() => setSearchQuery('')}
      />
      <div className={styles.links}>
        <Link href='/api/random' className={styles.link}>
          Random
        </Link>
        <Link href='/tags' className={styles.link}>
          Explore by tag
        </Link>
        <Link href='/archive' className={styles.link}>
          Archive
        </Link>
      </div>
      {isPresent(tagResults) && <Tags tags={tagResults} />}
      <div className={styles.gallery}>
        {routerIsReady && !isSearching && (
          <SketchplanationsGrid prismicDocs={sketchplanationResults || initialSketchplanations} />
        )}
        {!isSearching && isBlank(sketchplanationResults) && <div className={styles.noSketches}>No sketches found</div>}
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const initialSketchplanations = await client.getAllByType('sketchplanation', {
    orderings: {
      field: 'my.sketchplanation.published_at',
      direction: 'desc',
    },
  })

  return { props: { initialSketchplanations: initialSketchplanations.slice(0, 20) } }
}

export default Explore
