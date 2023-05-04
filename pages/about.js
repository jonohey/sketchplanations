import Head from 'next/head'

import { Page } from 'components'
import { pageTitle } from 'helpers'
import { client } from 'services/prismic'

const About = ({ document }) => {
  return (
    <>
      <Head>
        <title>{pageTitle('About')}</title>
        <meta
          name='description'
          content='Everything you wanted to know about why Sketchplanations exists, how it’s made and how you can support it.'
        />
      </Head>
      <Page document={document} />
    </>
  )
}

About.getInitialProps = async () => {
  const document = await client.getSingle('about')
  return { document }
}

export default About
