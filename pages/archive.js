import React, { useState } from 'react'
import Prismic from 'prismic-javascript'
import Link from 'next/link'
import { client } from 'prismic-configuration'
import Sketchplanation from 'components'

const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0)

const Archive = ({ sketchplanations, tags }) => {
  const tagsFromSketchplanations = sketchplanations
    .map((sketchplanation) => sketchplanation.data.tags.map((tag) => tag.tag.slug))
    .flat()
    .filter((tag) => tag)

  const tagsWithCounts = tags.map((tag) => {
    const identifier = tag.data.identifier
    return {
      tag: identifier,
      count: countOccurrences(tagsFromSketchplanations, identifier),
    }
  })

  return (
    <>
      {/* <pre>{JSON.stringify(tagsFromSketchplanations, null, 2)}</pre> */}
      {/* <pre>{JSON.stringify(tagsWithCounts, null, 2)}</pre> */}
      <div className='flex'>
        <div className='w-1/2'>
          <h2>Sketchplanations</h2>
          <ul>
            {sketchplanations.map((sketchplanation) => (
              <li key={sketchplanation.id}>
                {sketchplanation.data.title}
                <img width={250} src={`${sketchplanation.data.image.url}&w=500`} />
              </li>
            ))}
          </ul>
        </div>
        <div className='w-1/2'>
          <h3>Tags</h3>
          <ul>
            {tagsWithCounts.map(({ tag, count }) => (
              <li key={tag}>
                <Link href={`/tags/${tag}`}>
                  <>
                    {tag} <b>{count}</b>
                  </>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <style jsx>{`
        b {
          font-weight: 600;
        }
      `}</style>
    </>
  )
}

const queryAll = async (predicates, options = {}) => {
  let page = 1
  let hasNextPage = true
  const sketchplanations = []

  do {
    let response = await client.query(predicates, {
      ...options,
      pageSize: 100,
      page,
    })
    console.log('response.total_pages', response.total_pages, page)
    sketchplanations.push(...response.results)
    page++
    hasNextPage = page <= response.total_pages
  } while (hasNextPage)

  return sketchplanations
}

Archive.getInitialProps = async (context) => {
  const sketchplanations = await queryAll(Prismic.Predicates.at('document.type', 'sketchplanation'), {
    orderings: '[my.sketchplanation.published_at desc]',
  })
  const tags = await queryAll(Prismic.Predicates.at('document.type', 'tag'), {
    orderings: '[my.tag.identifier]',
  })

  return { sketchplanations, tags }
}

export default Archive
