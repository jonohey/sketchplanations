import { ButtonGroup } from 'components'
import { client } from 'prismic-configuration'
import { sort } from 'fast-sort'
import { useCookie } from 'next-cookie'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Prismic from 'prismic-javascript'

const sortByOptions = [
  { label: 'A-Z', value: 'name' },
  { label: 'Frequency', value: 'count' },
]

const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0)

const cookieName = 'tagsSortBy'

const Tags = ({ tagsByName, tagsByCount }) => {
  const cookie = useCookie()
  const [sortBy, setSortBy] = useState(null)

  const handleSortByChange = (newSortBy) => {
    setSortBy(newSortBy)
    cookie.set(cookieName, newSortBy)
  }

  useEffect(() => {
    setSortBy(cookie.get(cookieName) || 'name')
  }, [])

  return (
    <>
      <div>
        <div className='sort-buttons'>
          <ButtonGroup label='Sort by' onChange={handleSortByChange} options={sortByOptions} value={sortBy} />
        </div>
        <div className='tags tags-by-name'>
          {tagsByName.map(({ tag, slug, count }) => (
            <Link key={slug} href={`/tags/${slug}`}>
              <a>
                {tag} <b>{count}</b>
              </a>
            </Link>
          ))}
        </div>
        <div className='tags tags-by-count'>
          {tagsByCount.map(({ tag, slug, count }) => (
            <Link key={slug} href={`/tags/${slug}`}>
              <a>
                {tag} <b>{count}</b>
              </a>
            </Link>
          ))}
        </div>
      </div>
      <style jsx>{`
        .sort-buttons {
          @apply flex justify-center pt-6 px-6;
        }

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

        .tags-by-name {
          display: ${sortBy === 'name' ? 'flex' : 'none'};
        }

        .tags-by-count {
          display: ${sortBy === 'count' ? 'flex' : 'none'};
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

  const tagsByName = tags
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

  const tagsByCount = sort(tagsByName).desc((tag) => tag.count)

  return { props: { tagsByName, tagsByCount } }
}

export default Tags
