import Head from 'next/head'

import { Page } from 'components'
import { client } from 'services/prismic'

const Thanks = ({ document }) => {
  return (
    <>
      <Head>
        <meta
          name='description'
          content='Sketchplanations exists thanks to the generous patrons and followers who support me making them'
        />
      </Head>
      <Page document={document} />
    </>
  )
}

Thanks.getInitialProps = async () => {
  const document = await client.getSingle('thanks')
  return { document }
}

export default Thanks
