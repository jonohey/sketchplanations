import React from 'react'
import { client } from 'prismic-configuration'

const Privacy = ({ document }) => {
  return (
    <>
      <pre>sketchplanation:{JSON.stringify(document, null, 2)}</pre>
    </>
  )
}

Privacy.getInitialProps = async () => {
  const document = await client.getSingle('privacy')
  return { document }
}

export default Privacy
