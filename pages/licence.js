import React from 'react'
import { client } from 'prismic-configuration'

const Post = ({ document }) => {
  return (
    <>
      <pre>sketchplanation:{JSON.stringify(document, null, 2)}</pre>
    </>
  )
}

Post.getInitialProps = async () => {
  const document = await client.getSingle('licence')
  return { document }
}

export default Post
