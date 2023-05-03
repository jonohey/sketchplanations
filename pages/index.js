import dynamic from 'next/dynamic'
import Head from 'next/head'
import React, { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import LoadingIndicator from 'components/LoadingIndicator'
import SearchForm from 'components/SearchForm'
import SketchplanationsGrid from 'components/SketchplanationsGrid'
import Tags from 'components/Tags'
import { isBlank } from 'helpers'
import useSearch from 'hooks/useSearch'
import { client } from 'services/prismic'

import styles from './index.module.css'

const Sketchplanation = dynamic(() => import('../components/Sketchplanation'))

const Home = ({ sketchplanations: initialSketchplanations }) => {
  const [page, setPage] = useState(2)
  const [hasMore, setHasMore] = useState(true)
  const [sketchplanations, setSketchplanations] = useState(initialSketchplanations)

  const { query, setQuery, reset, results, tagResults, busy } = useSearch()

  const fetchMore = async () => {
    const moreSketchplanations = (
      await client.getByType('sketchplanation', {
        orderings: {
          field: 'my.sketchplanation.published_at',
          direction: 'desc',
        },
        page,
        pageSize: 4,
      })
    ).results
    setSketchplanations([...sketchplanations, ...moreSketchplanations])
    setPage(page + 1)
    if (page === moreSketchplanations.total_pages) setHasMore(false)
  }

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
      <SearchForm isBusy={busy} value={query} onChange={setQuery} onReset={reset} />
      {isBlank(query) && (
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
      )}
      {tagResults && <Tags tags={tagResults} />}
      {results && <SketchplanationsGrid prismicDocs={results} />}
    </>
  )
}

Home.getInitialProps = async () => {
  const sketchplanations = (
    await client.getByType('sketchplanation', {
      orderings: {
        field: 'my.sketchplanation.published_at',
        direction: 'desc',
      },
      pageSize: 4,
    })
  ).results

  return { sketchplanations }
}

export default Home
