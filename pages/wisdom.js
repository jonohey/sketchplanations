import Head from 'next/head'

import { Page } from 'components'
import { pageTitle } from 'helpers'
import { client } from 'services/prismic'

const Wisdom = ({ document }) => {
  return (
    <>
      <Head>
        <title>{pageTitle('Wisdom')}</title>
        <meta name='description' content='A collection of wise words and quotes to live by' />
      </Head>
      <Page document={document} />
    </>
  )
}

Wisdom.getInitialProps = async () => {
  const document = await client.getSingle('wisdom')
  return { document }
}

export default Wisdom
