import React from 'react'
import { client } from 'prismic-configuration'

const Thanks = ({ document }) => {
  return (
    <>
      <pre>{JSON.stringify(document, null, 2)}</pre>
    </>
  )
}

Thanks.getInitialProps = async () => {
  const document = await client.getSingle('thanks')
  return { document }
}

export default Thanks
