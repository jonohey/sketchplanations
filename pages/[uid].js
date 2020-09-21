import React from 'react'
import { client } from 'prismic-configuration'
import { RichText } from 'prismic-reactjs'
import { Sketchplanation } from 'components'
import Head from 'next/head'

const Post = ({ sketchplanation }) => {
  const {
    data: { image, title, body },
    uid,
  } = sketchplanation

  return (
    <>
      <Head>
        <meta property='og:title' content={title} />
        <meta property='og:description' content={RichText.asText(body)} />
        <meta property='og:image' content={`${image.url}&w=1200`} />
        <meta property='og:url' content={`https://sketchplanations.vercel.app/${uid}`} />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:image:alt' content={title} />
      </Head>
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
