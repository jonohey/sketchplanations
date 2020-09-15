import React from 'react'
import Prismic from 'prismic-javascript'
import { client } from '../prismic-configuration'
import { Sketchplanation } from '../components/Sketchplanation'

const Archive = ({ sketchplanations, tags }) => {
  return (
    <>
      <pre>{JSON.stringify(sketchplanations, null, 2)}</pre>
      <ul>
        {tags.results.map((tag) => (
          <li key='tag.id'>{tag.data.identifier}</li>
        ))}
      </ul>
    </>
  )
}

Archive.getInitialProps = async (context) => {
  const sketchplanations = await client.query(Prismic.Predicates.at('document.type', 'sketchplanation'), {
    orderings: '[my.sketchplanation.published_at desc]',
    pageSize: 100,
  })

  const tags = await client.query(Prismic.Predicates.at('document.type', 'tag'), {
    orderings: '[my.tag.identifier desc]',
    pageSize: 100,
  })

  return { sketchplanations, tags }
}

export default Archive
