import React from 'react'
import Prismic from 'prismic-javascript'
import { client } from 'prismic-configuration'
import { RichText } from 'prismic-reactjs'
import { Sketchplanation } from 'components'
import Head from 'next/head'
import { pageTitle } from 'helpers'

const Post = ({ sketchplanation, similarSketchplanations }) => {
  const {
    data: { image, title, body },
    uid,
  } = sketchplanation

  return (
    <>
      <Head>
        <title>{pageTitle(title)}</title>
        <meta property='og:title' content={title} />
        <meta property='og:description' content={RichText.asText(body)} />
        <meta property='og:image' content={`${image.url}&w=1200`} />
        <meta property='og:url' content={`https://sketchplanations.vercel.app/${uid}`} />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:image:alt' content={title} />
      </Head>
      <div className='sketchplanations'>
        <Sketchplanation sketchplanation={sketchplanation} fullPost />
      </div>
      <h2 className='similar-header'>Want more? Try these…</h2>
      <div className='similar'>
        {similarSketchplanations.results.map((sketchplanation) => (
          <div key={sketchplanation.id}>
            <Sketchplanation sketchplanation={sketchplanation} />
          </div>
        ))}
      </div>
      <style jsx>{`
        .similar-header {
          @apply mb-10 text-center;
        }

        .similar {
          @apply flex flex-wrap px-6 pt-10 pb-20;
          border-top: solid 1px rgba(0, 0, 0, 0.04);
          box-shadow: 0 -2.3rem 1rem -2rem rgba(0, 0, 0, 0.03);
        }

        @screen sm {
          .similar {
            @apply px-3;
          }
        }

        .similar > * {
          @apply w-full;
        }

        .similar > * + * {
          @apply mt-16;
        }

        @screen sm {
          .similar > * + * {
            @apply mt-0;
          }
        }

        @screen sm {
          .similar > * {
            @apply w-1/3;
          }
        }
      `}</style>
    </>
  )
}

Post.getInitialProps = async ({ query: { uid } }) => {
  const sketchplanation = await client.getByUID('sketchplanation', uid)
  const similarSketchplanations = await client.query(Prismic.Predicates.similar(sketchplanation.id, 3), { pageSize: 3 })

  return { sketchplanation, similarSketchplanations }
}

export default Post
