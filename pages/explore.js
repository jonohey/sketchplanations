import Head from 'next/head'
import Link from 'next/link'

import SearchForm from 'components/SearchForm'
import SketchplanationsGrid from 'components/SketchplanationsGrid'
import Tags from 'components/Tags'
import { pageTitle } from 'helpers'
import useSearch from 'hooks/useSearch'
import { client } from 'services/prismic'

import styles from './explore.module.css'

const Explore = ({ initialSketchplanations }) => {
  const { query, setQuery, reset, results, tagResults, busy } = useSearch()

  return (
    <>
      <Head>
        <title>{pageTitle('Explore')}</title>
        <meta
          name='description'
          content='Explore the archive of 800+ sketches. Search, browse, or explore popular topics'
        />
      </Head>
      <div className={styles.root}>
        <h1 className='sr-only'>Explore</h1>
        <SearchForm isBusy={busy} value={query} onChange={setQuery} onReset={reset} />
        <div className={styles.links}>
          <Link href='/tags' className={styles.link}>
            Categories
          </Link>
          <Link href='/archive' className={styles.link}>
            Archive
          </Link>
        </div>
        {tagResults && <Tags tags={tagResults} />}
        <div className={styles.gallery}>
          <SketchplanationsGrid prismicDocs={results || initialSketchplanations} />
        </div>
      </div>
    </>
  )
}

export async function getStaticProps() {
  const initialSketchplanations = await client.getAllByType('sketchplanation', {
    orderings: [
      {
        field: 'my.sketchplanation.published_at',
        direction: 'desc',
      },
    ],
    limit: 20,
  })

  return { props: { initialSketchplanations } }
}

export default Explore
