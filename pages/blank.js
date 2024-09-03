import Head from 'next/head'

import { pageTitle } from 'helpers'

const Explore = () => {
  return (
    <>
      <Head>
        <title>{pageTitle('Blank')}</title>
        <meta
          name='description'
          content='Explore the archive of 800+ sketches. Search, browse, or explore popular topics'
        />
      </Head>
    </>
  )
}

export default Explore
