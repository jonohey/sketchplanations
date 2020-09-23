import React from 'react'
import Prismic from 'prismic-javascript'
import Link from 'next/link'
import { client } from 'prismic-configuration'

const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0)

const Tags = ({ sketchplanations, tags }) => {
  const tagsFromSketchplanations = sketchplanations
    .map((sketchplanation) => sketchplanation.data.tags.map((tag) => tag.tag.slug))
    .flat()
    .filter((tag) => tag)

  const tagsWithCounts = tags.map((tag) => {
    const identifier = tag.data.identifier
    const slug = tag.slugs[0]
    return {
      tag: identifier,
      slug,
      count: countOccurrences(tagsFromSketchplanations, slug),
    }
  })

  return (
    <>
      <div className='tags'>
        {tagsWithCounts.map(({ tag, slug, count }) => (
          <Link key={tag} href={`/tags/${slug}`}>
            <a>
              {tag} <b>{count}</b>
            </a>
          </Link>
        ))}
      </div>
      <style jsx>{`
        .tags {
          @apply flex flex-wrap justify-center p-6 pb-20;
        }

        .tags a {
          @apply relative py-2 px-4 m-2 rounded-full border text-sm;
          transition: all 0.1s ease-out;
        }

        @screen sm {
          .tags a {
            @apply text-base;
          }
        }

        .tags b {
          @apply text-xs;
          opacity: 0.5;
        }

        .tags a:hover {
          @apply bg-bright-red text-white border-bright-red shadow;
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
    sketchplanations.push(...response.results)
    page++
    hasNextPage = page <= response.total_pages
  } while (hasNextPage)

  return sketchplanations
}

Tags.getInitialProps = async () => {
  const sketchplanations = await queryAll(Prismic.Predicates.at('document.type', 'sketchplanation'), {
    orderings: '[my.sketchplanation.published_at desc]',
  })

  const tags = await queryAll(Prismic.Predicates.at('document.type', 'tag'), {
    orderings: '[my.tag.identifier]',
  })

  return { sketchplanations, tags }
}

export default Tags
