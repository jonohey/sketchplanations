import Head from 'next/head'

import { Page } from 'components'
import { pageTitle } from 'helpers'
import { client } from 'services/prismic'

const Licence = ({ document }) => {
  return (
    <>
      <Head>
        <title>{pageTitle('Licence')}</title>
      </Head>
      <Page document={document} />
    </>
  )
}

Licence.getInitialProps = async () => {
  const document = await client.getSingle('licence')
  return { document }
}

export default Licence
