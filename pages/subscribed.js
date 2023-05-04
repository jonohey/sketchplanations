import Head from 'next/head'

import { Page } from 'components'
import { pageTitle } from 'helpers'
import { client } from 'services/prismic'

const Subscribed = ({ document }) => {
  return (
    <>
      <Head>
        <title>{pageTitle('Subscribed')}</title>
      </Head>
      <Page document={document} />
    </>
  )
}

Subscribed.getInitialProps = async () => {
  const document = await client.getSingle('subscribed')
  return { document }
}

export default Subscribed
