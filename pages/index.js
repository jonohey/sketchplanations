import dynamic from 'next/dynamic'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import styles from './index.module.css'

import LoadingIndicator from 'components/LoadingIndicator'
// import SearchForm from 'components/SearchForm'
// import SketchplanationsGrid from 'components/SketchplanationsGrid'
// import Tags from 'components/Tags'
// import { isBlank } from 'helpers'
// import useSearch from 'hooks/useSearch'
import { client } from 'services/prismic'

const Sketchplanation = dynamic(() => import('../components/Sketchplanation'))

const Home = ({ sketchplanations: initialSketchplanations }) => {
  const [page, setPage] = useState(3) // 3 because we already have 8 sketchplanations
  const [hasMore, setHasMore] = useState(true)
  const [sketchplanations, setSketchplanations] = useState(initialSketchplanations)

  // const { query, setQuery, reset, results, tagResults, busy } = useSearch()

  const fetchMore = async () => {
    const moreSketchplanations = (
      await client.getByType('sketchplanation', {
        orderings: [
          {
            field: 'my.sketchplanation.published_at',
            direction: 'desc',
          },
        ],
        page,
        pageSize: 4,
      })
    ).results

    const nextSketchplanations = [...sketchplanations, ...moreSketchplanations]
    const nextPage = page + 1

    setSketchplanations(nextSketchplanations)
    setPage(nextPage)

    sessionStorage.setItem('sketchplanations', JSON.stringify(nextSketchplanations))
    sessionStorage.setItem('page', JSON.stringify(nextPage))
    if (page === moreSketchplanations.total_pages) setHasMore(false)
  }

  const manualScrollRestoration = typeof window !== 'undefined' && 'scrollRestoration' in window.history

  useEffect(() => {
    if (!manualScrollRestoration) return

    window.history.scrollRestoration = 'manual'

    return () => {
      if (!manualScrollRestoration) return

      window.history.scrollRestoration = 'auto'
    }
  }, [])

  const router = useRouter()

  useEffect(() => {
    const savedSketchplanations = JSON.parse(sessionStorage.getItem('sketchplanations'))
    const savedPage = JSON.parse(sessionStorage.getItem('page'))

    if (savedSketchplanations && savedPage) {
      setSketchplanations(savedSketchplanations)
      setPage(savedPage)
    }

    const handleRouteChangeComplete = (url) => {
      if (url !== '/') return

      const savedScrollY = JSON.parse(sessionStorage.getItem('scrollY'))
      if (!savedScrollY) return

      window.scrollTo(0, savedScrollY)
      sessionStorage.removeItem('scrollY')
    }

    router.events.on('routeChangeComplete', handleRouteChangeComplete)

    const handleRouteChangeStart = (url) => {
      if (url === '/') return

      sessionStorage.setItem('scrollY', JSON.stringify(window.scrollY))
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)

    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
    }
  }, [])

  return (
    <>
      <Head>
        <meta
          name='description'
          content='Explaining the world one sketch at a time — each sketch explains an idea or concept. Explore, search and share. Start here.'
        />
      </Head>
      <div className={styles.masthead}>
        <p className={styles.slogan}>Explaining the world one sketch at a time</p>
      </div>
      {/* <SearchForm isBusy={busy} value={query} onChange={setQuery} onReset={reset} /> */}
      <InfiniteScroll
        dataLength={sketchplanations.length}
        next={fetchMore}
        hasMore={hasMore}
        loader={
          <div className={styles.loading}>
            Loading more… <LoadingIndicator />
          </div>
        }
      >
        <div className={styles.sketchplanations}>
          {sketchplanations.map((sketchplanation, index) => (
            <Sketchplanation key={sketchplanation.uid} sketchplanation={sketchplanation} priority={index === 0} />
          ))}
        </div>
      </InfiniteScroll>
      {/* {tagResults && <Tags tags={tagResults} />} */}
      {/* {results && <SketchplanationsGrid prismicDocs={results} />} */}
    </>
  )
}

export const getStaticProps = async () => {
  const sketchplanations = (
    await client.getByType('sketchplanation', {
      orderings: [
        {
          field: 'my.sketchplanation.published_at',
          direction: 'desc',
        },
      ],
      pageSize: 8,
    })
  ).results

  return { props: { sketchplanations } }
}

export default Home
