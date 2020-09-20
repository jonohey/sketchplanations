import React from 'react'
import { client } from 'prismic-configuration'
import { Sketchplanation } from 'components'

const Post = ({ sketchplanation }) => {
  return (
    <>
      {/* <pre>sketchplanation:{JSON.stringify(sketchplanation, null, 2)}</pre> */}
      <div className='sketchplanations-wrapper'>
        <div className='sketchplanations'>
          <Sketchplanation sketchplanation={sketchplanation} fullPost />
        </div>
      </div>
    </>
  )
}

Post.getInitialProps = async ({ query: { uid } }) => {
  const sketchplanation = await client.getByUID('sketchplanation', uid)
  // const sketchplanation = query

  return { sketchplanation }
}

export default Post
