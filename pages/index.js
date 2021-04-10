import React, { useState } from 'react'
import Prismic from 'prismic-javascript'
import { client } from 'prismic-configuration'
import InfiniteScroll from 'react-infinite-scroll-component'
// import { Sketchplanation, Navigation } from 'components'
import dynamic from 'next/dynamic'

const Sketchplanation = dynamic(() => import('../components/Sketchplanation'))
const Navigation = dynamic(() => import('../components/Navigation'))

const Home = ({ sketchplanations }) => {
  const [page, setPage] = useState(2)
  const [hasMore, setHasMore] = useState(true)
  const [results, setResults] = useState(sketchplanations.results)

  const fetchMore = async () => {
    const moreSketchplanations = await client.query(Prismic.Predicates.at('document.type', 'sketchplanation'), {
      orderings: '[my.sketchplanation.published_at desc]',
      page,
      pageSize: 5,
    })
    setResults([...results, ...moreSketchplanations.results])
    setPage(page + 1)
    if (page === moreSketchplanations.total_pages) setHasMore(false)
  }

  return (
    <div>
      <div className='masthead'>
        <img src='/logo.svg' width='300' height='47' alt='Sketchplanations' />
        <p className='sm:text-lg'>Explaining one thing a week in a sketch</p>
        <Navigation />
      </div>
      <InfiniteScroll
        dataLength={results.length}
        next={fetchMore}
        hasMore={hasMore}
        loader={
          <div className='loading'>
            Loading more…{' '}
            <svg viewBox='0 0 38 38' xmlns='http://www.w3.org/2000/svg' stroke='#000'>
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
        <div className='sketchplanations'>
          {results.map((sketchplanation) => (
            <Sketchplanation key={sketchplanation.uid} sketchplanation={sketchplanation} />
          ))}
        </div>
      </InfiniteScroll>
      <style jsx>{`
        nav a:hover {
          text-decoration: underline;
        }

        .loading {
          @apply flex mx-auto pb-20 items-center justify-center;
          max-width: 460px;
        }

        .loading svg {
          @apply ml-4;
          width: 20px;
          height: 20px;
        }
      `}</style>
    </div>
  )
}

Home.getInitialProps = async () => {
  const sketchplanations = await client.query(Prismic.Predicates.at('document.type', 'sketchplanation'), {
    orderings: '[my.sketchplanation.published_at desc]',
    pageSize: 4,
  })

  return { sketchplanations }
}

export default Home
