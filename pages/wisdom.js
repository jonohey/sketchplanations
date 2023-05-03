import Head from 'next/head'

import { Page } from 'components'
import { client } from 'services/prismic'

const Wisdom = ({ document }) => {
  return (
    <>
      <Head>
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
