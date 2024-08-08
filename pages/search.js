import Head from 'next/head'

import styles from './search.module.css'

import SearchForm from 'components/SearchForm'
import SearchResults from 'components/SearchResults'
import { isPresent, pageTitle } from 'helpers'
import useSearch from 'hooks/useSearch'
import { client } from 'services/prismic'

const Search = ({ initialResults }) => {
  const { query, setQuery, reset, busy } = useSearch()

  const dynamicPageTitle = isPresent(query) ? `Search: ${query}` : 'Search'

  return (
    <>
      <Head>
        <title>{pageTitle(dynamicPageTitle)}</title>
        <meta name='description' content='Search the archive of 800+ sketches. Search or browse popular topics' />
      </Head>
      <div className={styles.root}>
        <div className={styles['search-form']}>
          <SearchForm
            isBusy={busy}
            value={query}
            onChange={setQuery}
            onReset={reset}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                reset()
              }
            }}
            autoFocus
          />
        </div>
        <SearchResults initialResults={initialResults} />
      </div>
    </>
  )
}

export async function getStaticProps() {
  const initialResults = await client.getAllByType('sketchplanation', {
    orderings: [
      {
        field: 'my.sketchplanation.published_at',
        direction: 'desc',
      },
    ],
    limit: 20,
  })

  return { props: { initialResults } }
}

export default Search
