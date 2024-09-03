import { sort } from 'fast-sort'
import Head from 'next/head'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import useCookie from 'react-use-cookie'

import styles from './categories.module.css'

import SortButtons from 'components/SortButtons'
import { pageTitle } from 'helpers'
import { client } from 'services/prismic'

const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0)

const Categories = ({ tagsByName, tagsByCount }) => {
  const [sort, setSort] = useState('count') // Default value
  const [cookieSort, setCookieSort] = useCookie('tagsSort', 'count')

  useEffect(() => {
    if (cookieSort) {
      setSort(cookieSort)
    }
  }, [cookieSort])

  console.log({ sort })

  return (
    <>
      <Head>
        <title>{pageTitle('Categories')}</title>
        <meta name='description' content='The most common topics and themes of Sketchplanations' />
      </Head>
      <h1 className='sr-only'>Categories</h1>
      <div className='pt-6 px-6 max-w-md mx-auto'>
        <SortButtons
          value={sort}
          onChange={setCookieSort}
          options={[
            { label: 'Frequency', value: 'count' },
            { label: 'A-Z', value: 'name' },
          ]}
        />
      </div>
      {sort === 'name' && (
        <div className={styles.tags}>
          {tagsByName.map(({ tag, slug, count }) => (
            <Link key={slug} href={`/categories/${slug}`}>
              {tag} <b>{count}</b>
            </Link>
          ))}
        </div>
      )}
      {sort === 'count' && (
        <div className={styles.tags}>
          {tagsByCount.map(({ tag, slug, count }) => (
            <Link key={slug} href={`/categories/${slug}`}>
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
    orderings: [
      {
        field: 'my.sketchplanation.published_at',
        direction: 'desc',
      },
    ],
  })

  const tags = await client.getAllByType('tag', {
    orderings: [
      {
        field: 'my.tag.identifier',
      },
    ],
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

export default Categories
