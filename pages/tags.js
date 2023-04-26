import { sort } from 'fast-sort'
import Link from 'next/link'
import useCookie from 'react-use-cookie'

import SortButtons from 'components/SortButtons'
import { client } from 'services/prismic'

import styles from './tags.module.css'

const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0)

const Tags = ({ tagsByName, tagsByCount }) => {
  const [sort, setSort] = useCookie('tagsSort', 'name')

  return (
    <>
      <div className='pt-6 px-6 max-w-md mx-auto'>
        <SortButtons
          value={sort}
          onChange={setSort}
          options={[
            { label: 'A-Z', value: 'name' },
            { label: 'Frequency', value: 'count' },
          ]}
        />
      </div>

      {sort === 'name' && (
        <div className={styles.tags}>
          {tagsByName.map(({ tag, slug, count }) => (
            <Link key={slug} href={`/tags/${slug}`}>
              {tag} <b>{count}</b>
            </Link>
          ))}
        </div>
      )}
      {sort === 'count' && (
        <div className={styles.tags}>
          {tagsByCount.map(({ tag, slug, count }) => (
            <Link key={slug} href={`/tags/${slug}`}>
              {tag} <b>{count}</b>
            </Link>
          ))}
        </div>
      )}
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
