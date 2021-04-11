import Prismic from 'prismic-javascript'
import Link from 'next/link'
import { client } from 'prismic-configuration'
import { sort } from 'fast-sort'
import useCookie from 'react-use-cookie'

const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0)

const SortButton = ({ children, ...props }) => (
  <>
    <button {...props}>{children}</button>
    <style jsx>{`
      button {
        @apply relative py-2 px-4 border text-sm;
        color: ${props.active ? '#fff' : 'inherit'};
        border-color: ${props.active ? '#1253B5' : '#e2e8f0'};
        background-color: ${props.active ? '#1253B5' : '#fff'};
      }
    `}</style>
  </>
)

const Tags = ({ tagsByName, tagsByCount }) => {
  const [sort, setSort] = useCookie('tagsSort', 'name')

  return (
    <>
      <div className='sort-buttons'>
        <SortButton className='sort-button' active={sort === 'name'} type='button' onClick={() => setSort('name')}>
          A-Z
        </SortButton>
        <SortButton className='sort-button' active={sort === 'count'} type='button' onClick={() => setSort('count')}>
          Frequency
        </SortButton>
      </div>
      {sort === 'name' && (
        <div className='tags'>
          {tagsByName.map(({ tag, slug, count }) => (
            <Link key={slug} href={`/tags/${slug}`}>
              <a>
                {tag} <b>{count}</b>
              </a>
            </Link>
          ))}
        </div>
      )}
      {sort === 'count' && (
        <div className='tags'>
          {tagsByCount.map(({ tag, slug, count }) => (
            <Link key={slug} href={`/tags/${slug}`}>
              <a>
                {tag} <b>{count}</b>
              </a>
            </Link>
          ))}
        </div>
      )}
      <style jsx>{`
        .sort-buttons {
          @apply flex justify-end pt-6 px-6;
        }

        .sort-buttons :global(> *:first-child) {
          @apply rounded-l-md;
        }

        .sort-buttons :global(> *:last-child) {
          @apply rounded-r-md;
        }

        .sort-buttons :global(> * + *) {
          margin-left: -1px;
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
