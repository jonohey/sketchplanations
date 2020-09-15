import React from 'react'
import Prismic from 'prismic-javascript'
import Link from 'next/link'
import { client } from '../prismic-configuration'
import { Sketchplanation } from '../components/Sketchplanation'

const Archive = ({ sketchplanations, tags }) => {
  return (
    <div className='flex'>
      <div className='w-1/2'>
        <h2>Sketchplanations</h2>
        <ul>
          {sketchplanations.results.map((sketchplanation) => (
            <li key={sketchplanation.id}>{sketchplanation.data.title}</li>
          ))}
        </ul>
      </div>
      <div className='w-1/2'>
        <h3>Tags</h3>
        <ul>
          {tags.results.map((tag) => (
            <li key={tag.id}>
              <Link href={`/tags/${tag.data.identifier}`}>{tag.data.identifier}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

Archive.getInitialProps = async (context) => {
  const sketchplanations = await client.query(Prismic.Predicates.at('document.type', 'sketchplanation'), {
    orderings: '[my.sketchplanation.published_at asc]',
    pageSize: 100,
  })

  const tags = await client.query(Prismic.Predicates.at('document.type', 'tag'), {
    orderings: '[my.tag.identifier desc]',
    pageSize: 100,
  })

  return { sketchplanations, tags }
}

export default Archive
