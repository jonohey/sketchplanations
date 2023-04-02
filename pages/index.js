import dynamic from 'next/dynamic'
import InfiniteScroll from 'react-infinite-scroll-component'
import React, { useState } from 'react'

import { client } from 'services/prismic'

import styles from './index.module.css'

const Sketchplanation = dynamic(() => import('../components/Sketchplanation'))

const Home = ({ sketchplanations }) => {
  const [page, setPage] = useState(2)
  const [hasMore, setHasMore] = useState(true)
  const [results, setResults] = useState(sketchplanations.results)

  const fetchMore = async () => {
    const moreSketchplanations = await client.getByType('sketchplanation', {
      orderings: {
        field: 'my.sketchplanation.published_at',
        direction: 'desc',
      },
      page,
      pageSize: 4,
    })
    setResults([...results, ...moreSketchplanations.results])
    setPage(page + 1)
    if (page === moreSketchplanations.total_pages) setHasMore(false)
  }

  return (
    <div>
      <div className={styles.masthead}>
        <p className={styles.slogan}>Explaining the world one sketch at a time</p>
      </div>
      <InfiniteScroll
        dataLength={results.length}
        next={fetchMore}
        hasMore={hasMore}
        loader={
          <div className={styles.loading}>
            Loading more…{' '}
            <svg viewBox='0 0 38 38' xmlns='http://www.w3.org/2000/svg'>
              <g transform='translate(1 1)' strokeWidth='2' fill='none' fillRule='evenodd'>
                <path d='M36 18c0-9.94-8.06-18-18-18'>
                  <animateTransform
                    attributeName='transform'
                    type='rotate'
                    from='0 18 18'
                    to='360 18 18'
                    dur='1s'
                    repeatCount='indefinite'
                  />
                </path>
              </g>
            </svg>
          </div>
        }
      >
        <div className={styles.sketchplanations}>
          {results.map((sketchplanation) => (
            <Sketchplanation key={sketchplanation.uid} sketchplanation={sketchplanation} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  )
}

Home.getInitialProps = async () => {
  const sketchplanations = await client.getByType('sketchplanation', {
    orderings: {
      field: 'my.sketchplanation.published_at',
      direction: 'desc',
    },
    pageSize: 4,
  })

  return { sketchplanations }
}

export default Home
