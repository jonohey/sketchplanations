import { useState } from 'react'
import { compose, sortBy, prop, reverse } from 'ramda'
import Prismic from 'prismic-javascript'
import Link from 'next/link'
import { client } from 'prismic-configuration'

const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0)

const sortByCountDesc = compose(reverse, sortBy(prop('count')))

const Tags = ({ tagsWithCounts }) => {
  const [view, setView] = useState('alphabetical')

  const sortedTagsWithCounts = view === 'frequency' ? sortByCountDesc(tagsWithCounts) : tagsWithCounts

  return (
    <>
      {/* <div onChange={(e) => setView(e.target.value)}>
        <label>
          <input type='radio' name='view' value='alphabetical' checked={view === 'alphabetical'} /> A-Z
        </label>
        <label>
          <input type='radio' name='view' value='frequency' checked={view === 'frequency'} /> Frequency
        </label>
      </div> */}
      <button type='button' onClick={() => setView('alphabetical')}>
        A-Z
      </button>
      <button type='button' onClick={() => setView('frequency')}>
        Frequency
      </button>
      <div className='tags'>
        {sortedTagsWithCounts.map(({ tag, slug, count }) => (
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

export async function getStaticProps() {
  const sketchplanations = await queryAll(Prismic.Predicates.at('document.type', 'sketchplanation'), {
    orderings: '[my.sketchplanation.published_at desc]',
  })

  const tags = await queryAll(Prismic.Predicates.at('document.type', 'tag'), {
    orderings: '[my.tag.identifier]',
  })

  const tagsFromSketchplanations = sketchplanations
    .map((sketchplanation) => sketchplanation.data.tags.map((tag) => tag.tag.slug))
    .flat()
    .filter((tag) => tag)

  const tagsWithCounts = tags
    .map((tag) => {
      const identifier = tag.data.identifier
      const slug = tag.slugs[0]
      return {
        tag: identifier,
        slug,
        count: countOccurrences(tagsFromSketchplanations, slug),
      }
    })
    .filter((tag) => tag.count > 0)

  return { props: { tagsWithCounts } }
}

export default Tags
