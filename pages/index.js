import React from 'react'
import Prismic from 'prismic-javascript'
import { client } from '../prismic-configuration'
import { Sketchplanation } from '../components/Sketchplanation'

const Home = ({ sketchplanations }) => {
  return (
    <div className='sketchplanations-wrapper'>
      <div className='masthead'>
        <img src='/logo.svg' alt='Sketchplanations' />
        <p className='sm:text-lg'>Explaining one thing a week in a sketch</p>
      </div>
      <div className='sketchplanations'>
        {sketchplanations.results.map((sketchplanation) => (
          <Sketchplanation key={sketchplanation.uid} sketchplanation={sketchplanation} />
        ))}
      </div>
    </div>
  )
}

Home.getInitialProps = async (context) => {
  const sketchplanations = await client.query(Prismic.Predicates.at('document.type', 'sketchplanation'), {
    orderings: '[my.sketchplanation.published_at desc]',
  })

  return { sketchplanations }
}

export default Home
