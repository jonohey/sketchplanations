import React from 'react'
import { client } from 'prismic-configuration'

const About = ({ document }) => {
  return (
    <>
      <pre>{JSON.stringify(document, null, 2)}</pre>
    </>
  )
}

About.getInitialProps = async () => {
  const document = await client.getSingle('about')
  return { document }
}

export default About
