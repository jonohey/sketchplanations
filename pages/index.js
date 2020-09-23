import React from 'react'
import Prismic from 'prismic-javascript'
import Link from 'next/link'
import { client } from 'prismic-configuration'
import { Sketchplanation, Navigation } from 'components'

const Home = ({ sketchplanations }) => {
  return (
    <div>
      <div className='masthead'>
        <img src='/logo.svg' alt='Sketchplanations' />
        <p className='sm:text-lg'>Explaining one thing a week in a sketch</p>
        <Navigation />
      </div>
      <div className='sketchplanations'>
        {sketchplanations.results.map((sketchplanation) => (
          <Sketchplanation key={sketchplanation.uid} sketchplanation={sketchplanation} />
        ))}
      </div>
      <style jsx>{`
        nav a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}

Home.getInitialProps = async () => {
  const sketchplanations = await client.query(Prismic.Predicates.at('document.type', 'sketchplanation'), {
    orderings: '[my.sketchplanation.published_at desc]',
    pageSize: 100,
  })

  return { sketchplanations }
}

export default Home
