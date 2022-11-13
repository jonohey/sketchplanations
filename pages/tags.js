import { sort } from 'fast-sort'
import Link from 'next/link'
import useCookie from 'react-use-cookie'
import { Predicates } from '@prismicio/client'
import { client } from 'services/prismic'

const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0)

const SortButton = ({ children, ...props }) => (
  <>
    <button {...props}>{children}</button>
    <style jsx>{`
      button {
        @apply relative py-1 px-4 border text-sm;
        border-color: ${props.active ? 'var(--color-brightRed)' : 'var(--color-inputBg)'};
        background-color: ${props.active ? 'var(--color-brightRed)' : 'var(--color-inputBg)'};
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
          @apply flex justify-center pt-6 px-6;
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
          @apply relative py-2 px-4 m-2 rounded-full border border-border text-sm;
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
          @apply bg-brightRed text-white border-brightRed shadow;
        }
      `}</style>
    </>
  )
}

export async function getStaticProps() {
  const sketchplanations = await client.getAllByType('sketchplanation', {
    orderings: {
      field: 'my.sketchplanation.published_at',
      direction: 'desc',
    },
  })

  const tags = await client.getAllByType('tag', {
    orderings: {
      field: 'my.tag.identifier',
    },
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
