import React from 'react'
import Prismic from 'prismic-javascript'
import { client } from '../prismic-configuration'
import { Sketchplanation } from '../components/Sketchplanation'

const Home = ({ sketchplanations }) => {
  return (
    <div className='sketchplanations'>
      {sketchplanations.results.map((sketchplanation) => (
        <Sketchplanation key={sketchplanation.uid} sketchplanation={sketchplanation} />
      ))}
    </div>
  )
}

Home.getInitialProps = async (context) => {
  const sketchplanations = await client.query(Prismic.Predicates.at('document.type', 'sketch'), {
    orderings: '[my.sketchplanation.date desc]',
  })

  return { sketchplanations }
}

export default Home
