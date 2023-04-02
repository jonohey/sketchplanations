import classNames from 'classnames'
import { sort } from 'fast-sort'
import Link from 'next/link'
import useCookie from 'react-use-cookie'

import { client } from 'services/prismic'

import styles from './tags.module.css'

const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0)

const SortButton = ({ active, children, ...props }) => (
  <button className={classNames(styles['sort-button'], active && styles['sort-button-active'])} {...props}>
    {children}
  </button>
)

const Tags = ({ tagsByName, tagsByCount }) => {
  const [sort, setSort] = useCookie('tagsSort', 'name')

  return (
    <>
      <div className={styles['sort-buttons']}>
        <SortButton active={sort === 'name'} type='button' onClick={() => setSort('name')}>
          A-Z
        </SortButton>
        <SortButton active={sort === 'count'} type='button' onClick={() => setSort('count')}>
          Frequency
        </SortButton>
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
