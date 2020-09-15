import React from 'react'
import Prismic from 'prismic-javascript'
import { client } from '../prismic-configuration'
import { Sketchplanation } from '../components/Sketchplanation'

const Home = ({ sketchplanations }) => {
  return (
    <pre>{JSON.stringify(sketchplanations, null, 2)}</pre>
  )
}

Home.getInitialProps = async (context) => {
  const sketchplanations = await client.query(Prismic.Predicates.at('document.type', 'sketchplanation'), {
    orderings: '[my.sketchplanation.published_at desc]',
    pageSize: 100,
  })

  return { sketchplanations }
}

export default Home
